import express from "express";

// Controller
import { getAdminMetrics } from "../Controllers/admin-metrics.controller.js";
import { checkAuthentication } from "../Controllers/auth.controller.js";

const router = express.Router();

// All Routes
router.get("/", checkAuthentication, getAdminMetrics);

export default router;
