import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { reviewController } from "./review.controller";

const router = express.Router();
router.post(
  "/",
  middleware(userRole.STUDENT),
  reviewController.createReview,
);

export const reviewRouter = router;
