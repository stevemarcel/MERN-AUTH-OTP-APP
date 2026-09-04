import mongoose from "mongoose";

const inventoryActivitySchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "stock_received",
        "stock_added",
        "stock_removed",
        "stock_adjusted",
        "stock_damaged",
        "stock_returned",
      ],
    },

    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },

    previousStock: {
      type: Number,
      required: true,
      min: [0, "Previous stock cannot be negative"],
    },

    newStock: {
      type: Number,
      required: true,
      min: [0, "New stock cannot be negative"],
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Useful for retrieving a product's inventory history
inventoryActivitySchema.index({ product: 1, createdAt: -1 });

// Useful for recent inventory activity
inventoryActivitySchema.index({ createdAt: -1 });

const InventoryActivity = mongoose.model("InventoryActivity", inventoryActivitySchema);

export default InventoryActivity;
