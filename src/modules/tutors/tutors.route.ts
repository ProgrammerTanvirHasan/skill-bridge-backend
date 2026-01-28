import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { tutorsController } from "./tutors.controller";

const router = express.Router();
router.post(
  "/profiles",
  middleware(userRole.TUTORS),
  tutorsController.createTutorProfile,
);

export const tutorsRouter = router;
