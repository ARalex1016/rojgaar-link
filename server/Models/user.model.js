import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "creator", "candidate"],
      default: "candidate",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "femail", "other"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
  },
  { strict: true, timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
