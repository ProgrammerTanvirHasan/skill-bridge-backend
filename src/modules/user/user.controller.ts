import type { Request, Response } from "express";
import { userService } from "./user.service";

// Get all users
const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getLoggedInUserController = async (req: Request, res: Response) => {
  try {
    // ধরছি user id token/session থেকে middleware বা অন্য জায়গা থেকে req.user.id এ set করা আছে
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const userController = {
  getAllUsersController,
  getLoggedInUserController,
};
