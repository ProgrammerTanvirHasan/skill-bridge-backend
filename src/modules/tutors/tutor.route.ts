import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { tutorsController } from "./tutors.controller";

const router = express.Router();

router.post(
  "/",
  middleware(userRole.TUTOR),
  tutorsController.createTutorProfile,
);

router.get("/", tutorsController.getAllTutors);
router.get("/:id", tutorsController.getTutorById);

router.put(
  "/profile",
  middleware(userRole.TUTOR),
  tutorsController.updateTutorProfile,
);
router.put(
  "/availability",
  middleware(userRole.TUTOR),
  tutorsController.setAvailability,
);

export const tutorRouter = router;
