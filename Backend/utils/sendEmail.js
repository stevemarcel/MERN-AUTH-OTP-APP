import asyncHandler from "express-async-handler";
import emailSender from "../utils/emailSender.js";
import verificationEmailBody from "../utils/verificationEmailBody.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const sendEmail = asyncHandler(async (user, mode) => {
  async function generateOTP() {
    // function generateOTP() {
    // Generate 4 bytes of random data
    const randomBytes = crypto.randomBytes(4);

    // Convert each byte to an integer between 0 and 9
    const digits = randomBytes.map((byte) => byte % 10);

    // Check for invalid OTPs (leading zeros or consecutive digits) and re-generate if needed
    // while (digits[0] === 0 || digits.some((digit, i) => digit === digits[i - 1])) {
    //   generateOTP(); // Recursive call to re-generate
    // }

    // Concatenate the digits into a string
    const OTPCode = digits.join("");
    // const OTPCode = parseInt(digits.join(""), 10);

    // Return the hashedOTP
    // return hashedOTP;
    return OTPCode;
  }

  //Generate OTP
  const OTP = await generateOTP();

  // Hash the generated OTP with bcrypt
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedOTP = bcrypt.hash(OTP, salt);

  const tokenFound = await EmailVerifyToken.findOne({ userId: user._id });

  const emailVerifyToken = !tokenFound
    ? await EmailVerifyToken.create({
        userId: user._id,
        token: mode === "verifyEmail" ? crypto.randomBytes(32).toString("hex") : await hashedOTP,
      })
    : tokenFound;

  let verification =
    mode === "verifyEmail"
      ? `${process.env.BASE_URL}/api/users/${user._id}/verifyemail/${emailVerifyToken.token}`
      : `${OTP}`;

  const userFirstName = user.firstName;

  const body = verificationEmailBody(verification, userFirstName, mode);

  const subject =
    mode === "verifyEmail"
      ? "Verify Your Email Address"
      : `Don't Wait! Reset Your [${process.env.EMAIL_USERNAME}] Password`;

  //Send Email
  await emailSender(user.email, subject, body);
});

export default sendEmail;
