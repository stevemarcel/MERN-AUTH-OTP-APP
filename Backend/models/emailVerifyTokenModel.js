import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

emailVerifyTokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    next();
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  this.token = await bcrypt.hash(this.token, salt);
});

emailVerifyTokenSchema.methods.matchToken = async function (enteredToken) {
  return await bcrypt.compare(enteredToken, this.token);
};

const EmailVerifyToken = mongoose.model("EmailVerifyToken", emailVerifyTokenSchema);

export default EmailVerifyToken;
