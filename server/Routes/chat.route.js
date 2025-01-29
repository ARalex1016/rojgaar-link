import express from "express";

const router = express.Router();

// Controller
import {
  getMessages,
  newChatSession,
  disableChatSession,
  sendMessage,
} from "../Controllers/chat.controller.js";

// Middleware
import { protect, authorize } from "../Controllers/auth.controller.js";
import { userIdParamHandler } from "../Middleware/param.middleware.js";

// Param
router.param("userId", userIdParamHandler);

// All Routes
router.get("/:userId", protect, getMessages);

router.post("/:userId", protect, authorize("admin"), newChatSession);

router.post("/:userId/send-message", protect, sendMessage);

router.delete("/:userId", protect, authorize("admin"), disableChatSession);

export default router;
