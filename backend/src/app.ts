import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authenticateToken } from "./middlewares/auth.middleware";
import { authorizeRole } from "./middlewares/role.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/profile", authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get(
  "/api/admin-only",
  authenticateToken,
  authorizeRole("ADMIN"),
  (req: any, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FutsalPro API is running" });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});