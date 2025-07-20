import asyncHandler from "express-async-handler";
import emailSender from "../utils/emailSender.js";
import verificationEmailBody from "../utils/verificationEmailBody.js";
import EmailVerifyToken from "../models/emailVerifyTokenModel.js";
import crypto from "crypto";

const sendEmail = asyncHandler(async (user, mode) => {
  // Helper function to generate a 4-digit OTP
  async function generateOTP() {
    const randomBytes = crypto.randomBytes(4); // Generate 4 bytes of random data
    const digits = randomBytes.map((byte) => byte % 10); // Convert each byte to a digit
    const OTPCode = digits.join(""); // Concatenate digits into a string
    return OTPCode;
  }

  // Generate OTP or a random client token (hex string)
  const OTP = await generateOTP();
  const clientToken = crypto.randomBytes(32).toString("hex");

  // Create a new token after old one is deleted by controller
  // The 'token' field here will be automatically hashed by the pre('save') hook in EmailVerifyTokenModel
  await EmailVerifyToken.create({
    userId: user._id,
    token: mode === "verifyEmail" ? clientToken : OTP,
  });

  // Determine the verification content based on the mode
  let verification =
    mode === "verifyEmail"
      ? `${process.env.BASE_URL}/${user._id}/verifyemail/${clientToken}` // Use the generated clientToken for the URL
      : `${OTP}`; // For OTP, the plain OTP is sent in email (it's hashed in DB)

  // Create parameters for the email
  const userFirstName = user.firstName;
  const body = verificationEmailBody(verification, userFirstName, mode);
  const subject =
    mode === "verifyEmail"
      ? "Verify Your Email Address"
      : `Don't Wait! Reset Your ${process.env.EMAIL_USERNAME} Account Password`; // Using EMAIL_USERNAME

  // Send Email using your emailSender utility
  await emailSender(user.email, subject, body);
});

export default sendEmail;
