import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "registered",
        "profile_updated",
        "email_verified",
        "password_changed",
        "admin_updated",
        "profile_picture_updated",
        "deleted",
      ],
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
