import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Product from "../models/productModel.js";
import ProductActivity from "../models/productActivityModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";

import {
  uploadProductImageToCloudinary,
  deleteProductImageFromCloudinary,
} from "../utils/cloudinaryUtils.js";

// ============================================================
// HELPER
// ============================================================

const createProductActivity = async ({
  product,
  action,
  changedFields = [],
  reason = "",
  performedBy,
  session,
}) => {
  const [activity] = await ProductActivity.create(
    [
      {
        product,
        action,
        changedFields,
        reason,
        performedBy,
      },
    ],
    { session },
  );

  return activity;
};

// ============================================================
// GET ALL PRODUCTS
// ============================================================

// @DESCRIPTION Get all products
// @ROUTE       GET /api/products
// @ACCESS      Private/Admin
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("createdBy", "firstName lastName username isAdmin accountStatus")
    .populate("updatedBy", "firstName lastName username isAdmin accountStatus")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "All products details sent",
    products,
  });
});

// ============================================================
// GET PRODUCT BY ID
// ============================================================

// @DESCRIPTION Get product by ID
// @ROUTE       GET /api/products/:id
// @ACCESS      Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("createdBy", "firstName lastName username isAdmin accountStatus")
    .populate("updatedBy", "firstName lastName username isAdmin accountStatus");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

// ============================================================
// CREATE PRODUCT
// ============================================================

// @DESCRIPTION Create a new product
// @ROUTE       POST /api/products
// @ACCESS      Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    barcode,
    category,
    brand,
    description,
    price,
    costPrice,
    stockQuantity,
    lowStockThreshold,
    unit,
    isActive,
  } = req.body;

  // ============================================================
  // BASIC VALIDATION
  // ============================================================

  if (!name || !sku || !category || price === undefined || costPrice === undefined) {
    res.status(400);
    throw new Error("Name, SKU, category, selling price, and cost price are required.");
  }

  const normalizedSku = sku.trim().toUpperCase();

  const parsedPrice = Number(price);
  const parsedCostPrice = Number(costPrice);
  const parsedStockQuantity = Number(stockQuantity ?? 0);
  const parsedLowStockThreshold = Number(lowStockThreshold ?? 10);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    res.status(400);
    throw new Error("Selling price must be a valid non-negative number.");
  }

  if (!Number.isFinite(parsedCostPrice) || parsedCostPrice < 0) {
    res.status(400);
    throw new Error("Cost price must be a valid non-negative number.");
  }

  if (!Number.isInteger(parsedStockQuantity) || parsedStockQuantity < 0) {
    res.status(400);
    throw new Error("Initial stock quantity must be a whole number of 0 or greater.");
  }

  if (!Number.isInteger(parsedLowStockThreshold) || parsedLowStockThreshold < 0) {
    res.status(400);
    throw new Error("Low stock threshold must be a whole number of 0 or greater.");
  }

  if (!unit?.trim()) {
    res.status(400);
    throw new Error("Product unit is required.");
  }

  // ============================================================
  // CLOUDINARY
  // ============================================================

  let uploadedImage = null;

  try {
    if (req.file) {
      uploadedImage = await uploadProductImageToCloudinary(req.file.buffer);
    }

    // ============================================================
    // DATABASE TRANSACTION
    // ============================================================

    const session = await mongoose.startSession();

    try {
      let createdProduct;

      await session.withTransaction(async () => {
        // ======================================================
        // SKU CHECK
        // ======================================================

        const skuExists = await Product.findOne({
          sku: normalizedSku,
        }).session(session);

        if (skuExists) {
          throw new Error("A product with this SKU already exists.");
        }

        // ======================================================
        // BARCODE CHECK
        // ======================================================

        if (barcode?.trim()) {
          const normalizedBarcode = barcode.trim();

          const barcodeExists = await Product.findOne({
            barcode: normalizedBarcode,
          }).session(session);

          if (barcodeExists) {
            throw new Error("A product with this barcode already exists.");
          }
        }

        // ======================================================
        // CREATE PRODUCT
        // ======================================================

        const products = await Product.create(
          [
            {
              name: name.trim(),

              sku: normalizedSku,

              barcode: barcode?.trim() || undefined,

              category: category.trim(),

              brand: brand?.trim() || "",

              description: description?.trim() || "",

              price: parsedPrice,

              costPrice: parsedCostPrice,

              stockQuantity: parsedStockQuantity,

              lowStockThreshold: parsedLowStockThreshold,

              unit: unit.trim(),

              productImage: uploadedImage?.optimized_url || "",

              productImagePublicId: uploadedImage?.public_id || null,

              isActive: isActive !== undefined ? isActive === true || isActive === "true" : true,

              createdBy: req.user._id,
            },
          ],
          { session },
        );

        createdProduct = products[0];

        // ======================================================
        // PRODUCT ACTIVITY
        // ======================================================

        await createProductActivity({
          product: createdProduct._id,

          action: "product_created",

          performedBy: req.user._id,

          session,
        });

        // ======================================================
        // INITIAL INVENTORY ACTIVITY
        // ======================================================

        if (parsedStockQuantity > 0) {
          await InventoryActivity.create(
            [
              {
                product: createdProduct._id,

                action: "stock_received",

                quantity: parsedStockQuantity,

                previousStock: 0,

                newStock: parsedStockQuantity,

                reason: "Initial product stock",

                performedBy: req.user._id,
              },
            ],
            { session },
          );
        }
      });

      // ==========================================================
      // POPULATE PRODUCT AFTER TRANSACTION
      // ==========================================================

      const populatedProduct = await Product.findById(createdProduct._id)
        .populate("createdBy", "firstName lastName username isAdmin accountStatus")
        .populate("updatedBy", "firstName lastName username isAdmin accountStatus");

      res.status(201).json({
        message: "Product created successfully",

        product: populatedProduct,
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    // ============================================================
    // CLOUDINARY CLEANUP IF DATABASE TRANSACTION FAILED
    // ============================================================

    if (uploadedImage?.public_id) {
      await deleteProductImageFromCloudinary(uploadedImage.public_id);
    }

    throw error;
  }
});

// ============================================================
// UPDATE PRODUCT
// ============================================================

// @DESCRIPTION Update product information
// @ROUTE       PUT /api/products/:id
// @ACCESS      Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    barcode,
    category,
    brand,
    description,
    price,
    costPrice,
    lowStockThreshold,
    unit,
    isActive,
    removeProductImage,
  } = req.body;

  let uploadedImage = null;

  let transactionCommitted = false;

  let oldProductImagePublicId = null;

  let imageWasChanged = false;

  const session = await mongoose.startSession();

  try {
    // ==========================================================
    // CLOUDINARY UPLOAD
    // ==========================================================

    if (req.file) {
      uploadedImage = await uploadProductImageToCloudinary(req.file.buffer);
    }

    let updatedProduct;

    await session.withTransaction(async () => {
      // ========================================================
      // FIND PRODUCT INSIDE TRANSACTION
      // ========================================================

      const product = await Product.findById(req.params.id).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      oldProductImagePublicId = product.productImagePublicId;

      // ========================================================
      // TRACK CHANGES
      // ========================================================

      const changedFields = [];

      let lifecycleAction = null;

      // ========================================================
      // SKU
      // ========================================================

      if (sku !== undefined) {
        const normalizedSku = sku.trim().toUpperCase();

        if (normalizedSku !== product.sku) {
          const skuExists = await Product.findOne({
            sku: normalizedSku,
            _id: {
              $ne: product._id,
            },
          }).session(session);

          if (skuExists) {
            throw new Error("A product with this SKU already exists.");
          }

          product.sku = normalizedSku;

          changedFields.push("sku");
        }
      }

      // ========================================================
      // BARCODE
      // ========================================================

      if (barcode !== undefined) {
        const normalizedBarcode = barcode?.trim() || null;

        const currentBarcode = product.barcode || null;

        if (normalizedBarcode !== currentBarcode) {
          if (normalizedBarcode) {
            const barcodeExists = await Product.findOne({
              barcode: normalizedBarcode,

              _id: {
                $ne: product._id,
              },
            }).session(session);

            if (barcodeExists) {
              throw new Error("A product with this barcode already exists.");
            }
          }

          product.barcode = normalizedBarcode || undefined;

          changedFields.push("barcode");
        }
      }

      // ========================================================
      // NAME
      // ========================================================

      if (name !== undefined) {
        const normalizedName = name.trim();

        if (!normalizedName) {
          throw new Error("Product name cannot be empty.");
        }

        if (normalizedName !== product.name) {
          product.name = normalizedName;

          changedFields.push("name");
        }
      }

      // ========================================================
      // CATEGORY
      // ========================================================

      if (category !== undefined) {
        const normalizedCategory = category.trim();

        if (!normalizedCategory) {
          throw new Error("Category cannot be empty.");
        }

        if (normalizedCategory !== product.category) {
          product.category = normalizedCategory;

          changedFields.push("category");
        }
      }

      // ========================================================
      // BRAND
      // ========================================================

      if (brand !== undefined) {
        const normalizedBrand = brand.trim();

        if (normalizedBrand !== product.brand) {
          product.brand = normalizedBrand;

          changedFields.push("brand");
        }
      }

      // ========================================================
      // DESCRIPTION
      // ========================================================

      if (description !== undefined) {
        const normalizedDescription = description.trim();

        if (normalizedDescription !== product.description) {
          product.description = normalizedDescription;

          changedFields.push("description");
        }
      }

      // ========================================================
      // SELLING PRICE
      // ========================================================

      if (price !== undefined) {
        const parsedPrice = Number(price);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
          throw new Error("Selling price must be a valid non-negative number.");
        }

        if (parsedPrice !== product.price) {
          product.price = parsedPrice;

          changedFields.push("price");
        }
      }

      // ========================================================
      // COST PRICE
      // ========================================================

      if (costPrice !== undefined) {
        const parsedCostPrice = Number(costPrice);

        if (!Number.isFinite(parsedCostPrice) || parsedCostPrice < 0) {
          throw new Error("Cost price must be a valid non-negative number.");
        }

        if (parsedCostPrice !== product.costPrice) {
          product.costPrice = parsedCostPrice;

          changedFields.push("costPrice");
        }
      }

      // ========================================================
      // LOW STOCK THRESHOLD
      // ========================================================

      if (lowStockThreshold !== undefined) {
        const parsedThreshold = Number(lowStockThreshold);

        if (!Number.isInteger(parsedThreshold) || parsedThreshold < 0) {
          throw new Error("Low stock threshold must be a whole number of 0 or greater.");
        }

        if (parsedThreshold !== product.lowStockThreshold) {
          product.lowStockThreshold = parsedThreshold;

          changedFields.push("lowStockThreshold");
        }
      }

      // ========================================================
      // UNIT
      // ========================================================

      if (unit !== undefined) {
        const normalizedUnit = unit.trim();

        if (!normalizedUnit) {
          throw new Error("Product unit cannot be empty.");
        }

        if (normalizedUnit !== product.unit) {
          product.unit = normalizedUnit;

          changedFields.push("unit");
        }
      }

      // ========================================================
      // ACTIVE / ARCHIVED STATE
      // ========================================================

      if (isActive !== undefined) {
        const nextIsActive = isActive === true || isActive === "true";

        if (nextIsActive !== product.isActive) {
          lifecycleAction = nextIsActive ? "product_restored" : "product_archived";

          product.isActive = nextIsActive;
        }
      }

      // ========================================================
      // PRODUCT IMAGE
      // ========================================================

      const shouldRemoveProductImage = removeProductImage === true || removeProductImage === "true";

      if (req.file) {
        uploadedImage = uploadedImage || (await uploadProductImageToCloudinary(req.file.buffer));

        product.productImage = uploadedImage.optimized_url;

        product.productImagePublicId = uploadedImage.public_id;

        imageWasChanged = true;

        changedFields.push("productImage");
      } else if (shouldRemoveProductImage) {
        const currentlyHasImage = Boolean(product.productImage || product.productImagePublicId);

        if (currentlyHasImage) {
          product.productImage = "";

          product.productImagePublicId = null;

          imageWasChanged = true;

          changedFields.push("productImage");
        }
      }

      // ========================================================
      // UPDATED BY
      // ========================================================

      product.updatedBy = req.user._id;

      // ========================================================
      // SAVE PRODUCT
      // ========================================================

      updatedProduct = await product.save({
        session,
      });

      // ========================================================
      // PRODUCT INFORMATION ACTIVITY
      // ========================================================

      if (changedFields.length > 0) {
        await createProductActivity({
          product: updatedProduct._id,

          action: "product_updated",

          changedFields,

          performedBy: req.user._id,

          session,
        });
      }

      // ========================================================
      // PRODUCT LIFECYCLE ACTIVITY
      // ========================================================

      if (lifecycleAction) {
        await createProductActivity({
          product: updatedProduct._id,

          action: lifecycleAction,

          performedBy: req.user._id,

          session,
        });
      }
    });

    transactionCommitted = true;

    // ==========================================================
    // DELETE OLD CLOUDINARY IMAGE
    // ==========================================================
    // This happens AFTER the database transaction succeeds.
    // Never delete the old image before this point.
    // ==========================================================

    if (
      imageWasChanged &&
      oldProductImagePublicId &&
      oldProductImagePublicId !== updatedProduct.productImagePublicId
    ) {
      try {
        await deleteProductImageFromCloudinary(oldProductImagePublicId);
      } catch (cloudinaryError) {
        // Database is already correct. Do not delete
        // the new image or turn a successful update into
        // a broken product image.
        console.error("Failed to delete old product image from Cloudinary:", cloudinaryError);
      }
    }

    // ==========================================================
    // POPULATED PRODUCT
    // ==========================================================

    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate("createdBy", "firstName lastName username isAdmin accountStatus")
      .populate("updatedBy", "firstName lastName username isAdmin accountStatus");

    res.status(200).json({
      message: "Product updated successfully",

      product: populatedProduct,
    });
  } catch (error) {
    // ==========================================================
    // ONLY REMOVE NEW CLOUDINARY IMAGE IF DB TRANSACTION FAILED
    // ==========================================================

    if (!transactionCommitted && uploadedImage?.public_id) {
      try {
        await deleteProductImageFromCloudinary(uploadedImage.public_id);
      } catch (cloudinaryError) {
        console.error(
          "Failed to clean up uploaded product image after transaction failure:",
          cloudinaryError,
        );
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
});

// ============================================================
// ARCHIVE SINGLE PRODUCT
// ============================================================

// @DESCRIPTION Archive a product
// @ROUTE       DELETE /api/products/:id
// @ACCESS      Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let archivedProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(req.params.id).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      if (!product.isActive) {
        throw new Error("Product is already archived.");
      }

      product.isActive = false;
      product.updatedBy = req.user._id;

      archivedProduct = await product.save({
        session,
      });

      await createProductActivity({
        product: archivedProduct._id,

        action: "product_archived",

        performedBy: req.user._id,

        session,
      });
    });

    res.status(200).json({
      message: `${archivedProduct.name} archived successfully`,

      productId: archivedProduct._id,
    });
  } finally {
    await session.endSession();
  }
});

// ============================================================
// ARCHIVE MULTIPLE PRODUCTS
// ============================================================

// @DESCRIPTION Archive multiple products
// @ROUTE       DELETE /api/products
// @ACCESS      Private/Admin
const deleteProducts = asyncHandler(async (req, res) => {
  let { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of product IDs to archive.");
  }

  // Remove invalid IDs and duplicate IDs
  productIds = [...new Set(productIds.filter((id) => mongoose.Types.ObjectId.isValid(id)))];

  if (productIds.length === 0) {
    res.status(400);
    throw new Error("No valid product IDs were provided.");
  }

  const session = await mongoose.startSession();

  try {
    let archivedCount = 0;

    await session.withTransaction(async () => {
      // ========================================================
      // FIND ACTIVE PRODUCTS
      // ========================================================

      const productsToArchive = await Product.find({
        _id: {
          $in: productIds,
        },

        isActive: true,
      }).session(session);

      if (productsToArchive.length === 0) {
        throw new Error("All selected products are already archived or were not found.");
      }

      // ========================================================
      // ARCHIVE PRODUCTS
      // ========================================================

      const activeProductIds = productsToArchive.map((product) => product._id);

      const updateResult = await Product.updateMany(
        {
          _id: {
            $in: activeProductIds,
          },
        },
        {
          $set: {
            isActive: false,

            updatedBy: req.user._id,
          },
        },
        {
          session,
        },
      );

      archivedCount = updateResult.modifiedCount;

      // ========================================================
      // PRODUCT ACTIVITY FOR EACH PRODUCT
      // ========================================================

      const activityDocuments = productsToArchive.map((product) => ({
        product: product._id,

        action: "product_archived",

        changedFields: [],

        reason: "",

        performedBy: req.user._id,
      }));

      await ProductActivity.insertMany(activityDocuments, {
        session,
      });
    });

    res.status(200).json({
      message: `${archivedCount} products archived successfully`,

      archivedCount,
    });
  } finally {
    await session.endSession();
  }
});

// ============================================================
// RESTORE PRODUCT
// ============================================================

// @DESCRIPTION Restore an archived product
// @ROUTE       PATCH /api/products/:id/restore
// @ACCESS      Private/Admin
const restoreProduct = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let restoredProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(req.params.id).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.isActive) {
        throw new Error("Product is already active.");
      }

      product.isActive = true;
      product.updatedBy = req.user._id;

      restoredProduct = await product.save({
        session,
      });

      await createProductActivity({
        product: restoredProduct._id,

        action: "product_restored",

        performedBy: req.user._id,

        session,
      });
    });

    const populatedProduct = await Product.findById(restoredProduct._id)
      .populate("createdBy", "firstName lastName username isAdmin accountStatus")
      .populate("updatedBy", "firstName lastName username isAdmin accountStatus");

    res.status(200).json({
      message: `${restoredProduct.name} restored successfully`,

      product: populatedProduct,
    });
  } finally {
    await session.endSession();
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  restoreProduct,
};
