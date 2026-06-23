import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/* =========================
   REGISTER USER
========================= */
export async function registerUser(
  full_name: string,
  email: string,
  password: string,
  role: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO tb_user (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, full_name, email, role`,
    [full_name, email, hashedPassword, role]
  );

  return result.rows[0];
}

/* =========================
   LOGIN USER
========================= */
export async function loginUser(email: string, password: string) {
  const result = await pool.query(
    "SELECT * FROM tb_user WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}