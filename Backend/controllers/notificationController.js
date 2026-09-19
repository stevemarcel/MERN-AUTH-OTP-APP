import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Notification from "../models/notificationModel.js";

// @DESCRIPTION Get notifications
// @ROUTE       GET /api/notifications
// @ACCESS      Private
const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

  const unreadOnly = req.query.unreadOnly === "true";

  const filter = {
    recipient: req.user._id,
  };

  if (unreadOnly) {
    filter.readAt = null;
  }

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments(filter),

    Notification.countDocuments({
      recipient: req.user._id,
      readAt: null,
    }),
  ]);

  res.status(200).json({
    notifications,
    unreadCount,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// @DESCRIPTION Get unread notification count
// @ROUTE       GET /api/notifications/unread-count
// @ACCESS      Private
const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    readAt: null,
  });

  res.status(200).json({
    unreadCount,
  });
});

// @DESCRIPTION Mark one notification as read
// @ROUTE       PATCH /api/notifications/:notificationId/read
// @ACCESS      Private
const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    res.status(400);
    throw new Error("Invalid notification ID.");
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: req.user._id,
    },
    {
      $set: {
        readAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found.");
  }

  res.status(200).json({
    notification,
  });
});

// @DESCRIPTION Mark all notifications as read
// @ROUTE       PATCH /api/notifications/read-all
// @ACCESS      Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user._id,
      readAt: null,
    },
    {
      $set: {
        readAt: new Date(),
      },
    },
  );

  res.status(200).json({
    message: "All notifications marked as read.",
  });
});

export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
