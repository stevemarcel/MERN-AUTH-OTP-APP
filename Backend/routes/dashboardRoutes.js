import express from "express";

import { getDashboardOverview } from "../controllers/dashboardController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// * 1. Get dashboard overview
// GET /api/dashboard/overview
router.get("/overview", protect, isAdmin, getDashboardOverview);

export default router;
