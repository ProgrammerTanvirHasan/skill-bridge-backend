import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.getAlluser();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
