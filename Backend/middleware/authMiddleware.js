import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  let decoded;

  // Only JWT verification belongs inside this try/catch.
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    res.status(401);
    throw new Error("Not authorized, Invalid token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    console.error("JWT user not found:", decoded.userId);

    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  if (user.accountStatus !== "active") {
    console.error(`User ${user._id} is not active. Status: ${user.accountStatus}`);

    res.status(401);
    throw new Error("Your account is no longer active.");
  }

  req.user = user;

  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
});

export { protect, isAdmin };
