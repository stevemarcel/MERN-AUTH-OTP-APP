import asyncHandler from "express-async-handler";
import genToken from "../utils/genToken.js";
import User from "../models/userModels.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// @DESCRIPTION Register new user
// @ROUTE       POST /api/users
// @ACCESS      Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, isAdminCreatingUser } = req.body;

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
  });

  if (user) {
    const isAdminCreatingUser = user.isAdminCreatingUser;
    let message;

    if (isAdminCreatingUser) {
      // Admin is creating a user
      message = "Sample user generated";
      // console.log("Admin Reg");
    } else {
      // User is self-registering
      genToken(res, user._id);
      // console.log("User Reg");
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
  const verificationEmail = req.body.email;

  const findToken = await EmailVerifyToken.findOne({
    userId: user._id,
  });

  if (findToken) {
    await EmailVerifyToken.deleteOne({ userId: user._id });
  }

  if (!user.emailVerified) {
    try {
      await sendEmail(user, mode);
      res.status(201).json({ verificationEmail, expiry });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Email not sent" });
    }
  } else {
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

    const clientToken = req.params.token;

    const findToken = await EmailVerifyToken.findOne({
      userId: user._id,
    });

    // Match client Token with EmailVerify token
    const clientTokenVerified = await findToken.matchToken(clientToken);

    if (clientTokenVerified) {
      await EmailVerifyToken.deleteOne({ userId: user._id });
    }

    user.emailVerified = true;

    await user.save();

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

    // await EmailVerifyToken.deleteOne({ userId: user._id });
  } catch (error) {
    res.status(400);
    throw new Error("Email verification failed");
  }
});

// @DESCRIPTION Auth and login in existing user/set token
// @ROUTE       POST /api/users/login
// @ACCESS      Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    genToken(res, user._id);
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

// @DESCRIPTION Gets all users
// @ROUTE       GET /api/users
// @ACCESS      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    message: "All users details sent",
    users,
  });
});

// @DESCRIPTION Get User by ID
// @ROUTE       GET /api/users/:id
// @ACCESS      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

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
    res.status(201).json({ verificationEmail: user.email, expiry });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Email not sent" });
  }
});

// @DESCRIPTION Verify reset password OTP
// @ROUTE       GET /api/users/verifyresetpasswordotp
// @ACCESS      Private
const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  // try {
  const { email, OTP } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const findToken = await EmailVerifyToken.findOne({
    userId: user._id,
  });

  // Match OTP with EmailVerify token
  const OTPVerified = await findToken.matchToken(OTP);

  if (!OTPVerified) {
    res.status(400);
    throw new Error("The entered OTP code is invalid");
    // .json({ message: "The entered OTP code is invalid" });
  }
  // else {
  try {
    await EmailVerifyToken.deleteOne({ userId: user._id });
    user.resetSession = true;

    await user.save();

    res.status(200).json({
      message: "OTP Confirmed",
    });
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP Deleted, Verification: ${OTPVerified}`);
    }
    // }
  } catch (error) {
    res.status(400);
    throw new Error("OTP verification failed");
  }
});

// @DESCRIPTION Updates logged in user's Profile
// @ROUTE       PUT /api/users/profile
// @ACCESS      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.resetSession) {
      if (!req.body.password) {
        res.status(400);
        throw new Error("Password can not be empty");
      }

      if (await user.matchPassword(req.body.password)) {
        res.status(400);
        throw new Error("Can not use old password");
      }
      if (req.body.password) {
        user.password = req.body.password;
        user.resetSession = false;

        await user.save();

        res.status(200).json({
          message: "Password updated successfully",
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
      }
    } else {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
      user.profile = req.body.profile || user.profile;
      user.address = req.body.address || user.address;
      user.mobile = req.body.mobile || user.mobile;

      const updatedUser = await user.save();

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
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.emailVerified = req.body.emailVerified;
    user.isAdminCreatingUser = req.body.isAdminCreatingUser;
    user.isAdmin = req.body.isAdmin;
    user.username = req.body.username || user.username;
    user.profile = req.body.profile || user.profile;
    user.address = req.body.address || user.address;
    user.mobile = req.body.mobile || user.mobile;

    const updatedUser = await user.save();

    const isAdminCreatingUser = updatedUser.isAdminCreatingUser;
    let message;

    if (isAdminCreatingUser) {
      // Admin is creating a user
      message = `${updatedUser.firstName}'s Profile Created Successfully`;
    } else {
      // Admin is updating a user
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
    await user.deleteOne();
    // res.json({ message: "User deleted" });
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

  //TODO: May add a check here if IDs that could be malformed. (optional but good practice)
  // userIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));

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
