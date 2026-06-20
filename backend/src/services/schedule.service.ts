import { pool } from "../config/database";

export const getAvailableSchedulesService = async (fieldId?: number) => {
  // Query untuk mengambil jadwal yang Available dan menggabungkannya dengan nama lapangan
  let query = `
    SELECT s.*, f.field_name 
    FROM tb_schedule s
    JOIN tb_field f ON s.field_id = f.field_id
    WHERE s.status = 'Available'
  `;
  
  const params: any[] = [];
  
  // Jika frontend mengirimkan filter field_id, kita saring berdasarkan lapangannya
  if (fieldId) {
    query += ` AND s.field_id = $1`;
    params.push(fieldId);
  }
  
  query += ` ORDER BY s.available_date ASC, s.start_time ASC`;
  
  const result = await pool.query(query, params);
  return result.rows;
};




export const createScheduleService = async (scheduleData: any) => {
  const { field_id, available_date, start_time, end_time } = scheduleData;

  const query = `
    INSERT INTO tb_schedule (field_id, available_date, start_time, end_time, status)
    VALUES ($1, $2, $3, $4, 'Available')
    RETURNING *;
  `;

  const result = await pool.query(query, [field_id, available_date, start_time, end_time]);
  return result.rows[0];
};