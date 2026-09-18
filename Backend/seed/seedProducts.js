import "dotenv/config";

import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import InventoryActivity from "../models/inventoryActivityModel.js";
import User from "../models/userModels.js";

import productSeedData from "./productSeedData.js";

const seedProducts = async () => {
  try {
    await connectDB();

    // ------------------------------------------------------------
    // Find an admin who will be recorded as the creator
    // ------------------------------------------------------------

    const adminUser = await User.findOne({
      isAdmin: true,
    });

    if (!adminUser) {
      throw new Error("No admin user found. Create an admin user before running the product seed.");
    }

    // ------------------------------------------------------------
    // Safety check
    // ------------------------------------------------------------

    const existingProductCount = await Product.countDocuments();

    if (existingProductCount > 0) {
      throw new Error(
        `Product collection already contains ${existingProductCount} product(s). Seed aborted to prevent accidental duplication or data loss.`,
      );
    }

    // ------------------------------------------------------------
    // Start transaction
    // ------------------------------------------------------------

    const session = await mongoose.startSession();

    try {
      let createdProducts = [];

      await session.withTransaction(async () => {
        createdProducts = await Product.insertMany(
          productSeedData.map((product) => ({
            ...product,

            productImage: "",
            productImagePublicId: null,

            isActive: true,

            createdBy: adminUser._id,
            updatedBy: null,
          })),
          { session },
        );

        // --------------------------------------------------------
        // Create initial inventory activity for products
        // that start with stock.
        // --------------------------------------------------------

        const inventoryActivities = createdProducts
          .filter((product) => product.stockQuantity > 0)
          .map((product) => ({
            product: product._id,
            action: "stock_received",
            quantity: product.stockQuantity,
            previousStock: 0,
            newStock: product.stockQuantity,
            reason: "Initial product seed",
            performedBy: adminUser._id,
          }));

        if (inventoryActivities.length > 0) {
          await InventoryActivity.insertMany(inventoryActivities, { session });
        }
      });

      console.log(`Successfully seeded ${createdProducts.length} products.`);

      console.log(
        `Created initial inventory activities for ${
          createdProducts.filter((product) => product.stockQuantity > 0).length
        } products.`,
      );
    } finally {
      await session.endSession();
    }

    await mongoose.connection.close();

    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Product seed failed:");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();
