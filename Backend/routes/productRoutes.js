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

// All product routes are Admin-only
router
  .route("/")
  .get(protect, isAdmin, getProducts)
  .post(protect, isAdmin, uploadProductImage.single("productImage"), createProduct)
  .delete(protect, isAdmin, deleteProducts);

router
  .route("/:id")
  .get(protect, isAdmin, getProductById)
  .put(protect, isAdmin, uploadProductImage.single("productImage"), updateProduct)
  .delete(protect, isAdmin, deleteProduct);

// Restore an archived product
router.patch("/:id/restore", protect, isAdmin, restoreProduct);

export default router;
