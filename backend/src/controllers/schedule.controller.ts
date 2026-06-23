import { Request, Response, NextFunction } from "express";
import { getAvailableSchedulesService } from "../services/schedule.service";

export const getAvailableSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Membaca query parameter ?field_id=angka jika ada
    const fieldId = req.query.field_id ? parseInt(req.query.field_id as string) : undefined;

    // Memanggil fungsi di service
    const schedules = await getAvailableSchedulesService(fieldId);

    // Kirim response sukses bawaan Express (Aman dari error import!)
    return res.status(200).json({
      success: true,
      message: "Available schedules retrieved successfully",
      data: schedules
    });
  } catch (error) {
    // Jika ada error database, lempar ke middleware error
        // Jika ada error database, lempar ke middleware error
    next(error);
  }
};




import { createScheduleService } from "../services/schedule.service";

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSchedule = await createScheduleService(req.body);

    return res.status(201).json({
      success: true,
      message: "Slot jadwal lapangan berhasil dibuka oleh Staff!",
      data: newSchedule
    });
  } catch (error) {
    next(error);
  }
};