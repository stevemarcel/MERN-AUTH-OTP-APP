import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/:id/verifyemail/:token").get(verifyUserEmail);
router.route("/sendverificationemail").post(sendVerificationEmail);
router.route("/login").post(loginUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/logout").post(logoutUser);

export default router;
