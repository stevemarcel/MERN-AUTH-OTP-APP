import express from "express";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// * 1. Get all notifications for the authenticated user
// GET /api/notifications
router.get("/", getNotifications);

// * 2. Get unread notification count
// GET /api/notifications/unread-count
router.get("/unread-count", getUnreadNotificationCount);

// * 3. Mark all notifications as read
// PATCH /api/notifications/read-all
router.patch("/read-all", markAllNotificationsRead);

// * 4. Mark a specific notification as read
// PATCH /api/notifications/:notificationId/read
router.patch("/:notificationId/read", markNotificationRead);

export default router;
