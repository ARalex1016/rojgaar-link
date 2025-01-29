import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Job Application", "Job Update", "System"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
