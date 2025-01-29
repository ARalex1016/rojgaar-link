import express from "express";

// Controller
import { getAdminMetrics } from "../Controllers/admin-metrics.controller.js";
import { protect, authorize } from "../Controllers/auth.controller.js";

const router = express.Router();

// All Routes
router.get("/", protect, authorize("admin"), getAdminMetrics);

export default router;
