import express from "express";
import { userController } from "./user.controller";
import middleware from "../../middleware/auth";

const router = express.Router();

router.get("/", userController.getAllUsersController);

router.get("/me", middleware(), userController.getLoggedInUserController);

export const userRouter = router;
