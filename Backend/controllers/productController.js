import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Product from "../models/productModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";
import {
  uploadProductImageToCloudinary,
  deleteProductImageFromCloudinary,
} from "../utils/cloudinaryUtils.js";

// @DESCRIPTION Get all products
// @ROUTE       GET /api/products
// @ACCESS      Private/Admin
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("createdBy", "firstName lastName username")
    .populate("updatedBy", "firstName lastName username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "All products details sent",
    products,
  });
});

// @DESCRIPTION Get product by ID
// @ROUTE       GET /api/products/:id
// @ACCESS      Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("createdBy", "firstName lastName username")
    .populate("updatedBy", "firstName lastName username");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

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
  // CLOUDINARY IMAGE UPLOAD
  // ============================================================

  let uploadedImage = null;

  try {
    if (req.file) {
      uploadedImage = await uploadProductImageToCloudinary(req.file.buffer);
    }

    const session = await mongoose.startSession();

    try {
      let createdProduct;

      await session.withTransaction(async () => {
        // Check SKU inside the transaction
        const skuExists = await Product.findOne({
          sku: normalizedSku,
        }).session(session);

        if (skuExists) {
          throw new Error("A product with this SKU already exists.");
        }

        // Check barcode only when provided
        if (barcode?.trim()) {
          const barcodeExists = await Product.findOne({
            barcode: barcode.trim(),
          }).session(session);

          if (barcodeExists) {
            throw new Error("A product with this barcode already exists.");
          }
        }

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

        // Initial stock creates an inventory history entry
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

      const populatedProduct = await Product.findById(createdProduct._id)
        .populate("createdBy", "firstName lastName username")
        .populate("updatedBy", "firstName lastName username");

      res.status(201).json({
        message: "Product created successfully",
        product: populatedProduct,
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    // If Cloudinary upload succeeded but database creation
    // failed, remove the newly uploaded image.
    if (uploadedImage?.public_id) {
      await deleteProductImageFromCloudinary(uploadedImage.public_id);
    }

    throw error;
  }
});

// @DESCRIPTION Update product information
// @ROUTE       PUT /api/products/:id
// @ACCESS      Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

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

  const oldProductImagePublicId = product.productImagePublicId;

  let uploadedImage = null;

  try {
    // ============================================================
    // SKU
    // ============================================================

    if (sku !== undefined) {
      const normalizedSku = sku.trim().toUpperCase();

      if (normalizedSku !== product.sku) {
        const skuExists = await Product.findOne({
          sku: normalizedSku,
          _id: { $ne: product._id },
        });

        if (skuExists) {
          res.status(400);
          throw new Error("A product with this SKU already exists.");
        }

        product.sku = normalizedSku;
      }
    }

    // ============================================================
    // BARCODE
    // ============================================================

    if (barcode !== undefined) {
      const normalizedBarcode = barcode?.trim() || null;

      if (normalizedBarcode !== product.barcode) {
        if (normalizedBarcode) {
          const barcodeExists = await Product.findOne({
            barcode: normalizedBarcode,
            _id: { $ne: product._id },
          });

          if (barcodeExists) {
            res.status(400);
            throw new Error("A product with this barcode already exists.");
          }
        }

        product.barcode = normalizedBarcode || undefined;
      }
    }

    // ============================================================
    // PRODUCT INFORMATION
    // ============================================================

    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400);
        throw new Error("Product name cannot be empty.");
      }

      product.name = name.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        res.status(400);
        throw new Error("Category cannot be empty.");
      }

      product.category = category.trim();
    }

    if (brand !== undefined) {
      product.brand = brand.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        res.status(400);
        throw new Error("Selling price must be a valid non-negative number.");
      }

      product.price = parsedPrice;
    }

    if (costPrice !== undefined) {
      const parsedCostPrice = Number(costPrice);

      if (!Number.isFinite(parsedCostPrice) || parsedCostPrice < 0) {
        res.status(400);
        throw new Error("Cost price must be a valid non-negative number.");
      }

      product.costPrice = parsedCostPrice;
    }

    if (lowStockThreshold !== undefined) {
      const parsedThreshold = Number(lowStockThreshold);

      if (!Number.isInteger(parsedThreshold) || parsedThreshold < 0) {
        res.status(400);
        throw new Error("Low stock threshold must be a whole number of 0 or greater.");
      }

      product.lowStockThreshold = parsedThreshold;
    }

    if (unit !== undefined) {
      if (!unit.trim()) {
        res.status(400);
        throw new Error("Product unit cannot be empty.");
      }

      product.unit = unit.trim();
    }

    if (isActive !== undefined) {
      product.isActive = isActive === true || isActive === "true";
    }

    // ============================================================
    // PRODUCT IMAGE
    // ============================================================

    if (req.file) {
      uploadedImage = await uploadProductImageToCloudinary(req.file.buffer);

      product.productImage = uploadedImage.optimized_url;

      product.productImagePublicId = uploadedImage.public_id;
    } else if (removeProductImage === true || removeProductImage === "true") {
      product.productImage = "";
      product.productImagePublicId = null;
    }

    product.updatedBy = req.user._id;

    // ============================================================
    // SAVE
    // ============================================================

    const updatedProduct = await product.save();

    // ============================================================
    // DELETE OLD CLOUDINARY IMAGE
    // ============================================================

    const imageWasChanged =
      Boolean(req.file) || removeProductImage === true || removeProductImage === "true";

    if (
      imageWasChanged &&
      oldProductImagePublicId &&
      oldProductImagePublicId !== updatedProduct.productImagePublicId
    ) {
      await deleteProductImageFromCloudinary(oldProductImagePublicId);
    }

    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate("createdBy", "firstName lastName username")
      .populate("updatedBy", "firstName lastName username");

    res.status(200).json({
      message: "Product updated successfully",
      product: populatedProduct,
    });
  } catch (error) {
    // Remove newly uploaded Cloudinary image if the
    // database update fails.
    if (uploadedImage?.public_id) {
      await deleteProductImageFromCloudinary(uploadedImage.public_id);
    }

    throw error;
  }
});

// @DESCRIPTION Archive a product
// @ROUTE       DELETE /api/products/:id
// @ACCESS      Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!product.isActive) {
    res.status(400);
    throw new Error("Product is already archived.");
  }

  product.isActive = false;
  product.updatedBy = req.user._id;

  await product.save();

  res.status(200).json({
    message: `${product.name} archived successfully`,
    productId: product._id,
  });
});

// @DESCRIPTION Archive multiple products
// @ROUTE       DELETE /api/products
// @ACCESS      Private/Admin
const deleteProducts = asyncHandler(async (req, res) => {
  let { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of product IDs to archive.");
  }

  productIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (productIds.length === 0) {
    res.status(400);
    throw new Error("No valid product IDs were provided.");
  }

  const productsToArchive = await Product.find({
    _id: { $in: productIds },
  }).select("_id name isActive");

  if (productsToArchive.length === 0) {
    res.status(404);
    throw new Error("No products found.");
  }

  const activeProductIds = productsToArchive
    .filter((product) => product.isActive)
    .map((product) => product._id);

  if (activeProductIds.length === 0) {
    res.status(400);
    throw new Error("All selected products are already archived.");
  }

  const updateResult = await Product.updateMany(
    {
      _id: { $in: activeProductIds },
    },
    {
      $set: {
        isActive: false,
        updatedBy: req.user._id,
      },
    },
  );

  res.status(200).json({
    message: `${updateResult.modifiedCount} products archived successfully`,
    archivedCount: updateResult.modifiedCount,
  });
});

// @DESCRIPTION Restore an archived product
// @ROUTE       PATCH /api/products/:id/restore
// @ACCESS      Private/Admin
const restoreProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.isActive) {
    res.status(400);
    throw new Error("Product is already active.");
  }

  product.isActive = true;
  product.updatedBy = req.user._id;

  const restoredProduct = await product.save();

  const populatedProduct = await Product.findById(restoredProduct._id)
    .populate("createdBy", "firstName lastName username")
    .populate("updatedBy", "firstName lastName username");

  res.status(200).json({
    message: `${product.name} restored successfully`,
    product: populatedProduct,
  });
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
