import { pool } from "./database";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database Connected!");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("❌ Database Error:", error);
  } finally {
    await pool.end();
  }
}

testConnection();