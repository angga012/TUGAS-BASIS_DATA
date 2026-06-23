import { Router } from "express";
import { getAvailableSchedules, createSchedule } from "../controllers/schedule.controller";

const router = Router();

router.get("/", getAvailableSchedules);
router.post("/", createSchedule); // Rute baru untuk Staff menginput jadwal

export default router;