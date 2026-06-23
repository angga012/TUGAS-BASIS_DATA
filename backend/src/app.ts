import express from "express";
import cors from "cors";
import { pool } from "./config/database"; // Pastikan path ini benar
import authRoutes from "./routes/auth.routes";
import customerRoutes from "./routes/customer.routes";
import fieldRoutes from "./routes/field.routes";
import bookingRoutes from "./routes/booking.routes";
import scheduleRoutes from "./routes/schedule.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// DAFTAR ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/fields", fieldRoutes); 
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);

// DASHBOARD SUMMARY - DATA ASLI DARI DATABASE
app.get("/api/dashboard-summary", async (req, res) => {
  try {
    // 1. Ambil data statistik dari berbagai tabel
    const countCust = await pool.query("SELECT COUNT(*) FROM tb_customer");
    const countField = await pool.query("SELECT COUNT(*) FROM tb_field");
    const countBooking = await pool.query("SELECT COUNT(*) FROM tb_booking");

    const activeMembers = await pool.query("SELECT COUNT(*) FROM tb_member_customer WHERE expired_date >= CURRENT_DATE");
    const todayBookings = await pool.query("SELECT COUNT(*) FROM tb_booking WHERE booking_date = CURRENT_DATE");
    
    // Ambil total pendapatan dari tb_payment
    const incomeResult = await pool.query("SELECT SUM(amount) as total FROM tb_payment");
    const totalIncome = incomeResult.rows[0].total || 0;

    // 2. Query untuk Transaksi Terbaru (JOIN tabel terkait)
    const txQuery = `
      SELECT c.customer_name, b.booking_time, d.price_total, 'PAID' as status 
      FROM tb_booking b 
      JOIN tb_customer c ON b.customer_id = c.customer_id 
      JOIN tb_booking_detail d ON b.booking_id = d.booking_id 
      ORDER BY b.booking_time DESC LIMIT 5
    `;
    const txResult = await pool.query(txQuery);

    // 3. Gabungkan dalam format yang diinginkan Dashboard.tsx
    res.json({
      statistics: [
        { label: 'TOTAL PELANGGAN', val: countCust.rows[0].count, trend: 'Total terdaftar', color: 'bg-white' },
        { label: 'ANGGOTA AKTIF', val: activeMembers.rows[0].count, trend: 'Pertumbuhan stabil', color: 'bg-white' },
        { label: 'TOTAL LAPANGAN', val: countField.rows[0].count, trend: '100% Operasional', color: 'bg-white' },
        { label: 'RESERVASI HARI INI', val: todayBookings.rows[0].count, trend: '4 Slot Tersisa', color: 'bg-white' },
        { label: 'PENDAPATAN', val: `Rp ${Number(totalIncome).toLocaleString()}`, trend: '+8.4% dari target', color: 'bg-slate-950 text-white' }
      ],
      recentTransactions: txResult.rows.map((tx: any) => ({
        name: tx.customer_name || 'Unknown',
        initial: (tx.customer_name || '??').substring(0, 2).toUpperCase(),
        field: "Lapangan", 
        time: new Date(tx.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: `Rp ${Number(tx.price_total).toLocaleString()}`,
        status: tx.status,
        statusColor: tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
      }))
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Gagal mengambil data dari database" });
  }
});

app.use(errorHandler);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});