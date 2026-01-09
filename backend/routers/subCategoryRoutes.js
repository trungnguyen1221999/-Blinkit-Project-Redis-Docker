import { Router } from "express";
import {
  getSubCategories,
  getSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const routerSubCategory = Router();

// Lấy tất cả subcategories
routerSubCategory.get("/", getSubCategories);

// Lấy subcategories theo category
routerSubCategory.get("/category/:categoryId", getSubCategoriesByCategory);

// Tạo subcategory mới
routerSubCategory.post(
  "/create",
  AuthMiddleware,
  uploadSingleImage("image"),
  createSubCategory
);

// Cập nhật subcategory
routerSubCategory.put(
  "/edit/:id",
  AuthMiddleware,
  uploadSingleImage("image"),
  updateSubCategory
);

// Xóa subcategory
routerSubCategory.delete("/delete/:id", AuthMiddleware, deleteSubCategory);

export default routerSubCategory;
