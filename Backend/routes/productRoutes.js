import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  deleteProducts,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";
import uploadProductImage from "../utils/productImageUpload.js";

const router = express.Router();

// ! === ADMIN ONLY ROUTES ===
// * 1. Get all products, create a new product, or delete all products
router
  .route("/")
  .get(protect, isAdmin, getProducts) // GET /api/products - Retrieve all products
  .post(protect, isAdmin, uploadProductImage.single("productImage"), createProduct) // POST /api/products - Create a new product
  .delete(protect, isAdmin, deleteProducts); // DELETE /api/products - Delete all products

// * 2. Get, update, or delete a specific product by ID
router
  .route("/:id")
  .get(protect, isAdmin, getProductById) // GET /api/products/:id - Retrieve a specific product by ID
  .put(protect, isAdmin, uploadProductImage.single("productImage"), updateProduct) // PUT /api/products/:id - Update a specific product by ID
  .delete(protect, isAdmin, deleteProduct); // DELETE /api/products/:id - Delete a specific product by ID

// * 3. Restore an archived product
router.patch("/:id/restore", protect, isAdmin, restoreProduct); // PATCH /api/products/:id/restore - Restore an archived product

export default router;
