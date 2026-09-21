import asyncHandler from "express-async-handler";

import User from "../models/userModels.js";
import Product from "../models/productModel.js";
import UserActivity from "../models/userActivityModel.js";
import ProductActivity from "../models/productActivityModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";

// @DESCRIPTION Get admin dashboard overview
// @ROUTE       GET /api/dashboard/overview
// @ACCESS      Private/Admin
const getDashboardOverview = asyncHandler(async (req, res) => {
  const now = new Date();

  // Start of current month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of next month
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Start of the 6-month registration trend window
  const registrationTrendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // ============================================================
  // RUN DASHBOARD DATA QUERIES IN PARALLEL
  // ============================================================

  const [
    userStatsResult,
    registrationTrendResult,
    productDashboardResult,
    recentUserActivities,
    recentProductActivities,
    recentInventoryActivities,
  ] = await Promise.all([
    // ==========================================================
    // USER SUMMARY
    // ==========================================================

    User.aggregate([
      {
        $group: {
          _id: null,

          totalUsers: {
            $sum: 1,
          },

          verifiedUsers: {
            $sum: {
              $cond: [{ $eq: ["$emailVerified", true] }, 1, 0],
            },
          },

          unverifiedUsers: {
            $sum: {
              $cond: [{ $eq: ["$emailVerified", false] }, 1, 0],
            },
          },

          adminUsers: {
            $sum: {
              $cond: [{ $eq: ["$isAdmin", true] }, 1, 0],
            },
          },

          nonAdminUsers: {
            $sum: {
              $cond: [{ $eq: ["$isAdmin", false] }, 1, 0],
            },
          },

          adminCreatedUsers: {
            $sum: {
              $cond: [{ $eq: ["$isAdminCreatingUser", true] }, 1, 0],
            },
          },

          selfRegisteredUsers: {
            $sum: {
              $cond: [{ $eq: ["$isAdminCreatingUser", false] }, 1, 0],
            },
          },

          newUsersThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$createdAt", currentMonthStart],
                    },
                    {
                      $lt: ["$createdAt", nextMonthStart],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalUsers: 1,
          verifiedUsers: 1,
          unverifiedUsers: 1,
          adminUsers: 1,
          nonAdminUsers: 1,
          adminCreatedUsers: 1,
          selfRegisteredUsers: 1,
          newUsersThisMonth: 1,
        },
      },
    ]),

    // ==========================================================
    // USER REGISTRATION TREND
    // ==========================================================

    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: registrationTrendStart,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },

          users: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    // ==========================================================
    // PRODUCT + INVENTORY DASHBOARD DATA
    // ==========================================================

    Product.aggregate([
      {
        $facet: {
          // ----------------------------------------------------
          // Product / Inventory Summary
          // ----------------------------------------------------

          summary: [
            {
              $group: {
                _id: null,

                totalProducts: {
                  $sum: 1,
                },

                activeProducts: {
                  $sum: {
                    $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                  },
                },

                archivedProducts: {
                  $sum: {
                    $cond: [{ $eq: ["$isActive", false] }, 1, 0],
                  },
                },

                lowStockProducts: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: ["$isActive", true],
                          },
                          {
                            $gt: ["$stockQuantity", 0],
                          },
                          {
                            $lte: ["$stockQuantity", "$lowStockThreshold"],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                outOfStockProducts: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: ["$isActive", true],
                          },
                          {
                            $eq: ["$stockQuantity", 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                totalUnits: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$isActive", true],
                      },
                      "$stockQuantity",
                      0,
                    ],
                  },
                },

                totalInventoryValue: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$isActive", true],
                      },
                      {
                        $multiply: ["$stockQuantity", "$costPrice"],
                      },
                      0,
                    ],
                  },
                },

                totalRetailValue: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$isActive", true],
                      },
                      {
                        $multiply: ["$stockQuantity", "$price"],
                      },
                      0,
                    ],
                  },
                },
              },
            },

            {
              $project: {
                _id: 0,
                totalProducts: 1,
                activeProducts: 1,
                archivedProducts: 1,
                lowStockProducts: 1,
                outOfStockProducts: 1,
                totalUnits: 1,
                totalInventoryValue: 1,
                totalRetailValue: 1,
              },
            },
          ],

          // ----------------------------------------------------
          // Stock Status
          // ----------------------------------------------------

          stockStatus: [
            {
              $match: {
                isActive: true,
              },
            },

            {
              $project: {
                status: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $eq: ["$stockQuantity", 0],
                        },
                        then: "out_of_stock",
                      },

                      {
                        case: {
                          $lte: ["$stockQuantity", "$lowStockThreshold"],
                        },
                        then: "low_stock",
                      },
                    ],

                    default: "in_stock",
                  },
                },
              },
            },

            {
              $group: {
                _id: "$status",

                count: {
                  $sum: 1,
                },
              },
            },

            {
              $project: {
                _id: 0,
                status: "$_id",
                count: 1,
              },
            },

            {
              $sort: {
                status: 1,
              },
            },
          ],

          // ----------------------------------------------------
          // Most Urgent Low-Stock Products
          // ----------------------------------------------------

          lowStockProductsList: [
            {
              $match: {
                isActive: true,
                stockQuantity: {
                  $gt: 0,
                },
                $expr: {
                  $lte: ["$stockQuantity", "$lowStockThreshold"],
                },
              },
            },

            {
              $sort: {
                stockQuantity: 1,
                name: 1,
              },
            },

            {
              $limit: 5,
            },

            {
              $project: {
                _id: 1,
                name: 1,
                sku: 1,
                category: 1,
                stockQuantity: 1,
                lowStockThreshold: 1,
                unit: 1,
                productImage: 1,
              },
            },
          ],
        },
      },
    ]),

    // ==========================================================
    // RECENT USER ACTIVITIES
    // ==========================================================

    UserActivity.find()
      .populate("user", "firstName lastName username profile")
      .populate("performedBy", "firstName lastName username")
      .sort({ createdAt: -1 })
      .limit(8),

    // ==========================================================
    // RECENT PRODUCT ACTIVITIES
    // ==========================================================

    ProductActivity.find()
      .populate("product", "name sku unit")
      .populate("performedBy", "firstName lastName username")
      .sort({ createdAt: -1 })
      .limit(8),

    // ==========================================================
    // RECENT INVENTORY ACTIVITIES
    // ==========================================================

    InventoryActivity.find()
      .populate("product", "name sku unit")
      .populate("performedBy", "firstName lastName username")
      .sort({ createdAt: -1 })
      .limit(8),
  ]);

  // ============================================================
  // FORMAT USER STATISTICS
  // ============================================================

  const userStats = userStatsResult[0] || {
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    adminUsers: 0,
    nonAdminUsers: 0,
    adminCreatedUsers: 0,
    selfRegisteredUsers: 0,
    newUsersThisMonth: 0,
  };

  // ============================================================
  // BUILD SIX-MONTH REGISTRATION TREND
  // ============================================================

  const registrationTrend = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const found = registrationTrendResult.find((entry) => entry._id === key);

    return {
      month,
      users: found?.users || 0,
    };
  });

  // ============================================================
  // FORMAT PRODUCT / INVENTORY DATA
  // ============================================================

  const productDashboard = productDashboardResult[0] || {};

  const productSummary = productDashboard.summary?.[0] || {
    totalProducts: 0,
    activeProducts: 0,
    archivedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalUnits: 0,
    totalInventoryValue: 0,
    totalRetailValue: 0,
  };

  const stockStatus = productDashboard.stockStatus || [];

  const lowStockProducts = productDashboard.lowStockProductsList || [];

  // ============================================================
  // RESPONSE
  // ============================================================

  res.status(200).json({
    users: userStats,

    registrationTrend,

    verificationStatus: [
      {
        name: "Verified Users",
        value: userStats.verifiedUsers,
      },
      {
        name: "Unverified Users",
        value: userStats.unverifiedUsers,
      },
    ].filter((item) => item.value > 0),

    registrationSource: [
      {
        name: "Self Registered",
        value: userStats.selfRegisteredUsers,
      },
      {
        name: "Admin Created",
        value: userStats.adminCreatedUsers,
      },
    ].filter((item) => item.value > 0),

    products: {
      total: productSummary.totalProducts,
      active: productSummary.activeProducts,
      archived: productSummary.archivedProducts,
      lowStock: productSummary.lowStockProducts,
      outOfStock: productSummary.outOfStockProducts,
    },

    inventory: {
      totalUnits: productSummary.totalUnits,
      totalInventoryValue: productSummary.totalInventoryValue,
      totalRetailValue: productSummary.totalRetailValue,
    },

    stockStatus,

    lowStockProducts,

    recentUserActivities,

    recentProductActivities,

    recentInventoryActivities,
  });
});

export { getDashboardOverview };
