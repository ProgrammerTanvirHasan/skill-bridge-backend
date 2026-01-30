import type { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { tutorId, bookingId, rating, comment } = req.body;
    if (!tutorId || rating == null) {
      return res.status(400).json({
        success: false,
        message: "tutorId and rating are required",
      });
    }
    const input: Parameters<typeof reviewService.createReview>[1] = {
      tutorId: Number(tutorId),
      rating: Number(rating),
    };
    if (bookingId != null) input.bookingId = Number(bookingId);
    if (comment != null) input.comment = comment;
    const result = await reviewService.createReview(user.id, input);
    res.status(201).json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create review";
    if (message.includes("already reviewed") || message.includes("Invalid or incomplete")) {
      return res.status(400).json({ success: false, message });
    }
    next(error);
  }
};

export const reviewController = {
  createReview,
};
