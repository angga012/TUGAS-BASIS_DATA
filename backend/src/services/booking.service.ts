import { pool } from "../config/database";

export const createBookingService = async (bookingData: any) => {
  const { 
    customer_id, 
    field_id, 
    booking_date, 
    duration, 
    price_total,
    payment_method, // 'Cash' | 'Transfer' | 'E-Wallet'
    bank_name,      // Diisi jika memilih Transfer (misal: 'BCA', 'Mandiri')
    wallet_type     // Diisi jika memilih E-Wallet (misal: 'Gopay', 'OVO')
  } = bookingData;

  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    // ==========================================
    // LOGIKA POIN 3: CEK STATUS MEMBERSHIP CUSTOMER
    // ==========================================
    let discount = 0;
    let finalPrice = price_total;

    const memberCheck = await client.query(
      `SELECT membership_level FROM tb_member_customer WHERE customer_id = $1 AND expired_date >= CURRENT_DATE`,
      [customer_id]
    );

    if (memberCheck.rows.length > 0) {
      // Jika member aktif ditemukan, berikan potongan diskon 10%
      discount = price_total * 0.10;
      finalPrice = price_total - discount;
    }

    // ==========================================
    // LOGIKA PENDUKUNG: MANAJEMEN SLOT JADWAL
    // ==========================================
    let targetScheduleId: number;
    const scheduleCheck = await client.query(
      `SELECT schedule_id FROM tb_schedule WHERE field_id = $1 AND available_date = $2 AND status = 'Available' LIMIT 1`,
      [field_id, booking_date]
    );

    if (scheduleCheck.rows.length > 0) {
      targetScheduleId = scheduleCheck.rows[0].schedule_id;
      // Update status jadwal menjadi 'Booked' karena sudah dipesan
      await client.query(`UPDATE tb_schedule SET status = 'Booked' WHERE schedule_id = $1`, [targetScheduleId]);
    } else {
      // Jika belum dibuka oleh staff, sistem otomatis membukakan secara instan dengan status 'Booked'
      const insertSchedule = await client.query(
        `INSERT INTO tb_schedule (field_id, available_date, start_time, end_time, status)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '1 hour' * $3, 'Booked')
         RETURNING schedule_id`,
        [field_id, booking_date, duration || 2]
      );
      targetScheduleId = insertSchedule.rows[0].schedule_id;
    }

    // 1. INSERT INTO tb_booking
    const bookingQuery = `
      INSERT INTO tb_booking (booking_date, booking_time, duration, customer_id, schedule_id, notes)
      VALUES ($1, NOW(), $2, $3, $4, 'Transaksi Diproses Sistem Mutakhir')
      RETURNING booking_id;
    `;
    const bookingResult = await client.query(bookingQuery, [booking_date, duration || 2, customer_id, targetScheduleId]);
    const bookingId = bookingResult.rows[0].booking_id;

    // 2. INSERT INTO tb_booking_detail (Menyimpan kalkulasi diskon dan finalPrice)
    const detailQuery = `
      INSERT INTO tb_booking_detail (booking_id, booking_type, start_period, end_period, total_sessions, price_total, discount, description)
      VALUES ($1, 'Futsal Match', $2, $2, 1, $3, $4, $5);
    `;
    const descDetail = discount > 0 ? `Mendapatkan Diskon Member 10%` : `Tarif Normal Regular`;
    await client.query(detailQuery, [bookingId, booking_date, finalPrice, discount, descDetail]);

    // ==========================================
    // LOGIKA POIN 2: PERCABANGAN METODE PEMBAYARAN (XOR ARC)
    // ==========================================
    let cash_payment_id: number | null = null;
    let transfer_payment_id: number | null = null;
    let ewallet_payment_id: number | null = null;

    const normalizedMethod = payment_method ? payment_method.toLowerCase() : 'cash';

    if (normalizedMethod === 'transfer') {
      const resTransfer = await client.query(
        `INSERT INTO tb_transfer_payment (bank_name) VALUES ($1) RETURNING transfer_payment_id`,
        [bank_name || 'BCA/Mandiri Bersama']
      );
      transfer_payment_id = resTransfer.rows[0].transfer_payment_id;
    } else if (normalizedMethod === 'e-wallet' || normalizedMethod === 'ewallet') {
      const resEwallet = await client.query(
        `INSERT INTO tb_ewallet_payment (wallet_type) VALUES ($1) RETURNING ewallet_payment_id`,
        [wallet_type || 'QRIS GoPay']
      );
      ewallet_payment_id = resEwallet.rows[0].ewallet_payment_id;
    } else {
      // Default: Cash Payment
      const resCash = await client.query(`INSERT INTO tb_cash_payment DEFAULT VALUES RETURNING cash_payment_id`);
      cash_payment_id = resCash.rows[0].cash_payment_id;
    }

    // 3. INSERT INTO tb_payment (Menghubungkan ID tabel anak yang sesuai agar lolos CHECK CONSTRAINT)
    const paymentQuery = `
      INSERT INTO tb_payment (payment_method, payment_type, payment_date, amount, booking_id, cash_payment_id, transfer_payment_id, ewallet_payment_id)
      VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
      RETURNING payment_id;
    `;
    const paymentResult = await client.query(paymentQuery, [
      payment_method || 'Cash',
      payment_method ? payment_method.toUpperCase() : 'CASH',
      finalPrice,
      bookingId,
      cash_payment_id,
      transfer_payment_id,
      ewallet_payment_id
    ]);

    await client.query("COMMIT");

    return {
      booking_id: bookingId,
      schedule_id: targetScheduleId,
      payment_id: paymentResult.rows[0].payment_id,
      biaya_awal: price_total,
      potongan_diskon: discount,
      total_wajib_bayar: finalPrice,
      metode_pembayaran_terpilih: payment_method || 'Cash',
      status: "SUKSES TERVERIFIKASI"
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllBookingsService = async () => {
  const query = `
    SELECT 
      b.booking_id, b.booking_date, b.booking_time, b.duration,
      c.customer_name, c.email,
      f.field_name,
      d.price_total, d.discount,
      p.payment_method, p.amount
    FROM tb_booking b
    JOIN tb_customer c ON b.customer_id = c.customer_id
    JOIN tb_schedule s ON b.schedule_id = s.schedule_id
    JOIN tb_field f ON s.field_id = f.field_id
    LEFT JOIN tb_booking_detail d ON b.booking_id = d.booking_id
    LEFT JOIN tb_payment p ON b.booking_id = p.booking_id
    ORDER BY b.booking_time DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};