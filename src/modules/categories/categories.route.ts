import express from "express";
import { categoriesController } from "./categories.controller";

const router = express.Router();
router.get("/", categoriesController.getAllCategories);

export const categoriesRouter = router;
