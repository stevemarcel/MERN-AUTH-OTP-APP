import express from "express";

import {
  getRecentUserActivities,
  getUserActivities,
} from "../controllers/userActivityController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get recent activities
// GET /api/user-activities
router.route("/").get(protect, isAdmin, getRecentUserActivities);

// Get activities for a specific user
// GET /api/user-activities/:userId
router.route("/:userId").get(protect, isAdmin, getUserActivities);

export default router;
