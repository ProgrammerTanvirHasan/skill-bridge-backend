import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { adminRouter } from "./modules/admin/admin.route";
import { bookingRouter } from "./modules/booking/booking.route";
import { categoriesRouter } from "./modules/categories/categories.route";
import { reviewRouter } from "./modules/review/review.route";
import { tutorRouter } from "./modules/tutors/tutor.route";
import { userRouter } from "./modules/user/user.route";
import { notFound } from "./middleware/notFound";
import errorHandler from "./middleware/globalErrorHandler";

const app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", userRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("SkillBridge API running");
});
app.use(notFound);
app.use(errorHandler);

export default app;
