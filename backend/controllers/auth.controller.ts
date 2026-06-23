import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

/* =========================
   REGISTER
========================= */
export async function register(req: Request, res: Response) {
  try {
    const { full_name, email, password, role } = req.body;

    const user = await registerUser(full_name, email, password, role);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
}

/* =========================
   LOGIN
========================= */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email);

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}
