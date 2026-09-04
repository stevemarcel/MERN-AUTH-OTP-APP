import express from "express";

import {
  getInventory,
  getInventoryActivity,
  addStock,
  removeStock,
  adjustStock,
  damageStock,
  returnStock,
  getRecentInventoryActivity,
} from "../controllers/inventoryController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Inventory overview
router.route("/").get(protect, isAdmin, getInventory);

// Recent inventory activity
router.route("/activity/recent").get(protect, isAdmin, getRecentInventoryActivity);

// Individual product inventory history
router.route("/:productId").get(protect, isAdmin, getInventoryActivity);

// Inventory operations
router.post("/:productId/add", protect, isAdmin, addStock); // Add stock to a product

router.post("/:productId/remove", protect, isAdmin, removeStock); // Remove stock from a product

router.post("/:productId/adjust", protect, isAdmin, adjustStock); // Adjust stock for a product (can be used for corrections or updates)

router.post("/:productId/damage", protect, isAdmin, damageStock); // Mark stock as damaged

router.post("/:productId/return", protect, isAdmin, returnStock); // Return stock to inventory

export default router;
