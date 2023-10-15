import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  confirmUserEmail,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/confirmEmail").post(confirmUserEmail);
router.route("/login").post(loginUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/logout").post(logoutUser);

export default router;
