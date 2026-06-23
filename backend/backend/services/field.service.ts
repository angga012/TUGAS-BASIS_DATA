import { pool } from "../config/database";

export async function getAllFields() {
  const result = await pool.query(`
    SELECT * FROM tb_field 
    ORDER BY field_id ASC
  `);
  return result.rows;
}

export async function getFieldById(id: number) {
  const result = await pool.query(`
    SELECT * FROM tb_field 
    WHERE field_id = $1
  `, [id]);
  return result.rows[0];
}

export async function createField(
  field_name: string,
  price_per_hour: number,
  capacity: number,
  field_type: string,
  status: string
) {
  const result = await pool.query(`
    INSERT INTO tb_field (field_name, price_per_hour, capacity, field_type, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [field_name, price_per_hour, capacity, field_type, status]);
  return result.rows[0];
}

export async function updateField(
  id: number,
  field_name: string,
  price_per_hour: number,
  capacity: number,
  field_type: string,
  status: string
) {
  const result = await pool.query(`
    UPDATE tb_field 
    SET field_name = $1, price_per_hour = $2, capacity = $3, field_type = $4, status = $5
    WHERE field_id = $6
    RETURNING *
  `, [field_name, price_per_hour, capacity, field_type, status, id]);
  return result.rows[0];
}

export async function deleteField(id: number) {
  const result = await pool.query(`
    DELETE FROM tb_field 
    WHERE field_id = $1
    RETURNING *
  `, [id]);
  return result.rows[0];
}