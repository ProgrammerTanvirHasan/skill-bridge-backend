import express from "express";
import { categoriesController } from "./categories.controller";
import middleware, { userRole } from "../../middleware/auth";

const router = express.Router();
router.get("/", categoriesController.getAllCategories);
router.post(
  "/",
  // middleware(userRole.ADMIN),
  categoriesController.postCategories,
);

export const categoriesRouter = router;
