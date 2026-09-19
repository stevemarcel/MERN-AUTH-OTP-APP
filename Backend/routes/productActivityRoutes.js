import express from "express";

import { getProductActivities } from "../controllers/productActivityController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

// * 1. Get all product activities (admin only)
// GET /api/product-activities
router.get("/", getProductActivities);

export default router;
