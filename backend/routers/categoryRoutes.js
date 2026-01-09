import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const routerCategory = Router();

routerCategory.get("/", getCategories);
routerCategory.post(
  "/create",
  AuthMiddleware,
  uploadSingleImage("image"),
  createCategory
);
routerCategory.put(
  "/edit/:id",
  AuthMiddleware,
  uploadSingleImage("image"),
  updateCategory
);
routerCategory.delete("/delete/:id", AuthMiddleware, deleteCategory);

export default routerCategory;
