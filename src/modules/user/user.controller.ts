import type { Request, Response } from "express";
import { userService } from "./user.service";

// all users
const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getLoggedInUserController = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const userController = {
  getAllUsersController,
  getLoggedInUserController,
};
