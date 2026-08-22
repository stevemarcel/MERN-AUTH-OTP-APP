import asyncHandler from "express-async-handler";
import UserActivity from "../models/userActivityModel.js";

// @DESCRIPTION Get recent user activities
// @ROUTE       GET /api/user-activities
// @ACCESS      Private/Admin
const getRecentUserActivities = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find()
    .populate("user", "firstName lastName username profile")
    .populate("performedBy", "firstName lastName username")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    message: "Recent user activities retrieved successfully",
    activities,
  });
});

// @DESCRIPTION Get all user activities
// @ROUTE       GET /api/user-activities/all
// @ACCESS      Private/Admin

const getAllUserActivities = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find()
    .populate("user", "firstName lastName username profile")
    .populate("performedBy", "firstName lastName username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "All user activities retrieved successfully",
    activities,
  });
});

// @DESCRIPTION Get activities for a specific user
// @ROUTE       GET /api/user-activities/:userId
// @ACCESS      Private/Admin
const getUserActivities = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find({
    user: req.params.userId,
  })
    .populate("user", "firstName lastName username profile")
    .populate("performedBy", "firstName lastName username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "User activities retrieved successfully",
    activities,
  });
});

export { getRecentUserActivities, getUserActivities, getAllUserActivities };
