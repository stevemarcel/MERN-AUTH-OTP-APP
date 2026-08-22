import express from "express";
import {
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  sendResetPasswordOTPEmail,
  verifyResetPasswordOTP,
  updateUserProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
  deleteUsersByAdmin,
  logoutUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import uploadProfileImage from "../utils/fileUpload.js";

const router = express.Router();

router
  .route("/")
  .post(registerUser) // Register a new user
  .get(protect, isAdmin, getUsers) // Get all users (Admin only)
  .delete(protect, isAdmin, deleteUsersByAdmin); // Delete multiple users (Admin only)

router.route("/sendverificationemail").post(sendVerificationEmail); // Send verification email
router.route("/:id/verifyemail/:token").get(verifyUserEmail); // Verify user email with token
router.route("/login").post(loginUser); // User login
router.route("/sendresetpasswordemail").post(protect, sendResetPasswordOTPEmail); // Send reset password OTP email
router.route("/verifyresetpasswordotp").post(protect, verifyResetPasswordOTP); // Verify reset password OTP

router
  .route("/profile")
  .get(protect, getUserProfile) // Get user profile (Protected route)
  .put(protect, uploadProfileImage.single("profile"), updateUserProfile); // Update user profile (Protected route)

router
  .route("/:id")
  .delete(protect, isAdmin, deleteUserByAdmin) // Delete a user by ID (Admin only)
  .get(protect, isAdmin, getUserById) // Get a user by ID (Admin only)
  .put(protect, isAdmin, uploadProfileImage.single("profile"), updateUserByAdmin); // Update a user by ID (Admin only)
router.route("/logout").post(logoutUser); // User logout

export default router;
