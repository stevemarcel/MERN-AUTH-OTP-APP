import express from "express";
const router = express.Router();
import {
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  loginUser,
  getUsers,
  getUserById,
  sendResetPasswordOTPEmail,
  verifyResetPasswordOTP,
  updateUserProfile,
  updateUser,
  deleteUser,
  logoutUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/sendverificationemail").post(sendVerificationEmail);
router.route("/:id/verifyemail/:token").get(verifyUserEmail);
router.route("/login").post(loginUser);
router.route("/sendresetpasswordemail").post(protect, sendResetPasswordOTPEmail);
router.route("/verifyresetpasswordotp").post(protect, verifyResetPasswordOTP);
router.route("/profile").put(protect, updateUserProfile);
// .put(protect, isAdmin, updateUser);
router
  .route("/:id")
  .delete(protect, isAdmin, deleteUser)
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUser);
router.route("/logout").post(logoutUser);

export default router;
