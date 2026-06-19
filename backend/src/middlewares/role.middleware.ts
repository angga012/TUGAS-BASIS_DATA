import { Response, NextFunction } from "express";

export function authorizeRole(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
}