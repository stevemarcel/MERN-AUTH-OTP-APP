import asyncHandler from "express-async-handler";

// Import necessary models
import User from "../models/userModels.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";

// Import utility functions
import { PLACEHOLDER_PROFILE_IMAGE } from "../utils/fileUpload.js";
import genToken from "../utils/genToken.js";
import sendEmail from "../utils/sendEmail.js";
import logUserActivity from "../utils/userActivityLogger.js";

import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to remove old profile image from the file system
const removeOldProfileImage = (oldImagePath) => {
  if (oldImagePath && oldImagePath !== PLACEHOLDER_PROFILE_IMAGE) {
    const fullPathToDelete = path.join(__dirname, "..", oldImagePath);

    // Check if the file actually exists on the disk before attempting to delete
    if (fs.existsSync(fullPathToDelete)) {
      fs.unlink(fullPathToDelete, (err) => {
        if (err) {
          console.error(`Error deleting old profile image '${fullPathToDelete}':`, err);
        } else {
          console.log(`Successfully deleted old profile image: ${fullPathToDelete}`);
        }
      });
    } else {
      console.log(`Old profile image not found on disk, skipping deletion: ${fullPathToDelete}`);
    }
  }
};

// @DESCRIPTION Register new user
// @ROUTE       POST /api/users
// @ACCESS      Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, isAdminCreatingUser, username } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    isAdminCreatingUser,
    username,
  });

  if (user) {
    const isAdminCreatingUser = user.isAdminCreatingUser;

    // Log user registration activity
    await logUserActivity({
      user: user._id,
      action: "registered",
      performedBy: isAdminCreatingUser ? req.user?._id : null,
      description: isAdminCreatingUser
        ? `${user.firstName} ${user.lastName} was created by an admin`
        : `${user.firstName} ${user.lastName} registered`,
    });

    let message;

    if (isAdminCreatingUser) {
      message = "Sample user generated";
    } else {
      // User is self-registering
      genToken(res, user._id);
      message = "User registered successfully";
    }

    res.status(201).json({
      message,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isAdminCreatingUser: user.isAdminCreatingUser,
      emailVerified: user.emailVerified,
      resetSession: user.resetSession,
      username: user.username,
      profile: user.profile,
      address: user.address,
      mobile: user.mobile,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @DESCRIPTION Send registration verification Email with link
// @ROUTE       POST /api/users/sendverificationemail
// @ACCESS      Public
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const mode = "verifyEmail";
  const expiry = process.env.EMAIL_EXPIRY;

  // If user is not found
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Check if token already exists for this user
  const findToken = await EmailVerifyToken.findOne({ userId: user._id });

  // If a token already exists, delete it to issue a new one
  if (findToken) {
    await EmailVerifyToken.deleteOne({ userId: user._id });
  }

  if (!user.emailVerified) {
    try {
      await sendEmail(user, mode);
      res.status(201).json({ verificationEmail: user.email, expiry: Number(expiry) });
    } catch (err) {
      res.status(500);
      throw new Error("Failed to send verification email. Please try again later.");
    }
  } else {
    // If email is already verified
    res.status(200).json({ message: "Email Verified Already" });
  }
});

// @DESCRIPTION Verify Email of new user from sent email link
// @ROUTE       GET /api/users/:id/verifyemail/:token
// @ACCESS      Public
const verifyUserEmail = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(400);
      throw new Error("Invalid Verification Link");
    }

    // If email is already verified, no need to proceed
    if (user.emailVerified) {
      res.status(200);
      throw new Error("Email already verified.");
    }

    const clientToken = req.params.token;

    const findToken = await EmailVerifyToken.findOne({
      userId: user._id,
    });

    // Match client Token with EmailVerify token
    const clientTokenVerified = await findToken.matchToken(clientToken);

    if (!clientTokenVerified) {
      res.status(400);
      throw new Error("Invalid verification token.");
    }

    // If token is verified, delete it from the database
    await EmailVerifyToken.deleteOne({ userId: user._id });

    // Mark user's email as verified
    user.emailVerified = true;
    await user.save();

    // Log user activity for email verification
    await logUserActivity({
      user: user._id,
      action: "email_verified",
      performedBy: user._id,
      description: `${user.firstName} ${user.lastName} verified their email`,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Email Verified", user.emailVerified);
    }

    res.status(200).json({
      message: "Email Verified",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Email verification failed.");
  }
});

// @DESCRIPTION Auth and login in existing user/set token
// @ROUTE       POST /api/users/login
// @ACCESS      Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    genToken(res, user._id); // Generate JWT token and set as cookie
    res.status(201).json({
      message: "Login successful",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      resetSession: user.resetSession,
      username: user.username,
      profile: user.profile,
      address: user.address,
      mobile: user.mobile,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @DESCRIPTION Get currently logged in user's profile
// @ROUTE       GET /api/users/profile
// @ACCESS      Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @DESCRIPTION Gets all users
// @ROUTE       GET /api/users
// @ACCESS      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    message: "All users details sent",
    users,
  });
});

// @DESCRIPTION Get User by ID
// @ROUTE       GET /api/users/:id
// @ACCESS      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // Exclude password from response

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Send reset password OTP Email
// @ROUTE       POST /api/users/sendresetpasswordemail
// @ACCESS      Private
const sendResetPasswordOTPEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const mode = "OTP";
  const expiry = process.env.EMAIL_EXPIRY;

  const findToken = await EmailVerifyToken.findOne({
    userId: user._id,
  });

  if (findToken) {
    await EmailVerifyToken.deleteOne({ userId: user._id });
  }

  try {
    user.resetSession = false;
    await user.save();

    await sendEmail(user, mode);
    res.status(201).json({ verificationEmail: user.email, expiry: Number(expiry) });
  } catch (err) {
    res.status(500);
    throw new Error("Failed to send reset password email. Please try again later.");
  }
});

// @DESCRIPTION Verify reset password OTP
// @ROUTE       GET /api/users/verifyresetpasswordotp
// @ACCESS      Private
const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, OTP } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const findToken = await EmailVerifyToken.findOne({
    userId: user._id,
  });

  if (!findToken) {
    res.status(400);
    throw new Error("OTP expired or invalid. Please request a new one.");
  }

  // Match OTP with EmailVerify token
  const OTPVerified = await findToken.matchToken(OTP);

  if (!OTPVerified) {
    res.status(400);
    throw new Error("The entered OTP code is invalid");
  }

  try {
    await EmailVerifyToken.deleteOne({ userId: user._id }); // Delete token after successful verification
    user.resetSession = true; // Mark session as ready for password change
    await user.save();

    res.status(200).json({
      message: "OTP Confirmed. You can now reset your password.",
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`OTP Deleted, Verification: ${OTPVerified}`);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "OTP verification failed due to a server error.");
  }
});

// @DESCRIPTION Updates logged in user's Profile
// @ROUTE       PUT /api/users/profile
// @ACCESS      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // --- Password Reset Flow ---
    if (user.resetSession) {
      if (!req.body.password) {
        res.status(400);
        throw new Error("Password can not be empty");
      }

      if (await user.matchPassword(req.body.password)) {
        res.status(400);
        throw new Error("Can not use old password");
      }

      user.password = req.body.password;
      user.resetSession = false;

      const updatedUser = await user.save();

      // Log user activity for password change
      await logUserActivity({
        user: updatedUser._id,
        action: "password_changed",
        performedBy: updatedUser._id,
        description: `${updatedUser.firstName} ${updatedUser.lastName} changed their password`,
      });

      res.status(200).json({
        message: "Password updated successfully.",
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        emailVerified: updatedUser.emailVerified,
        resetSession: updatedUser.resetSession,
        username: updatedUser.username,
        profile: updatedUser.profile,
        address: updatedUser.address,
        mobile: updatedUser.mobile,
      });
    }
    // --- General Profile Update Flow ---
    else {
      const oldProfilePath = user.profile;

      // Track which profile fields were changed
      const changedFields = [];

      if (req.body.firstName !== undefined && req.body.firstName !== user.firstName) {
        changedFields.push("first name");
      }

      if (req.body.lastName !== undefined && req.body.lastName !== user.lastName) {
        changedFields.push("last name");
      }

      if (req.body.email !== undefined && req.body.email !== user.email) {
        changedFields.push("email");
      }

      if (req.body.username !== undefined && req.body.username !== user.username) {
        changedFields.push("username");
      }

      if (req.body.address !== undefined && req.body.address !== user.address) {
        changedFields.push("address");
      }

      if (req.body.mobile !== undefined && Number(req.body.mobile) !== Number(user.mobile)) {
        changedFields.push("phone number");
      }

      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      user.profile = req.body.profile || user.profile;
      user.address = req.body.address || user.address;
      user.mobile = req.body.mobile || user.mobile;

      // Profile image update logic: Now checks req.file (from Multer)
      if (req.file) {
        // If a new file was uploaded by Multer
        const newProfilePath = "/uploads/profiles/" + req.file.filename;

        if (newProfilePath !== oldProfilePath) {
          user.profile = newProfilePath;
          removeOldProfileImage(oldProfilePath);
        }
      } else if (req.body.profile === null) {
        // Handle case where frontend explicitly sends null to clear profile (Delete profile picture)
        user.profile = PLACEHOLDER_PROFILE_IMAGE;
        removeOldProfileImage(oldProfilePath);
      }

      const updatedUser = await user.save();

      // Log profile picture activity separately
      if (req.file || req.body.profile === null) {
        await logUserActivity({
          user: updatedUser._id,
          action: "profile_picture_updated",
          performedBy: updatedUser._id,
          description: `${updatedUser.firstName} ${updatedUser.lastName} updated their profile picture`,
        });
      }

      // Log specific profile field changes
      if (changedFields.length > 0) {
        const description =
          changedFields.length === 1
            ? `${updatedUser.firstName} ${updatedUser.lastName} updated their ${changedFields[0]}`
            : `${updatedUser.firstName} ${updatedUser.lastName} updated their ${changedFields
                .slice(0, -1)
                .join(", ")} and ${changedFields[changedFields.length - 1]}`;

        await logUserActivity({
          user: updatedUser._id,
          action: "profile_updated",
          performedBy: updatedUser._id,
          description,
        });
      }

      res.status(200).json({
        _id: updatedUser._id,
        message: "Profile updated successfully",
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
        resetSession: updatedUser.resetSession,
        username: updatedUser.username,
        profile: updatedUser.profile,
        address: updatedUser.address,
        mobile: updatedUser.mobile,
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Updates a user's Profile as ADMIN
// @ROUTE       PUT /api/users/:id
// @ACCESS      Private/Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const oldProfilePath = user.profile;

    const isAdminValue =
      req.body.isAdmin !== undefined
        ? req.body.isAdmin === "true" || req.body.isAdmin === true
        : user.isAdmin;

    const emailVerifiedValue =
      req.body.emailVerified !== undefined
        ? req.body.emailVerified === "true" || req.body.emailVerified === true
        : user.emailVerified;

    const isAdminCreatingUserValue =
      req.body.isAdminCreatingUser !== undefined
        ? req.body.isAdminCreatingUser === "true" || req.body.isAdminCreatingUser === true
        : user.isAdminCreatingUser;

    const changedFields = [];

    // Track admin status change separately
    let adminStatusChange = null;

    if (req.body.isAdmin !== undefined && isAdminValue !== user.isAdmin) {
      adminStatusChange = isAdminValue
        ? `${req.user.firstName} ${req.user.lastName} made ${user.firstName} ${user.lastName} an admin user`
        : `${req.user.firstName} ${req.user.lastName} made ${user.firstName} ${user.lastName} a regular user`;
    }

    // Track other changed fields
    if (req.body.firstName !== undefined && req.body.firstName !== user.firstName) {
      changedFields.push("first name");
    }

    if (req.body.lastName !== undefined && req.body.lastName !== user.lastName) {
      changedFields.push("last name");
    }

    if (req.body.email !== undefined && req.body.email !== user.email) {
      changedFields.push("email");
    }

    if (req.body.emailVerified !== undefined && emailVerifiedValue !== user.emailVerified) {
      changedFields.push("email verification");
    }

    if (
      req.body.isAdminCreatingUser !== undefined &&
      req.body.isAdminCreatingUser !== user.isAdminCreatingUser
    ) {
      changedFields.push("registration source");
    }

    if (req.body.username !== undefined && req.body.username !== user.username) {
      changedFields.push("username");
    }

    if (req.body.address !== undefined && req.body.address !== user.address) {
      changedFields.push("address");
    }

    if (req.body.mobile !== undefined && Number(req.body.mobile) !== Number(user.mobile)) {
      changedFields.push("phone number");
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.emailVerified = emailVerifiedValue;
    user.isAdminCreatingUser = isAdminCreatingUserValue;
    user.isAdmin = isAdminValue;
    user.username = req.body.username || user.username;
    user.profile = req.body.profile || user.profile;
    user.address = req.body.address || user.address;
    user.mobile = req.body.mobile || user.mobile;

    // Profile image update logic: Now checks req.file (from Multer)
    if (req.file) {
      // If a new file was uploaded by Multer
      const newProfilePath = "/uploads/profiles/" + req.file.filename;

      if (newProfilePath !== oldProfilePath) {
        user.profile = newProfilePath;
        removeOldProfileImage(oldProfilePath);
      }
    } else if (req.body.profile === null) {
      // Handle case where frontend explicitly sends null to clear profile (Delete profile picture)
      user.profile = PLACEHOLDER_PROFILE_IMAGE;
      removeOldProfileImage(oldProfilePath);
    }

    const updatedUser = await user.save();

    // Log profile picture update separately
    if (req.file || req.body.profile === null) {
      await logUserActivity({
        user: updatedUser._id,
        action: "profile_picture_updated",
        performedBy: req.user._id,
        description: `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s profile picture`,
      });
    }

    // Log admin status change separately
    if (adminStatusChange) {
      await logUserActivity({
        user: updatedUser._id,
        action: "admin_updated",
        performedBy: req.user._id,
        description: adminStatusChange,
      });
    }

    // Log other specific admin profile field changes
    if (changedFields.length > 0) {
      const description =
        changedFields.length === 1
          ? `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s ${changedFields[0]}`
          : `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s ${changedFields
              .slice(0, -1)
              .join(", ")} and ${changedFields[changedFields.length - 1]}`;

      await logUserActivity({
        user: updatedUser._id,
        action: "admin_updated",
        performedBy: req.user._id,
        description,
      });
    }

    let message;

    if (updatedUser.isAdminCreatingUser) {
      message = `${updatedUser.firstName}'s Profile Created Successfully`;
    } else {
      message = `${updatedUser.firstName}'s Profile Updated Successfully`;
    }

    res.status(200).json({
      _id: updatedUser._id,
      message,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdminCreatingUser: updatedUser.isAdminCreatingUser,
      isAdmin: updatedUser.isAdmin,
      emailVerified: user.emailVerified,
      resetSession: updatedUser.resetSession,
      username: updatedUser.username,
      profile: updatedUser.profile,
      address: updatedUser.address,
      mobile: updatedUser.mobile,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Delete user as ADMIN
// @ROUTE       DELETE /api/users/:id
// @ACCESS      Private/Admin
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // Delete their profile image from upload folder when user is deleted
    removeOldProfileImage(user.profile);

    await user.deleteOne();
    res.json({ message: `${user.firstName}'s profile deleted` });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Delete multiple users as ADMIN
// @ROUTE       DELETE /api/users
// @ACCESS      Private/Admin
const deleteUsersByAdmin = asyncHandler(async (req, res) => {
  const { userIds } = req.body; // Expect an array of IDs in the request body

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of user IDs to delete.");
  }

  // Filter out any invalid ObjectIDs to prevent database errors and ensure valid IDs are processed
  userIds = userIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

  // Find users to get their profile paths before deleting them
  const usersToDelete = await User.find({ _id: { $in: userIds } }).select("profile");

  // Delete profile images from upload folder for each user
  usersToDelete.forEach((user) => {
    removeOldProfileImage(user.profile);
  });

  const deleteResult = await User.deleteMany({ _id: { $in: userIds } });

  if (deleteResult.deletedCount > 0) {
    res.json({ message: `${deleteResult.deletedCount} users deleted successfully` });
  } else {
    res.status(404);
    throw new Error("No users found or have already been deleted.");
  }
});

// @DESCRIPTION Logout currently logged in user
// @ROUTE       POST /api/users/logout
// @ACCESS      Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
});

export {
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
};
