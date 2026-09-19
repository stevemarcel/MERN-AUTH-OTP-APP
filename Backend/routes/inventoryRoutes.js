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
  getInventoryActivities,
} from "../controllers/inventoryController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// * 1. Inventory overview
router.route("/").get(protect, isAdmin, getInventory);

// * 2. Recent inventory activity
router.route("/activity/recent").get(protect, isAdmin, getRecentInventoryActivity);

// * 3. Inventory activities for all products
router.get("/activities", protect, isAdmin, getInventoryActivities);

// * 4. Individual product inventory history
router.route("/:productId").get(protect, isAdmin, getInventoryActivity);

// * 5. Inventory operations
router.post("/:productId/add", protect, isAdmin, addStock); // Add stock to a product

router.post("/:productId/remove", protect, isAdmin, removeStock); // Remove stock from a product

router.post("/:productId/adjust", protect, isAdmin, adjustStock); // Adjust stock for a product (can be used for corrections or updates)

router.post("/:productId/damage", protect, isAdmin, damageStock); // Mark stock as damaged

router.post("/:productId/return", protect, isAdmin, returnStock); // Return stock to inventory

export default router;
