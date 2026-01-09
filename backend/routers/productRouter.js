import express from "express";
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory
} from "../controllers/productController.js";
import { uploadMultipleImages } from "../middleware/uploadMiddleware.js";

const productRouter = express.Router();

// GET routes
productRouter.get("/get-products", getProducts);
productRouter.get("/get-product/:id", getProductById);
productRouter.get("/category/:categoryId", getProductsByCategory);
productRouter.get("/subcategory/:subCategoryId", getProductsBySubCategory);

// POST routes
productRouter.post("/create-product", uploadMultipleImages("images", 10), createProduct);

// PUT routes
productRouter.put("/update-product/:id", uploadMultipleImages("images", 10), updateProduct);

// DELETE routes
productRouter.delete("/delete-product/:id", deleteProduct);

export default productRouter;
