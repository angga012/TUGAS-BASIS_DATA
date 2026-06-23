//test

import { Router } from "express";
import { addBooking, getBookings } from "../controllers/booking.controller";

const router = Router();

router.post("/", addBooking);
router.get("/", getBookings);

export default router;