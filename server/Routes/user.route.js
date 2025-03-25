import express from "express";

// Controller
import {
  searchUser,
  getUserById,
  getAllUser,
  getProfile,
  updateUserDetail,
  updateCandidateProfile,
  uploadProfilePic,
  uploadResume,
  deleteUserById,
} from "../Controllers/user.controller.js";
import { protect, authorize } from "../Controllers/auth.controller.js";

// Middleware
import { userIdParamHandler } from "../Middleware/param.middleware.js";

const router = express.Router();

// Param Middleware
router.param("userId", userIdParamHandler);

// All Routes
router.get("/search", protect, authorize("admin"), searchUser);

router.get("/profile", protect, authorize("candidate", "creator"), getProfile);

router.get("/:userId", protect, authorize("admin"), getUserById);

router.get("/", protect, authorize("admin"), getAllUser);

router.patch("/user-details", protect, updateUserDetail);

router.patch(
  "/profile-details",
  protect,
  authorize("candidate"),
  updateCandidateProfile
);

router.patch(
  "/profile-pic",
  protect,
  authorize("candidate", "creator"),
  uploadProfilePic
);

router.patch("/resume", protect, authorize("candidate"), uploadResume);

router.delete("/:userId", protect, authorize("admin"), deleteUserById);

export default router;
