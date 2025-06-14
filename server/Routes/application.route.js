import express from "express";

const router = express.Router();

// Controller
import {
  applyJob,
  getCreatorApplications,
  getAllAppliedJobs,
  shortListApplication,
  hireApplication,
  rejectApplication,
  rejectRemainingApplication,
} from "../Controllers/application.controller.js";
import { protect, authorize } from "../Controllers/auth.controller.js";

// Middleware
import {
  jobIdParamHandler,
  applicationIdParamHandler,
} from "../Middleware/param.middleware.js";
import { validateJobStatus } from "../Middleware/validate.middleware.js";

// Param Middleware
router.param("jobId", jobIdParamHandler);
router.param("applicationId", applicationIdParamHandler);

// Utils
import { sensitiveRateLimiter } from "../utils/limiter.js";

// All Routes
router.get("/applied", protect, authorize("candidate"), getAllAppliedJobs);

router.get("/:jobId/", protect, authorize("creator"), getCreatorApplications);

router.post(
  "/:jobId/apply",
  protect,
  sensitiveRateLimiter({ max15Minutes: 5, maxWeekly: 20 }),
  authorize("candidate"),
  applyJob
);

router.patch(
  "/:jobId/:applicationId/shortlist",
  protect,
  authorize("creator"),
  validateJobStatus,
  shortListApplication
);

router.patch(
  "/:jobId/:applicationId/hire",
  protect,
  authorize("creator"),
  validateJobStatus,
  hireApplication
);

router.patch(
  "/:jobId/:applicationId/reject",
  protect,
  authorize("creator"),
  rejectApplication
);

router.patch(
  "/:jobId/reject-all-remaiing",
  protect,
  authorize("creator"),
  validateJobStatus,
  rejectRemainingApplication
);

export default router;
