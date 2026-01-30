import express from "express";
import middleware, { userRole } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = express.Router();

router.use(middleware(userRole.ADMIN));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.get("/bookings", adminController.getAllBookings);
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

export const adminRouter = router;
