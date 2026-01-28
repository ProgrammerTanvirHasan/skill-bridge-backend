import type { NextFunction, Request, Response } from "express";
import { tutorsService } from "./tutors.service";

const createTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await tutorsService.createTutorProfile(
      user.id as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await tutorsService.getAllTutors();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTutorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const result = await tutorsService.getTutorById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const tutorsController = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
};
