import asyncHandler from "express-async-handler";

// Import necessary models
import User from "../models/userModels.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
// import UserActivity from "../models/userActivityModel.js";

// Import utility functions
import { PLACEHOLDER_PROFILE_IMAGE } from "../utils/fileUpload.js";
import genToken from "../utils/genToken.js";
import sendEmail from "../utils/sendEmail.js";
import logUserActivity from "../utils/userActivityLogger.js";
import {
  uploadProfileImageToCloudinary,
  deleteProfileImageFromCloudinary,
} from "../utils/cloudinaryUtils.js";

import mongoose from "mongoose";

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

    // * 1. Log user registration activity
    await logUserActivity({
      user: user._id,
      action: "registered",
      performedBy: isAdminCreatingUser ? req.user?._id : null,

      description: isAdminCreatingUser
        ? `${user.firstName} ${user.lastName} was created by`
        : `${user.firstName} ${user.lastName} registered`,

      notificationMessage: isAdminCreatingUser
        ? "Your account was created by an administrator"
        : "Your account was created",
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

    // * 2. Log user activity for email verification
    await logUserActivity({
      user: user._id,
      action: "email_verified",
      performedBy: user._id,
      description: `${user.firstName} ${user.lastName} verified their email`,
      notificationMessage: "Your email address was verified",
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

  if (user && user.accountStatus === "active" && (await user.matchPassword(password))) {
    // Generate JWT token and set as cookie
    genToken(res, user._id);

    res.status(200).json({
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
      accountStatus: user.accountStatus,
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

      // * 3. Log user activity for password change
      await logUserActivity({
        user: updatedUser._id,
        action: "password_changed",
        performedBy: updatedUser._id,
        description: `${updatedUser.firstName} ${updatedUser.lastName} changed their password`,
        notificationMessage: "Your password was changed",
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
      const oldProfilePublicId = user.profilePublicId;

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

      let newProfilePublicId = null;

      try {
        // Upload new profile image to Cloudinary
        if (req.file) {
          const uploadedImage = await uploadProfileImageToCloudinary(req.file.buffer);

          user.profile = uploadedImage.secure_url;
          user.profilePublicId = uploadedImage.public_id;

          newProfilePublicId = uploadedImage.public_id;
        }

        // Remove profile picture
        else if (req.body.profile === null) {
          user.profile = PLACEHOLDER_PROFILE_IMAGE;
          user.profilePublicId = null;
        }

        const updatedUser = await user.save();

        // Delete previous Cloudinary image only AFTER database save succeeds
        if (oldProfilePublicId && (req.file || req.body.profile === null)) {
          await deleteProfileImageFromCloudinary(oldProfilePublicId);
        }

        // * 4. Log user activity for profile picture update
        if (req.file || req.body.profile === null) {
          await logUserActivity({
            user: updatedUser._id,
            action: "profile_picture_updated",
            performedBy: updatedUser._id,
            description: `${updatedUser.firstName} ${updatedUser.lastName} updated their profile picture`,
            notificationMessage: "Your profile picture was updated",
          });
        }

        // * 5. Log user activity for other profile field updates
        if (changedFields.length > 0) {
          const description =
            changedFields.length === 1
              ? `${updatedUser.firstName} ${updatedUser.lastName} updated their ${changedFields[0]}`
              : `${updatedUser.firstName} ${updatedUser.lastName} updated their ${changedFields
                  .slice(0, -1)
                  .join(", ")} and ${changedFields[changedFields.length - 1]}`;

          const notificationMessage =
            changedFields.length === 1
              ? `Your ${changedFields[0]} was updated`
              : "Your profile information was updated";

          await logUserActivity({
            user: updatedUser._id,
            action: "profile_updated",
            performedBy: updatedUser._id,
            description,
            notificationMessage,
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
      } catch (error) {
        // Prevent orphaned Cloudinary uploads if MongoDB save fails
        if (newProfilePublicId) {
          await deleteProfileImageFromCloudinary(newProfilePublicId);
        }

        throw error;
      }
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
    // Keep the old Cloudinary public ID so we can delete the old image only after the new profile has been successfully saved.
    const oldProfilePublicId = user.profilePublicId;

    // Used to clean up a newly uploaded Cloudinary image if something fails before the database save completes.
    let newProfilePublicId = null;

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
        ? `${req.user.firstName} ${req.user.lastName} made ${user.firstName} ${user.lastName} an admin`
        : `${req.user.firstName} ${req.user.lastName} removed administrator access from ${user.firstName} ${user.lastName}`;
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
      isAdminCreatingUserValue !== user.isAdminCreatingUser
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

    // Update normal profile fields
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

    try {
      // ============================================================
      // PROFILE IMAGE HANDLING
      // ============================================================

      if (req.file) {
        // Upload new image to Cloudinary
        const uploadedImage = await uploadProfileImageToCloudinary(req.file.buffer);

        // Store permanent Cloudinary URL in MongoDB
        user.profile = uploadedImage.secure_url;

        // Store Cloudinary public_id for future deletion
        user.profilePublicId = uploadedImage.public_id;

        // Keep this in case the database save fails
        newProfilePublicId = uploadedImage.public_id;
      } else if (req.body.profile === null) {
        // User/admin explicitly removed the profile picture
        user.profile = PLACEHOLDER_PROFILE_IMAGE;
        user.profilePublicId = null;
      }

      // ============================================================
      // SAVE USER
      // ============================================================

      const updatedUser = await user.save();

      // ============================================================
      // DELETE OLD CLOUDINARY IMAGE
      // ============================================================
      // This happens ONLY after the new database state has been saved.
      // Existing legacy users will normally have profilePublicId = null, so nothing will be deleted for their old /uploads/... image.
      if (oldProfilePublicId && (req.file || req.body.profile === null)) {
        await deleteProfileImageFromCloudinary(oldProfilePublicId);
      }

      // * 6. Log user activity for profile picture update by ADMIN
      if (req.file || req.body.profile === null) {
        await logUserActivity({
          user: updatedUser._id,
          action: "profile_picture_updated",
          performedBy: req.user._id,
          description: `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s profile picture`,
          notificationMessage: `${req.user.firstName} ${req.user.lastName} updated your profile picture`,
        });
      }

      // * 7. Log user activity for admin status change made by ADMIN
      if (adminStatusChange) {
        await logUserActivity({
          user: updatedUser._id,
          action: "admin_updated",
          performedBy: req.user._id,
          description: adminStatusChange,
          notificationMessage: isAdminValue
            ? `${req.user.firstName} ${req.user.lastName} made you an admin`
            : `${req.user.firstName} ${req.user.lastName} removed your administrator access`,
        });
      }

      // * 8. Log user activity for other profile field updates made by ADMIN
      if (changedFields.length > 0) {
        const description =
          changedFields.length === 1
            ? `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s ${changedFields[0]}`
            : `${req.user.firstName} ${req.user.lastName} updated ${updatedUser.firstName} ${updatedUser.lastName}'s ${changedFields
                .slice(0, -1)
                .join(", ")} and ${changedFields[changedFields.length - 1]}`;

        const notificationMessage =
          changedFields.length === 1
            ? `${req.user.firstName} ${req.user.lastName} updated your ${changedFields[0]}`
            : `${req.user.firstName} ${req.user.lastName} updated your profile information`;

        await logUserActivity({
          user: updatedUser._id,
          action: "admin_updated",
          performedBy: req.user._id,
          description,
          notificationMessage,
        });
      }

      // RESPONSE MESSAGE
      let message;

      if (updatedUser.isAdminCreatingUser) {
        message = `${updatedUser.firstName}'s Profile Created Successfully`;
      } else {
        message = `${updatedUser.firstName}'s Profile Updated Successfully`;
      }

      // RESPONSE
      res.status(200).json({
        _id: updatedUser._id,
        message,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdminCreatingUser: updatedUser.isAdminCreatingUser,
        isAdmin: updatedUser.isAdmin,
        emailVerified: updatedUser.emailVerified,
        resetSession: updatedUser.resetSession,
        username: updatedUser.username,
        profile: updatedUser.profile,
        address: updatedUser.address,
        mobile: updatedUser.mobile,
      });
    } catch (error) {
      // =========================================================================================================
      // CLEAN UP NEW CLOUDINARY IMAGE IF DATABASE SAVE/PROCESSING FAILS AFTER THE IMAGE HAS ALREADY BEEN UPLOADED
      // =========================================================================================================
      if (newProfilePublicId) {
        await deleteProfileImageFromCloudinary(newProfilePublicId);
      }

      throw error;
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Remove Single User as ADMIN
// @ROUTE       DELETE /api/users/:id
// @ACCESS      Private/Admin
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  if (String(req.user._id) === String(id)) {
    res.status(400);
    throw new Error("You cannot remove your own account.");
  }

  const session = await mongoose.startSession();

  try {
    let removedUser;

    await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.accountStatus === "removed") {
        throw new Error("User has already been removed.");
      }

      user.accountStatus = "removed";
      user.removedAt = new Date();
      user.removedBy = req.user._id;
      user.removalReason = "Removed by administrator";

      // Ensure an abandoned password-reset session cannot be reused.
      user.resetSession = false;

      removedUser = await user.save({ session });

      // Invalidate any outstanding email/OTP token.
      await EmailVerifyToken.deleteMany(
        {
          userId: user._id,
        },
        { session },
      );

      // * 9. Log user activity for single account removal by ADMIN
      await logUserActivity({
        user: user._id,
        action: "removed",
        performedBy: req.user._id,
        description: `${req.user.firstName} ${req.user.lastName} removed ${user.firstName} ${user.lastName} from the system`,
        notify: false,
        session,
      });
    });

    res.status(200).json({
      message: `${removedUser.firstName} ${removedUser.lastName} was removed from the system`,

      user: {
        _id: removedUser._id,
        firstName: removedUser.firstName,
        lastName: removedUser.lastName,
        accountStatus: removedUser.accountStatus,
        removedAt: removedUser.removedAt,
      },
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Remove multiple users as ADMIN
// @ROUTE       DELETE /api/users
// @ACCESS      Private/Admin
const deleteUsersByAdmin = asyncHandler(async (req, res) => {
  let { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of user IDs to remove.");
  }

  userIds = [...new Set(userIds.filter((id) => mongoose.Types.ObjectId.isValid(id)))];

  // An administrator can not remove themselves through bulk selection.
  userIds = userIds.filter((id) => String(id) !== String(req.user._id));

  if (userIds.length === 0) {
    res.status(400);
    throw new Error("No valid users were selected for removal.");
  }

  const session = await mongoose.startSession();

  try {
    let removedCount = 0;

    await session.withTransaction(async () => {
      const users = await User.find({
        _id: {
          $in: userIds,
        },

        accountStatus: "active",
      }).session(session);

      for (const user of users) {
        user.accountStatus = "removed";
        user.removedAt = new Date();
        user.removedBy = req.user._id;
        user.removalReason = "Removed by administrator";
        user.resetSession = false;

        await user.save({
          session,
        });

        await EmailVerifyToken.deleteMany(
          {
            userId: user._id,
          },
          { session },
        );

        // * 10. Log user activity for bulk account removal by ADMIN
        await logUserActivity({
          user: user._id,
          action: "removed",
          performedBy: req.user._id,
          description: `${req.user.firstName} ${req.user.lastName} removed ${user.firstName} ${user.lastName} from the system`,
          notify: false,
          session,
        });

        removedCount += 1;
      }
    });

    if (removedCount === 0) {
      res.status(404);
      throw new Error("No active users were found for removal.");
    }

    res.status(200).json({
      message: `${removedCount} user${
        removedCount === 1 ? "" : "s"
      } removed from the system successfully`,

      removedCount,
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Restore a removed user
// @ROUTE       PATCH /api/users/:id/restore
// @ACCESS      Private/Admin
const restoreUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  const session = await mongoose.startSession();

  try {
    let restoredUser;

    await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.accountStatus === "active") {
        throw new Error("User is already active.");
      }

      user.accountStatus = "active";
      user.removedAt = null;
      user.removedBy = null;
      user.removalReason = "";

      restoredUser = await user.save({
        session,
      });

      // * 11. Log user activity for account restoration by ADMIN
      await logUserActivity({
        user: restoredUser._id,
        action: "restored",
        performedBy: req.user._id,
        description: `${req.user.firstName} ${req.user.lastName} restored ${restoredUser.firstName} ${restoredUser.lastName}'s account`,
        notificationMessage: `${req.user.firstName} ${req.user.lastName} restored your account`,
        session,
      });
    });

    res.status(200).json({
      message: `${restoredUser.firstName} ${restoredUser.lastName}'s account was restored`,

      user: {
        _id: restoredUser._id,
        firstName: restoredUser.firstName,
        lastName: restoredUser.lastName,
        email: restoredUser.email,
        accountStatus: restoredUser.accountStatus,
      },
    });
  } finally {
    await session.endSession();
  }
});

// @DESCRIPTION Permanently delete user
// @ROUTE       DELETE /api/users/:id/permanent
// @ACCESS      Private/Admin
const permanentlyDeleteUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  if (String(req.user._id) === String(id)) {
    res.status(400);
    throw new Error("You cannot permanently delete your own account.");
  }

  const session = await mongoose.startSession();

  try {
    let user;

    await session.withTransaction(async () => {
      user = await User.findById(id).session(session);

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.accountStatus !== "removed") {
        throw new Error("Only removed users can be permanently deleted.");
      }

      await EmailVerifyToken.deleteMany(
        {
          userId: user._id,
        },
        { session },
      );

      await Notification.deleteMany(
        {
          recipient: user._id,
        },
        { session },
      );

      // Remove activity records where this user
      // is the subject of the user activity history.
      await UserActivity.deleteMany(
        {
          user: user._id,
        },
        { session },
      );

      await user.deleteOne({
        session,
      });
    });

    // Cloudinary deletion occurs only after MongoDB
    // permanently removes the account successfully.
    if (user?.profilePublicId) {
      await deleteProfileImageFromCloudinary(user.profilePublicId);
    }

    res.status(200).json({
      message: `${user.firstName} ${user.lastName} was permanently deleted`,
    });
  } finally {
    await session.endSession();
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
  permanentlyDeleteUserByAdmin,
  restoreUserByAdmin,
  logoutUser,
};
