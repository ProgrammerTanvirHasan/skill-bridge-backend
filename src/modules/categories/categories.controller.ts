import type { NextFunction, Request, Response } from "express";
import { categoriesService } from "./categories.service";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoriesService.getAllCategories();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const categoriesController = {
  getAllCategories,
};
