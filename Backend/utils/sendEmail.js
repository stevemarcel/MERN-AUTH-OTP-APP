import asyncHandler from "express-async-handler";
import emailSender from "../utils/emailSender.js";
import verificationEmailBody from "../utils/verificationEmailBody.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import crypto from "crypto";

const sendEmail = asyncHandler(async (user, mode) => {
  const tokenFound = await EmailVerifyToken.findOne({ userId: user._id });
  const emailVerifyToken = !tokenFound
    ? await EmailVerifyToken.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      })
    : tokenFound;

  let verification =
    mode === "verifyEmail"
      ? `${process.env.BASE_URL}/api/users/${user._id}/verifyemail/${emailVerifyToken.token}`
      : `${emailVerifyToken.token}`;
  const userFirstName = user.firstName;

  const body = verificationEmailBody(verification, userFirstName, mode);
  await emailSender(user.email, "Verify Your Email Address", body);
});

export default sendEmail;
