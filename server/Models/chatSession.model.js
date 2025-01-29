import mongoose from "mongoose";

// Models
import Chat from "./chat.model.js";

const chatSessionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { strict: true, timestamps: true }
);

chatSessionSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await Chat.deleteMany({ chatSessionId: this._id });

    next();
  } catch (error) {
    next(error);
  }
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

export default ChatSession;
