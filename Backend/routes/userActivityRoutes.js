import express from "express";

import {
  getRecentUserActivities,
  getAllUserActivities,
  getUserActivities,
} from "../controllers/userActivityController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// * 1. Get recent activities
// GET /api/user-activities
router.route("/").get(protect, isAdmin, getRecentUserActivities);

// * 2. Get all activities
// GET /api/user-activities/all
router.route("/all").get(protect, isAdmin, getAllUserActivities);

// * 3. Get activities for a specific user
// GET /api/user-activities/:userId
router.route("/:userId").get(protect, isAdmin, getUserActivities);

export default router;
