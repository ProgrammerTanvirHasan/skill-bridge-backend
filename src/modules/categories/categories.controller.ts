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

const postCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category name" });
    }

    const result = await categoriesService.postCategories(name);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};



export const categoriesController = {
  getAllCategories,
  postCategories,
};
