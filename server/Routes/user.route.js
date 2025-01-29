import express from "express";

// Controller
import {
  searchUser,
  getUserById,
  getAllUser,
  updateUserDetail,
  updateCandidateProfile,
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

router.get("/:userId", protect, authorize("admin"), getUserById);

router.get("/", protect, authorize("admin"), getAllUser);

router.patch("/user-details", protect, updateUserDetail);

router.patch(
  "/profile-details",
  protect,
  authorize("candidate"),
  updateCandidateProfile
);

router.delete("/:userId", protect, authorize("admin"), deleteUserById);

export default router;
