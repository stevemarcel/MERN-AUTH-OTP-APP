import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Product from "../models/productModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";
import User from "../models/userModels.js";

// @DESCRIPTION Get inventory overview
// @ROUTE       GET /api/inventory
// @ACCESS      Private/Admin
const getInventory = asyncHandler(async (req, res) => {
  const inventoryResult = await Product.aggregate([
    {
      $facet: {
        // ============================================================
        // INVENTORY SUMMARY
        // ============================================================
        summary: [
          {
            $group: {
              _id: null,

              // All products, including archived products
              totalProducts: {
                $sum: 1,
              },

              // Active products
              activeProducts: {
                $sum: {
                  $cond: [{ $eq: ["$isActive", true] }, 1, 0],
                },
              },

              // Archived products
              archivedProducts: {
                $sum: {
                  $cond: [{ $eq: ["$isActive", false] }, 1, 0],
                },
              },

              // Active products with stock above 0
              // but at or below their low-stock threshold
              lowStockProducts: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$isActive", true] },
                        { $gt: ["$stockQuantity", 0] },
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

              // Active products with zero stock
              outOfStockProducts: {
                $sum: {
                  $cond: [
                    {
                      $and: [{ $eq: ["$isActive", true] }, { $eq: ["$stockQuantity", 0] }],
                    },
                    1,
                    0,
                  ],
                },
              },

              // Current stock units for active products
              totalUnits: {
                $sum: {
                  $cond: [{ $eq: ["$isActive", true] }, "$stockQuantity", 0],
                },
              },

              // Cost value of current active inventory
              totalInventoryValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$isActive", true] },
                    {
                      $multiply: ["$stockQuantity", "$costPrice"],
                    },
                    0,
                  ],
                },
              },

              // Potential retail value of current active inventory
              totalRetailValue: {
                $sum: {
                  $cond: [
                    { $eq: ["$isActive", true] },
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

        // ============================================================
        // STOCK STATUS BREAKDOWN
        // ============================================================
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

        // ============================================================
        // UNIT SUMMARY
        // ============================================================
        unitSummary: [
          {
            $match: {
              isActive: true,
            },
          },

          {
            $group: {
              _id: "$unit",

              productCount: {
                $sum: 1,
              },

              totalUnits: {
                $sum: "$stockQuantity",
              },
            },
          },

          {
            $project: {
              _id: 0,
              unit: "$_id",
              productCount: 1,
              totalUnits: 1,
            },
          },

          {
            $sort: {
              totalUnits: -1,
            },
          },
        ],

        // ============================================================
        // PRODUCT LIST + CREATED/UPDATED BY LOOKUPS
        // ============================================================
        products: [
          {
            $sort: {
              isActive: -1,
              name: 1,
            },
          },

          // Get the user who created the product
          {
            $lookup: {
              from: User.collection.name,
              localField: "createdBy",
              foreignField: "_id",
              as: "createdByUser",
            },
          },

          // Get the user who last updated the product
          {
            $lookup: {
              from: User.collection.name,
              localField: "updatedBy",
              foreignField: "_id",
              as: "updatedByUser",
            },
          },

          // Convert lookup arrays into objects
          {
            $unwind: {
              path: "$createdByUser",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $unwind: {
              path: "$updatedByUser",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,

              name: 1,
              sku: 1,
              barcode: 1,
              category: 1,
              brand: 1,
              description: 1,

              price: 1,
              costPrice: 1,

              stockQuantity: 1,
              lowStockThreshold: 1,
              unit: 1,

              productImage: 1,
              productImagePublicId: 1,

              isActive: 1,

              // Return creator information instead of only ObjectId
              createdBy: {
                $cond: [
                  { $ifNull: ["$createdByUser._id", false] },
                  {
                    _id: "$createdByUser._id",
                    firstName: "$createdByUser.firstName",
                    lastName: "$createdByUser.lastName",
                    username: "$createdByUser.username",
                  },
                  null,
                ],
              },

              // Return updater information instead of only ObjectId
              updatedBy: {
                $cond: [
                  { $ifNull: ["$updatedByUser._id", false] },
                  {
                    _id: "$updatedByUser._id",
                    firstName: "$updatedByUser.firstName",
                    lastName: "$updatedByUser.lastName",
                    username: "$updatedByUser.username",
                  },
                  null,
                ],
              },

              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    },
  ]);

  const result = inventoryResult[0];

  const summary = result?.summary?.[0] || {
    totalProducts: 0,
    activeProducts: 0,
    archivedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalUnits: 0,
    totalInventoryValue: 0,
    totalRetailValue: 0,
  };

  res.status(200).json({
    summary,
    stockStatus: result?.stockStatus || [],
    unitSummary: result?.unitSummary || [],
    products: result?.products || [],
  });
});

// @DESCRIPTION Get inventory activity for a product
// @ROUTE       GET /api/inventory/:productId
// @ACCESS      Private/Admin
const getInventoryActivity = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const activities = await InventoryActivity.find({
    product: productId,
  })
    .populate("product", "name sku")
    .populate("performedBy", "firstName lastName username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    product: {
      _id: product._id,
      name: product.name,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
    },
    activities,
  });
});

// @DESCRIPTION Add stock to inventory
// @ROUTE       POST /api/inventory/:productId/add
// @ACCESS      Private/Admin
const addStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  const parsedQuantity = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be a positive whole number.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let populatedActivity;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      const previousStock = product.stockQuantity;
      const newStock = previousStock + parsedQuantity;

      product.stockQuantity = newStock;
      product.updatedBy = req.user._id;

      updatedProduct = await product.save({ session });

      const activity = await InventoryActivity.create(
        [
          {
            product: product._id,
            action: "stock_added",
            quantity: parsedQuantity,
            previousStock,
            newStock,
            reason: reason?.trim() || "",
            performedBy: req.user._id,
          },
        ],
        { session },
      );

      populatedActivity = await InventoryActivity.findById(activity[0]._id)
        .populate("product", "name sku")
        .populate("performedBy", "firstName lastName username")
        .session(session);
    });

    res.status(200).json({
      message: `${parsedQuantity} ${updatedProduct.unit} added to ${updatedProduct.name}`,
      product: updatedProduct,
      activity: populatedActivity,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Remove stock from inventory
// @ROUTE       POST /api/inventory/:productId/remove
// @ACCESS      Private/Admin
const removeStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  const parsedQuantity = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be a positive whole number.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let populatedActivity;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      const previousStock = product.stockQuantity;

      if (parsedQuantity > previousStock) {
        throw new Error("Cannot remove more stock than is currently available.");
      }

      const newStock = previousStock - parsedQuantity;

      product.stockQuantity = newStock;
      product.updatedBy = req.user._id;

      updatedProduct = await product.save({ session });

      const activity = await InventoryActivity.create(
        [
          {
            product: product._id,
            action: "stock_removed",
            quantity: parsedQuantity,
            previousStock,
            newStock,
            reason: reason?.trim() || "",
            performedBy: req.user._id,
          },
        ],
        { session },
      );

      populatedActivity = await InventoryActivity.findById(activity[0]._id)
        .populate("product", "name sku")
        .populate("performedBy", "firstName lastName username")
        .session(session);
    });

    res.status(200).json({
      message: `${parsedQuantity} ${updatedProduct.unit} removed from ${updatedProduct.name}`,
      product: updatedProduct,
      activity: populatedActivity,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Adjust stock to an exact quantity
// @ROUTE       POST /api/inventory/:productId/adjust
// @ACCESS      Private/Admin
const adjustStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { newQuantity, reason } = req.body;

  const parsedNewQuantity = Number(newQuantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  if (!Number.isInteger(parsedNewQuantity) || parsedNewQuantity < 0) {
    res.status(400);
    throw new Error("New stock quantity must be a whole number of 0 or greater.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let populatedActivity;
    let previousStock;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      previousStock = product.stockQuantity;

      if (previousStock === parsedNewQuantity) {
        throw new Error("The new stock quantity is the same as the current quantity.");
      }

      const difference = Math.abs(parsedNewQuantity - previousStock);

      product.stockQuantity = parsedNewQuantity;
      product.updatedBy = req.user._id;

      updatedProduct = await product.save({ session });

      const activity = await InventoryActivity.create(
        [
          {
            product: product._id,
            action: "stock_adjusted",
            quantity: difference,
            previousStock,
            newStock: parsedNewQuantity,
            reason: reason?.trim() || "Inventory adjustment",
            performedBy: req.user._id,
          },
        ],
        { session },
      );

      populatedActivity = await InventoryActivity.findById(activity[0]._id)
        .populate("product", "name sku")
        .populate("performedBy", "firstName lastName username")
        .session(session);
    });

    res.status(200).json({
      message: `${updatedProduct.name} stock adjusted from ${previousStock} to ${parsedNewQuantity}`,
      product: updatedProduct,
      activity: populatedActivity,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Record damaged stock
// @ROUTE       POST /api/inventory/:productId/damage
// @ACCESS      Private/Admin
const damageStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  const parsedQuantity = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be a positive whole number.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let populatedActivity;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      const previousStock = product.stockQuantity;

      if (parsedQuantity > previousStock) {
        throw new Error("Cannot damage more stock than is currently available.");
      }

      const newStock = previousStock - parsedQuantity;

      product.stockQuantity = newStock;
      product.updatedBy = req.user._id;

      updatedProduct = await product.save({ session });

      const activity = await InventoryActivity.create(
        [
          {
            product: product._id,
            action: "stock_damaged",
            quantity: parsedQuantity,
            previousStock,
            newStock,
            reason: reason?.trim() || "Damaged stock",
            performedBy: req.user._id,
          },
        ],
        { session },
      );

      populatedActivity = await InventoryActivity.findById(activity[0]._id)
        .populate("product", "name sku")
        .populate("performedBy", "firstName lastName username")
        .session(session);
    });

    res.status(200).json({
      message: `${parsedQuantity} ${updatedProduct.unit} marked as damaged`,
      product: updatedProduct,
      activity: populatedActivity,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Record returned stock
// @ROUTE       POST /api/inventory/:productId/return
// @ACCESS      Private/Admin
const returnStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  const parsedQuantity = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be a positive whole number.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;
    let populatedActivity;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found.");
      }

      const previousStock = product.stockQuantity;
      const newStock = previousStock + parsedQuantity;

      product.stockQuantity = newStock;
      product.updatedBy = req.user._id;

      updatedProduct = await product.save({ session });

      const activity = await InventoryActivity.create(
        [
          {
            product: product._id,
            action: "stock_returned",
            quantity: parsedQuantity,
            previousStock,
            newStock,
            reason: reason?.trim() || "Stock returned",
            performedBy: req.user._id,
          },
        ],
        { session },
      );

      populatedActivity = await InventoryActivity.findById(activity[0]._id)
        .populate("product", "name sku")
        .populate("performedBy", "firstName lastName username")
        .session(session);
    });

    res.status(200).json({
      message: `${parsedQuantity} ${updatedProduct.unit} returned to ${updatedProduct.name}`,
      product: updatedProduct,
      activity: populatedActivity,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Get recent inventory activity
// @ROUTE       GET /api/inventory/activity/recent
// @ACCESS      Private/Admin
const getRecentInventoryActivity = asyncHandler(async (req, res) => {
  const activities = await InventoryActivity.find()
    .populate("product", "name sku")
    .populate("performedBy", "firstName lastName username")
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    activities,
  });
});

export {
  getInventory,
  getInventoryActivity,
  addStock,
  removeStock,
  adjustStock,
  damageStock,
  returnStock,
  getRecentInventoryActivity,
};
