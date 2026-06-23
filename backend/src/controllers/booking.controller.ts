import { Request, Response, NextFunction } from "express";
import { createBookingService } from "../services/booking.service";

export const addBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const bookingData = req.body;

    const result = await createBookingService(bookingData);
    
    return res.status(201).json({
      success: true,
      message: "Booking and payment processed successfully (Simulation)",
      data: result
    });
  } catch (error) {
    // Jika ada error, lempar ke middleware error
    next(error);
  }
};

export async function getBookings(req: Request, res: Response) {
  try {
    const { getAllBookingsService } = await import("../services/booking.service");
    const bookings = await getAllBookingsService();
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
}