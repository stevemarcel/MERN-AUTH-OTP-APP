import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  sendResetPasswordOTPEmail,
  verifyResetPasswordOTP,
  resetPassword,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/sendverificationemail").post(sendVerificationEmail);
router.route("/:id/verifyemail/:token").get(verifyUserEmail);
router.route("/login").post(loginUser);
router.route("/sendresetpasswordemail").post(sendResetPasswordOTPEmail);
router.route("/verifyresetpasswordotp").get(verifyResetPasswordOTP);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .put(protect, resetPassword);
router.route("/logout").post(logoutUser);

export default router;
