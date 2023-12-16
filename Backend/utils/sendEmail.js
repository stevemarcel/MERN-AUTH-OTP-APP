import asyncHandler from "express-async-handler";
import emailSender from "../utils/emailSender.js";
import verificationEmailBody from "../utils/verificationEmailBody.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import crypto from "crypto";
// import bcrypt from "bcryptjs";

const sendEmail = asyncHandler(async (user, mode) => {
  async function generateOTP() {
    // Generate 4 bytes of random data
    const randomBytes = crypto.randomBytes(4);

    // Convert each byte to an integer between 0 and 9
    const digits = randomBytes.map((byte) => byte % 10);

    // Check for invalid OTPs (leading zeros or consecutive digits) and re-generate if needed
    while (digits[0] === 0 || digits.some((digit, i) => digit === digits[i - 1])) {
      generateOTP(); // Recursive call to re-generate
    }

    // Concatenate the digits into a string
    const OTPCode = digits.join("");

    // Hash the OTPCode with bcrypt
    // const salt = await bcrypt.genSalt(Number(process.env.SALT));
    // const hashedOTP = await bcrypt.hash(OTPCode, salt)

    // Return the OTPCode
    // return hashedOTP;
    return OTPCode;
  }

  const tokenFound = await EmailVerifyToken.findOne({ userId: user._id });
  const emailVerifyToken = !tokenFound
    ? await EmailVerifyToken.create({
        userId: user._id,
        token: mode === "verifyEmail" ? crypto.randomBytes(32).toString("hex") : generateOTP(),
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
