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
  const { firstName, lastName, email, password } = req.body;

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
  const expiry = process.env.EMAIL_EXPIRY;
  const verificationEmail = req.body.email;
  // const message = `Verification is just a click away! We've sent an email to [${email}]. Click the verification link in your email to complete your registration. This link expires in ${process.env.EMAIL_EXPIRY} minutes. Do check your email swiftly.`;

  if (!user.emailVerified) {
    // sendEmail(user, mode);

    // if (sendEmail) {
    //   res.status(201).json({
    //     message,
    //   });
    // } else {
    //   res.status(400);
    //   throw new Error("Email not sent");
    // }
    try {
      await sendEmail(user, mode); // Await the sendEmail function
      res.status(201).json({ verificationEmail, expiry });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: "Email not sent" });
    }
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

    user.emailVerified = true;

    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log("Email Verified", user.emailVerified);
    }

    res.status(200).json({
      Message: "Email verified",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
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
      Message: "Login successful",
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

// @DESCRIPTION Reset password of user after verifying OTP
// @ROUTE       GET /api/users/profile/resetpassword
// @ACCESS      Private
// const resetPassword = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user.resetSession) {
//     res.status(400);
//     throw new Error("No password reset session");
//   }

//   if (user) {
//     if (!req.body.password) {
//       res.status(400);
//       throw new Error("Password can not be empty");
//     }

//     if (req.body.password && (await user.matchPassword(req.body.password))) {
//       res.status(400);
//       throw new Error("Can not use old password");
//     } else if (req.body.password) {
//       user.password = req.body.password;

//       user.resetSession = false;

//       const updatedUser = await user.save();

//       res.status(200).json({
//         _id: updatedUser._id,
//         firstName: updatedUser.firstName,
//         lastName: updatedUser.lastName,
//         email: updatedUser.email,
//         isAdmin: user.isAdmin,
//         emailVerified: user.emailVerified,
//         resetSession: updatedUser.resetSession,
//         username: updatedUser.username,
//         profile: updatedUser.profile,
//         address: updatedUser.address,
//         mobile: updatedUser.mobile,
//       });
//     }
//   }
// });

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
      resetSession: user.resetSession,
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

// @DESCRIPTION Send reset password OTP Email
// @ROUTE       POST /api/users/sendresetpasswordemail
// @ACCESS      Private
const sendResetPasswordOTPEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const mode = "OTP";
  const Message = `Heads up! An email containing your OTP has just landed in your inbox [${user.email}]. Check it out and enter the code below to make sure it's you.The OTP expires in ${process.env.EMAIL_EXPIRY} minutes. Time is ticking!`;

  if (user) {
    sendEmail(user, mode);
    user.resetSession = true;
    res.status(201).json({
      email: user.email,
      resetSession: user.resetSession,
      Message,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @DESCRIPTION Verify reset password OTP
// @ROUTE       GET /api/users/verifyresetpasswordotp
// @ACCESS      Private
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

    user.resetSession = false;
    await user.save();

    if (findToken && matchOTP) {
      res.status(201).json({
        Message: "OTP verification successful",
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

      if (req.body.password && (await user.matchPassword(req.body.password))) {
        res.status(400);
        throw new Error("Can not use old password");
      } else if (req.body.password) {
        user.password = req.body.password;

        user.resetSession = false;

        // const updatedUser = await user.save();

        res.status(200).json({
          Message: "Password updated successfully",
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

export {
  registerUser,
  sendVerificationEmail,
  verifyUserEmail,
  loginUser,
  // resetPassword,
  getUsers,
  getUserProfile,
  sendResetPasswordOTPEmail,
  verifyResetPasswordOTP,
  updateUserProfile,
  logoutUser,
};
