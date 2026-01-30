import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = express.Router();
router.post(
  "/",
  middleware(userRole.STUDENT),
  bookingController.createBooking,
);
router.get("/", middleware(), bookingController.getBookings);
router.get("/:id", middleware(), bookingController.getBookingById);
router.patch(
  "/:id/status",
  middleware(),
  bookingController.updateBookingStatus,
);

export const bookingRouter = router;
