import express from "express";

import { getAdminActivities } from "../controllers/adminActivityController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

// * 1. Get all admin activities (admin only)
router.get("/", getAdminActivities);

export default router;
