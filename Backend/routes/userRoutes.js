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
  updateUserByAdmin,
  deleteUserByAdmin,
  deleteUsersByAdmin,
  logoutUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import uploadProfileImage from "../utils/fileUpload.js";

router
  .route("/")
  .post(registerUser)
  .get(protect, isAdmin, getUsers)
  .delete(protect, isAdmin, deleteUsersByAdmin);

router.route("/sendverificationemail").post(sendVerificationEmail);
router.route("/:id/verifyemail/:token").get(verifyUserEmail);
router.route("/login").post(loginUser);
router.route("/sendresetpasswordemail").post(protect, sendResetPasswordOTPEmail);
router.route("/verifyresetpasswordotp").post(protect, verifyResetPasswordOTP);

router.route("/profile").put(protect, uploadProfileImage.single("profile"), updateUserProfile);

router
  .route("/:id")
  .delete(protect, isAdmin, deleteUserByAdmin)
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, uploadProfileImage.single("profile"), updateUserByAdmin);
router.route("/logout").post(logoutUser);

export default router;
