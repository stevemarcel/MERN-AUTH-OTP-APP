import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import UserActivity from "../models/userActivityModel.js";
import User from "../models/userModels.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (req) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildUserActivityPipeline = ({ userId = null, action = "all", search = "", skip, limit }) => {
  const match = {};

  if (userId) {
    match.user = new mongoose.Types.ObjectId(userId);
  }

  if (action !== "all") {
    match.action = action;
  }

  const pipeline = [
    {
      $match: match,
    },

    {
      $lookup: {
        from: User.collection.name,

        localField: "user",
        foreignField: "_id",

        as: "user",
      },
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: User.collection.name,

        localField: "performedBy",
        foreignField: "_id",

        as: "performedBy",
      },
    },

    {
      $unwind: {
        path: "$performedBy",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const escapedSearch = escapeRegex(trimmedSearch);

    pipeline.push({
      $match: {
        $or: [
          {
            action: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            description: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "user.firstName": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "user.lastName": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "user.username": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "performedBy.firstName": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "performedBy.lastName": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "performedBy.username": {
              $regex: escapedSearch,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  pipeline.push({
    $facet: {
      activities: [
        {
          $sort: {
            createdAt: -1,
          },
        },

        {
          $skip: skip,
        },

        {
          $limit: limit,
        },

        {
          $project: {
            _id: 1,
            action: 1,
            description: 1,
            createdAt: 1,

            user: {
              _id: "$user._id",
              firstName: "$user.firstName",
              lastName: "$user.lastName",
              username: "$user.username",
              profile: "$user.profile",
              isAdmin: "$user.isAdmin",
              accountStatus: "$user.accountStatus",
            },

            performedBy: {
              _id: "$performedBy._id",
              firstName: "$performedBy.firstName",
              lastName: "$performedBy.lastName",
              username: "$performedBy.username",
              isAdmin: "$performedBy.isAdmin",
              accountStatus: "$performedBy.accountStatus",
            },
          },
        },
      ],

      metadata: [
        {
          $count: "total",
        },
      ],
    },
  });

  return pipeline;
};

// @DESCRIPTION Get recent user activities
// @ROUTE       GET /api/user-activities
// @ACCESS      Private/Admin
const getRecentUserActivities = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find()
    .populate("user", "firstName lastName username profile isAdmin accountStatus")
    .populate("performedBy", "firstName lastName username isAdmin accountStatus")
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
  const { page, limit, skip } = parsePagination(req);

  const action = req.query.action || "all";
  const search = req.query.search || "";

  const result = await UserActivity.aggregate(
    buildUserActivityPipeline({
      action,
      search,
      skip,
      limit,
    }),
  );

  const data = result[0] || {};

  const total = data.metadata?.[0]?.total || 0;

  res.status(200).json({
    message: "All user activities retrieved successfully",

    activities: data.activities || [],

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// @DESCRIPTION Get activities for a specific user
// @ROUTE       GET /api/user-activities/:userId
// @ACCESS      Private/Admin
const getUserActivities = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(userId).select(
    "firstName lastName username profile isAdmin accountStatus",
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const { page, limit, skip } = parsePagination(req);

  const action = req.query.action || "all";
  const search = req.query.search || "";

  const result = await UserActivity.aggregate(
    buildUserActivityPipeline({
      userId,
      action,
      search,
      skip,
      limit,
    }),
  );

  const data = result[0] || {};

  const total = data.metadata?.[0]?.total || 0;

  res.status(200).json({
    message: "User activities retrieved successfully",

    user,

    activities: data.activities || [],

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export { getRecentUserActivities, getAllUserActivities, getUserActivities };
