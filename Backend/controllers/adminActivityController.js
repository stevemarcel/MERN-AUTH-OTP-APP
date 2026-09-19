import asyncHandler from "express-async-handler";

import UserActivity from "../models/userActivityModel.js";
import ProductActivity from "../models/productActivityModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";

import User from "../models/userModels.js";
import Product from "../models/productModel.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const userPipeline = [
  {
    $lookup: {
      from: User.collection.name,

      localField: "user",
      foreignField: "_id",

      as: "subjectUser",
    },
  },

  {
    $unwind: {
      path: "$subjectUser",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from: User.collection.name,

      localField: "performedBy",
      foreignField: "_id",

      as: "actor",
    },
  },

  {
    $unwind: {
      path: "$actor",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $project: {
      _id: 1,

      type: {
        $literal: "user",
      },

      action: 1,
      description: 1,
      createdAt: 1,

      entityId: "$subjectUser._id",

      entityName: {
        $trim: {
          input: {
            $concat: [
              {
                $ifNull: ["$subjectUser.firstName", ""],
              },

              " ",

              {
                $ifNull: ["$subjectUser.lastName", ""],
              },
            ],
          },
        },
      },

      entitySku: null,

      performedBy: {
        _id: "$actor._id",
        firstName: "$actor.firstName",
        lastName: "$actor.lastName",
        username: "$actor.username",
        isAdmin: "$actor.isAdmin",
        accountStatus: "$actor.accountStatus",
      },

      metadata: {
        userAction: "$action",
      },
    },
  },
];

const productPipeline = [
  {
    $lookup: {
      from: Product.collection.name,

      localField: "product",
      foreignField: "_id",

      as: "product",
    },
  },

  {
    $unwind: "$product",
  },

  {
    $lookup: {
      from: User.collection.name,

      localField: "performedBy",
      foreignField: "_id",

      as: "actor",
    },
  },

  {
    $unwind: {
      path: "$actor",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $set: {
      description: {
        $switch: {
          branches: [
            {
              case: {
                $eq: ["$action", "product_created"],
              },

              then: "Product created",
            },

            {
              case: {
                $eq: ["$action", "product_updated"],
              },

              then: "Product updated",
            },

            {
              case: {
                $eq: ["$action", "product_archived"],
              },

              then: "Product archived",
            },

            {
              case: {
                $eq: ["$action", "product_restored"],
              },

              then: "Product restored",
            },
          ],

          default: "Product activity recorded",
        },
      },
    },
  },

  {
    $project: {
      _id: 1,

      type: {
        $literal: "product",
      },

      action: 1,
      description: 1,
      createdAt: 1,

      entityId: "$product._id",

      entityName: "$product.name",

      entitySku: "$product.sku",

      performedBy: {
        _id: "$actor._id",
        firstName: "$actor.firstName",
        lastName: "$actor.lastName",
        username: "$actor.username",
        isAdmin: "$actor.isAdmin",
        accountStatus: "$actor.accountStatus",
      },

      metadata: {
        changedFields: "$changedFields",

        reason: "$reason",
      },
    },
  },
];

const inventoryPipeline = [
  {
    $lookup: {
      from: Product.collection.name,

      localField: "product",
      foreignField: "_id",

      as: "product",
    },
  },

  {
    $unwind: "$product",
  },

  {
    $lookup: {
      from: User.collection.name,

      localField: "performedBy",
      foreignField: "_id",

      as: "actor",
    },
  },

  {
    $unwind: {
      path: "$actor",
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $set: {
      description: {
        $switch: {
          branches: [
            {
              case: {
                $eq: ["$action", "stock_received"],
              },

              then: "Initial stock received",
            },

            {
              case: {
                $eq: ["$action", "stock_added"],
              },

              then: "Stock added",
            },

            {
              case: {
                $eq: ["$action", "stock_removed"],
              },

              then: "Stock removed",
            },

            {
              case: {
                $eq: ["$action", "stock_adjusted"],
              },

              then: "Stock adjusted",
            },

            {
              case: {
                $eq: ["$action", "stock_damaged"],
              },

              then: "Stock marked as damaged",
            },

            {
              case: {
                $eq: ["$action", "stock_returned"],
              },

              then: "Stock returned",
            },
          ],

          default: "Inventory activity recorded",
        },
      },
    },
  },

  {
    $project: {
      _id: 1,

      type: {
        $literal: "inventory",
      },

      action: 1,
      description: 1,
      quantity: 1,
      previousStock: 1,
      newStock: 1,
      reason: 1,
      createdAt: 1,

      entityId: "$product._id",

      entityName: "$product.name",

      entitySku: "$product.sku",

      performedBy: {
        _id: "$actor._id",
        firstName: "$actor.firstName",
        lastName: "$actor.lastName",
        username: "$actor.username",
        isAdmin: "$actor.isAdmin",
        accountStatus: "$actor.accountStatus",
      },

      metadata: {
        quantity: "$quantity",
        previousStock: "$previousStock",
        newStock: "$newStock",
        reason: "$reason",
      },
    },
  },
];

const getAdminActivities = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

  const skip = (page - 1) * limit;

  const type = req.query.type || "all";

  const action = req.query.action || "all";

  const search = req.query.search || "";

  let baseModel;
  let pipeline;

  switch (type) {
    case "user":
      baseModel = UserActivity;
      pipeline = [...userPipeline];
      break;

    case "product":
      baseModel = ProductActivity;
      pipeline = [...productPipeline];
      break;

    case "inventory":
      baseModel = InventoryActivity;
      pipeline = [...inventoryPipeline];
      break;

    default:
      baseModel = UserActivity;

      pipeline = [
        ...userPipeline,

        {
          $unionWith: {
            coll: ProductActivity.collection.name,

            pipeline: productPipeline,
          },
        },

        {
          $unionWith: {
            coll: InventoryActivity.collection.name,

            pipeline: inventoryPipeline,
          },
        },
      ];
  }

  if (action !== "all") {
    pipeline.push({
      $match: {
        action,
      },
    });
  }

  if (search.trim()) {
    const escapedSearch = escapeRegex(search.trim());

    pipeline.push({
      $match: {
        $or: [
          {
            description: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            action: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            entityName: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            entitySku: {
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
      ],

      metadata: [
        {
          $count: "total",
        },
      ],
    },
  });

  const result = await baseModel.aggregate(pipeline);

  const data = result[0] || {};

  const total = data.metadata?.[0]?.total || 0;

  res.status(200).json({
    activities: data.activities || [],

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export { getAdminActivities };
