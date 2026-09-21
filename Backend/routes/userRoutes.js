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
  permanentlyDeleteUserByAdmin,
  restoreUserByAdmin,
  deleteUserByAdmin,
  deleteUsersByAdmin,
  logoutUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import uploadProfileImage from "../utils/fileUpload.js";

const router = express.Router();

// * 1. User registration, Get all users, and Delete multiple users (Admin only)
router
  .route("/")
  .post(registerUser) // Register a new user
  .get(protect, isAdmin, getUsers) // Get all users (Admin only)
  .delete(protect, isAdmin, deleteUsersByAdmin); // Remove multiple users (Admin only)

// * 2. Email verification and password reset routes
router.route("/sendverificationemail").post(sendVerificationEmail); // Send verification email
router.route("/:id/verifyemail/:token").get(verifyUserEmail); // Verify user email with token
router.route("/sendresetpasswordemail").post(protect, sendResetPasswordOTPEmail); // Send reset password OTP email
router.route("/verifyresetpasswordotp").post(protect, verifyResetPasswordOTP); // Verify reset password OTP

// * 3. User login
router.route("/login").post(loginUser); // User login

// * 4. User profile management
router
  .route("/profile")
  .get(protect, getUserProfile) // Get user profile (Protected route)
  .put(protect, uploadProfileImage.single("profile"), updateUserProfile); // Update user profile (Protected route)

// * 5. Admin user management (Get, Update, Delete a specific user by ID)
router
  .route("/:id")
  .patch(protect, isAdmin, restoreUserByAdmin) // Restore a removed user by ID (Admin only)
  .delete(protect, isAdmin, deleteUserByAdmin) // Remove a user by ID (Admin only)
  .get(protect, isAdmin, getUserById) // Get a user by ID (Admin only)
  .put(protect, isAdmin, uploadProfileImage.single("profile"), updateUserByAdmin); // Update a user by ID (Admin only)

// * 6. Permanent deletion of a previously removed user by ID (Admin only)
router.delete("/:id/permanent", protect, isAdmin, permanentlyDeleteUserByAdmin);

// * 7. User logout
router.route("/logout").post(logoutUser); // User logout

export default router;
