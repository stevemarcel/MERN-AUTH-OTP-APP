import asyncHandler from "express-async-handler";
import genToken from "../utils/genToken.js";
import User from "../models/userModels.js";

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

// @DESCRIPTION Auth and login in existing user/set token
// @ROUTE       POST /api/users/auth
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

// @DESCRIPTION Confirm Email of new user
// @ROUTE       POST /api/users/confirmEmail
// @ACCESS      Public
const confirmUserEmail = asyncHandler(async (req, res) => {
  res.json("Confirm new user's email");
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
  confirmUserEmail,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
};
