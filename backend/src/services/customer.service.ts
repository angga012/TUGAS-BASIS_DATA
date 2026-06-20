import { pool } from "../config/database";

export async function getAllCustomers() {
  const result = await pool.query(`
    SELECT *
    FROM tb_customer
    ORDER BY customer_id ASC
  `);

  return result.rows;
}

export async function createCustomer(
  customer_name: string,
  email: string,
  address: string,
  phone_number: string
) {
  const result = await pool.query(
    `
    INSERT INTO tb_customer
    (
      customer_name,
      email,
      address,
      phone_number
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
    `,
    [
      customer_name,
      email,
      address,
      phone_number
    ]
  );

  return result.rows[0];
}

export async function getCustomerById(id: number) {
  const result = await pool.query(
    `
    SELECT *
    FROM tb_customer
    WHERE customer_id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function updateCustomer(
  id: number,
  customer_name: string,
  email: string,
  address: string,
  phone_number: string
) {
  const result = await pool.query(
    `
    UPDATE tb_customer
    SET
      customer_name = $1,
      email = $2,
      address = $3,
      phone_number = $4
    WHERE customer_id = $5
    RETURNING *
    `,
    [customer_name, email, address, phone_number, id]
  );

  return result.rows[0];
}

export async function deleteCustomer(id: number) {
  const result = await pool.query(
    `
    DELETE FROM tb_customer
    WHERE customer_id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}





export const registerCustomerTypeService = async (data: any) => {
  const { customer_id, type, membership_level, duration_months } = data;
  
  if (type.toUpperCase() === 'MEMBER') {
    // Hitung tanggal expired otomatis (misal 3 bulan ke depan)
    const months = duration_months || 3;
    const queryMember = `
      INSERT INTO tb_member_customer (customer_id, membership_level, expired_date)
      VALUES ($1, $2, CURRENT_DATE + INTERVAL '1 month' * $3)
      ON CONFLICT (customer_id) DO UPDATE 
      SET membership_level = EXCLUDED.membership_level, expired_date = EXCLUDED.expired_date
      RETURNING *;
    `;
    // Update juga status di tabel induk tb_customer menjadi 'MEMBER'
    await pool.query(`UPDATE tb_customer SET membership_status = 'MEMBER' WHERE customer_id = $1`, [customer_id]);
    const result = await pool.query(queryMember, [customer_id, membership_level || 'GOLD', months]);
    return { sub_type: 'MEMBER', detail: result.rows[0] };
  } else {
    // Jika Regular, masukkan ke tabel tb_regular_customer
    const queryRegular = `
      INSERT INTO tb_regular_customer (customer_id)
      VALUES ($1)
      ON CONFLICT (customer_id) DO NOTHING
      RETURNING *;
    `;
    await pool.query(`UPDATE tb_customer SET membership_status = 'REGULER' WHERE customer_id = $1`, [customer_id]);
    const result = await pool.query(queryRegular, [customer_id]);
    return { sub_type: 'REGULER', detail: result.rows[0] };
  }
};