import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "'Product Name' field cannot be empty"],
      trim: true,
    },

    sku: {
      type: String,
      required: [true, "'SKU' field cannot be empty"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "'Category' field cannot be empty"],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "'Selling Price' field cannot be empty"],
      min: [0, "Selling price cannot be negative"],
    },

    costPrice: {
      type: Number,
      required: [true, "'Cost Price' field cannot be empty"],
      min: [0, "Cost price cannot be negative"],
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
    },

    lowStockThreshold: {
      type: Number,
      required: true,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
    },

    unit: {
      type: String,
      required: [true, "'Unit' field cannot be empty"],
      trim: true,
      default: "piece",
    },

    productImage: {
      type: String,
      default: "",
    },

    productImagePublicId: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes for product searches and inventory filtering
productSchema.index({ name: "text", sku: "text", barcode: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ stockQuantity: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
