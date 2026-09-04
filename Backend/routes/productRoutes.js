import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  restoreProduct,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All product routes are Admin-only
router
  .route("/")
  .get(protect, isAdmin, getProducts)
  .post(protect, isAdmin, createProduct)
  .delete(protect, isAdmin, deleteProducts);

router
  .route("/:id")
  .get(protect, isAdmin, getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

// Restore an archived product
router.patch("/:id/restore", protect, isAdmin, restoreProduct);

export default router;
