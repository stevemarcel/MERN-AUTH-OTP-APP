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
      default: false,
    },
    isAdminCreatingUser: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    resetSession: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      unique: true,
    },
    profile: {
      type: String,
      default: "/uploads/profiles/placeholder.png",
    },
    address: {
      type: String,
      default: "1196B Awolowo Rd, Ikoyi, Lagos.",
    },
    mobile: {
      type: Number,
      default: 8011111111,
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
