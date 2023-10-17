import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "'First Name' field cannot be empty"],
    },
    lastName: {
      type: String,
      required: [true, "'Last Name' field cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "'Email Address Name' field cannot be empty"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "'Password' field cannot be empty"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    username: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
