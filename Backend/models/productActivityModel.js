import mongoose from "mongoose";

const productActivitySchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: ["product_created", "product_updated", "product_archived", "product_restored"],
    },

    changedFields: {
      type: [String],
      default: [],
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

productActivitySchema.index({
  product: 1,
  createdAt: -1,
});

productActivitySchema.index({
  performedBy: 1,
  createdAt: -1,
});

productActivitySchema.index({
  createdAt: -1,
});

const ProductActivity = mongoose.model("ProductActivity", productActivitySchema);

export default ProductActivity;
