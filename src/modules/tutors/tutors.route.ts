import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { tutorsController } from "./tutors.controller";

const router = express.Router();
router.post(
  "/profiles",
  middleware(userRole.TUTORS),
  tutorsController.createTutorProfile,
);

router.get(
  "/profiles",
  tutorsController.getAllTutors,
);
router.get(
  "/profiles/:id",
  tutorsController.getTutorById,
);

export const tutorsRouter = router;
