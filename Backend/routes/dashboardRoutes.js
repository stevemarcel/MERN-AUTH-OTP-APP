import express from "express";

import { getDashboardOverview } from "../controllers/dashboardController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, isAdmin, getDashboardOverview);

export default router;
