import express from "express";
import { getUser } from "./user.controller";

const router = express.Router();
router.get("/", getUser);

export const userRouter = router;
