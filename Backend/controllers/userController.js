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
      Message: "User registered successfully",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
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
  const Message = `Verification is just a click away! We've sent an email to [${email}]: click the verification link in your email to complete your registration. This link expires in ${process.env.EMAIL_EXPIRY} minutes. Do check your email swiftly.`;

  if (!user.emailVerified) {
    sendEmail(user, mode);
    // const tokenFound = await EmailVerifyToken.findOne({ userId: user._id });
    // const emailVerifyToken = !tokenFound
    //   ? await EmailVerifyToken.create({
    //       userId: user._id,
    //       token: crypto.randomBytes(32).toString("hex"),
    //     })
    //   : tokenFound;

    // // const OTP = `${emailVerifyToken.token}`;
    // const url = `${process.env.BASE_URL}/api/users/${user._id}/verifyemail/${emailVerifyToken.token}`;
    // const userFirstName = user.firstName;
    // // const mode = "OTP";
    // const mode = "verifyEmail";

    // const body = verificationEmailBody(url, userFirstName, mode);

    // await emailSender(user.email, "Verify Your Email Address", body);
    // res.status(201).json({
    //   message: `A verification link has been sent to your email address which expires in ${process.env.EMAIL_EXPIRY} minutes. Please check your email immediately.`,
    // });
    res.status(201).json({
      Message,
    });
  } else {
    res.status(200).json({ Message: "Email Verified Already" });
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

    const tokenVerified = await EmailVerifyToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!tokenVerified) {
      res.status(400);
      throw new Error("Invalid Verification Link");
    }

    user.emailVerified = true || user.emailVerified;
    await user.save();

    res.status(200).json({
      Message: "Email verified",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      username: user.username,
      profile: user.profile,
      address: user.address,
      mobile: user.mobile,
    });

    await EmailVerifyToken.deleteOne({ userId: user._id });
  } catch (error) {
    res.status(400);
    throw new Error("Email verification failed");
  }
});

// @DESCRIPTION Send reset password OTP Email
// @ROUTE       POST /api/users/sendresetpasswordemail
// @ACCESS      Public
const sendResetPasswordOTPEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const mode = "OTP";
  const Message = `Heads up! An email containing your OTP has just landed in your inbox [${user.email}]. Check it out and enter the code below to make sure it's you.The OTP expires in ${process.env.EMAIL_EXPIRY} minutes. Time is ticking!`;

  if (user) {
    sendEmail(user, mode);
    res.status(201).json({
      email: user.email,
      Message,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Verify reset password OTP
// @ROUTE       GET /api/users/verifyresetpasswordotp
// @ACCESS      Public
const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  try {
    const { email, OTP } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const findToken = await EmailVerifyToken.findOne({
      userId: user._id,
    });

    const matchOTP = async (OTP) => {
      return await bcrypt.compare(OTP, findToken.token);
    };

    if (findToken && matchOTP) {
      res.status(201).json({
        Message: "OTP verification successful",
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
        username: user.username,
        profile: user.profile,
        address: user.address,
        mobile: user.mobile,
      });

      await EmailVerifyToken.deleteOne({ userId: user._id });
    } else {
      res.status(400);
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(400);
    throw new Error("OTP verification failed");
  }
});

// @DESCRIPTION Reset password of user after verifying OTP
// @ROUTE       GET /api/users/resetpassword
// @ACCESS      Public
const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
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
      Message: "Login successful",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
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
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      Message: "User details sent",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      username: user.username,
      profile: user.profile,
      address: user.address,
      mobile: user.mobile,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Gets all users
// @ROUTE       GET /api/users
// @ACCESS      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    Message: "All users details sent",
    users,
  });
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
  sendResetPasswordOTPEmail,
  verifyResetPasswordOTP,
  resetPassword,
  logoutUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
};
