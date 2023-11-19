import asyncHandler from "express-async-handler";
import genToken from "../utils/genToken.js";
import sendEmail from "../utils/sendEmail.js";
import verificationEmailBody from "../utils/verificationEmailBody.js";
import User from "../models/userModels.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import crypto from "crypto";

// @DESCRIPTION Register new user
// @ROUTE       POST /api/users
// @ACCESS      Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, profile, username } = req.body;

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
    profile,
    username,
  });

  if (user) {
    genToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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

// @DESCRIPTION Send verification Email with link
// @ROUTE       POST /api/users/sendverificationemail
// @ACCESS      Public
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user.emailVerified) {
    const tokenFound = await EmailVerifyToken.findOne({ userId: user._id });
    const emailVerifyToken = !tokenFound
      ? await EmailVerifyToken.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        })
      : tokenFound;

    // const url = "5678";
    const url = `${process.env.BASE_URL}/api/users/${user._id}/verifyemail/${emailVerifyToken.token}`;
    const userFirstName = user.firstName;
    // const mode = "OTP";
    const mode = "verifyEmail";

    const body = verificationEmailBody(url, userFirstName, mode);

    await sendEmail(user.email, "Verify Your Email Address", body);
    res.status(201).json({
      message: `A verification link has been sent to your email address which expires in ${process.env.EMAIL_EXPIRY} minutes. Please verify immediately.`,
    });
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

    const findToken = await EmailVerifyToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!findToken) {
      res.status(400);
      throw new Error("Invalid Verification Link");
    }

    user.emailVerified = true || user.emailVerified;
    await user.save();

    res.status(200).json({
      message: "Email verified",
    });

    await EmailVerifyToken.deleteOne({ userId: user._id });
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
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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

// @DESCRIPTION Logout currently logged in user
// @ROUTE       POST /api/users/logout
// @ACCESS      Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ Message: "User Logged Out" });
});

// @DESCRIPTION Gets logged in user's Profile
// @ROUTE       GET /api/users/profile
// @ACCESS      Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    username: req.user.username,
    profile: req.user.profile,
    address: req.user.address,
    mobile: req.user.mobile,
  };
  res.status(200).json({ user });
});

// @DESCRIPTION Gets all users
// @ROUTE       GET /api/users
// @ACCESS      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
});

// @DESCRIPTION Updates logged in user's Profile
// @ROUTE       PUT /api/users/profile
// @ACCESS      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.profile = req.body.profile || user.profile;
    user.address = req.body.address || user.address;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password && (await user.matchPassword(req.body.password))) {
      res.status(400);
      throw new Error("Can not use old password");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
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

export {
  loginUser,
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
};
