import express from "express";
import { userController } from "./user.controller";

const router = express.Router();
router.get("/", userController.getAllUsersController);
router.get("/me", userController.getLoggedInUserController);

export const userRouter = router;
