import type { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { tutorId, scheduledAt } = req.body;
    if (!tutorId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "tutorId and scheduledAt are required",
      });
    }
    const result = await bookingService.createBooking(user.id, {
      tutorId: Number(tutorId),
      scheduledAt: new Date(scheduledAt),
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await bookingService.getBookingsByUser(user.id, user.role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const id = Number(req.params.id);
    const result = await bookingService.getBookingById(id, user.id, user.role);
    if (!result) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be CONFIRMED, COMPLETED, or CANCELLED",
      });
    }
    const result = await bookingService.updateBookingStatus(
      id,
      status,
      user.id,
      user.role,
    );
    if (!result) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
