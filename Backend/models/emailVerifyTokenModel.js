import mongoose from "mongoose";

const emailVerifyTokenSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
    expires: 900, //15 minutes
  },
});

const EmailVerifyToken = mongoose.model("EmailVerifyToken", emailVerifyTokenSchema);

export default EmailVerifyToken;
