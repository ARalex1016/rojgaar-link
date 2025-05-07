import express from "express";

// Controller
import {
  signup,
  login,
  logout,
  sendEmailWithOTP,
  verifyEmail,
  protect,
  checkAuth,
} from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-email-with-otp", protect, sendEmailWithOTP);
router.post("/verify-email", protect, verifyEmail);
router.post("/check-auth", protect, checkAuth);

export default router;
