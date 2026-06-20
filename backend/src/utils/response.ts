import { Response } from "express";

export function success(
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function error(
  res: Response,
  message: string,
  statusCode: number = 500
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}