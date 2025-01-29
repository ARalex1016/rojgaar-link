import express from "express";

const router = express.Router();

// Controller
import {
  applyJob,
  getCreatorApplications,
  getAllAppliedJobs,
  shortListApplication,
  hireApplication,
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

// All Routes
router.get("/applied", protect, authorize("candidate"), getAllAppliedJobs);

router.get("/:jobId/", protect, authorize("creator"), getCreatorApplications);

router.post("/:jobId/apply", protect, authorize("candidate"), applyJob);

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
  "/:jobId/reject",
  protect,
  authorize("creator"),
  validateJobStatus,
  rejectRemainingApplication
);

export default router;
