import cron from "node-cron";

// Models
import ChatSession from "../Models/chatSession.model.js";
import Chat from "../Models/chat.model.js";

// Cron schedule
cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled cleanup for expired chat sessions...");

  try {
    // Find all expired chat sessions
    const expiredSessions = await ChatSession.find({
      expiresAt: { $lte: new Date() }, // Sessions with expiration <= now
    });

    const sessionIds = expiredSessions.map((session) => session._id);

    if (sessionIds.length > 0) {
      // Delete all chats associated with expired sessions
      await Chat.deleteMany({ chatSessionId: { $in: sessionIds } });

      // Optionally delete the expired chat sessions themselves
      await ChatSession.deleteMany({ _id: { $in: sessionIds } });

      console.log(
        `Deleted ${sessionIds.length} expired chat sessions and their associated chats.`
      );
    } else {
      console.log("No expired chat sessions found.");
    }
  } catch (error) {
    console.error("Error during cleanup of expired chat sessions:", error);
  }
});

// All Controller functiojns
export const getMessages = async (req, res) => {
  const { user, targetUser } = req;

  try {
    const messages = await Chat.find({
      $or: [
        { sender: user._id, receiver: targetUser._id },
        { sender: targetUser._id, receiver: user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .select("sender receiver message isRead createdAt");

    if (messages.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No messages found",
      });
    }

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all messages",
      data: messages,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const newChatSession = async (req, res) => {
  const { user, targetUser } = req;

  try {
    const existingSession = await ChatSession.findOne({
      adminId: user._id,
      userId: targetUser._id,
    });

    if (existingSession) {
      return res.status(400).json({
        status: "fail",
        message: "Chat session already exists!",
      });
    }

    // New Sesson
    await ChatSession.create({
      adminId: user._id,
      userId: targetUser._id,
    });

    // Success
    res.status(201).json({
      status: "success",
      message: `Successfully created chat session between admin and ${
        targetUser.name || "user"
      }`,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  const { user, targetUser } = req;
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      status: "fail",
      message: "Message content cannot be empty.",
    });
  }

  let adminId, userId;
  if (user.role === "admin") {
    adminId = user._id;
    userId = targetUser._id;
  } else {
    userId = user._id;
    adminId = targetUser._id;
  }

  try {
    const existingSession = await ChatSession.findOne({
      adminId,
      userId,
    });

    if (!existingSession) {
      return res.status(404).json({
        status: "fail",
        message: "Chat session not found, chat is not allowed",
      });
    }

    // Send Message
    const newMessage = await Chat.create({
      sender: user._id,
      receiver: targetUser._id,
      chatSessionId: existingSession._id,
      message,
    });

    // Success
    res.status(201).json({
      status: "success",
      message: "Message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    // Success
    res.status().json({
      status: "success",
      message: "",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const disableChatSession = async (req, res) => {
  const { user, targetUser } = req;

  try {
    const chatSession = await ChatSession.findOne({
      adminId: user._id,
      userId: targetUser._id,
    });

    if (!chatSession) {
      return res.status(404).json({
        status: "fail",
        message: "Chat session not found",
      });
    }

    await chatSession.deleteOne();

    // Success
    res.status(200).json({
      status: "success",
      message: "Chat session deleted successfully",
      chatSession,
    });
  } catch (error) {
    // Error
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
