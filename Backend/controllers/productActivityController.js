import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import ProductActivity from "../models/productActivityModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModels.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getProductActivities = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

  const skip = (page - 1) * limit;

  const action = req.query.action || "all";

  const search = req.query.search || "";

  const productId = req.query.productId || "";

  const match = {};

  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("Invalid product ID.");
    }

    match.product = new mongoose.Types.ObjectId(productId);
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

  if (search.trim()) {
    const escapedSearch = escapeRegex(search.trim());

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
            reason: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            changedFields: {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "product.name": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "product.sku": {
              $regex: escapedSearch,
              $options: "i",
            },
          },

          {
            "product.category": {
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

        {
          $project: {
            _id: 1,
            action: 1,
            changedFields: 1,
            reason: 1,
            createdAt: 1,

            product: {
              _id: "$product._id",
              name: "$product.name",
              sku: "$product.sku",
              category: "$product.category",
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

  const result = await ProductActivity.aggregate(pipeline);

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

export { getProductActivities };
