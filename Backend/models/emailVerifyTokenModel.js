import mongoose from "mongoose";

const emailVerifyTokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: process.env.EMAIL_EXPIRY * 60, //in seconds
  },
});

const EmailVerifyToken = mongoose.model("EmailVerifyToken", emailVerifyTokenSchema);

export default EmailVerifyToken;
