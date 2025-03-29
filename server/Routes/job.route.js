import express from "express";

// Controller
import {
  saveJob,
  removeJob,
  createJob,
  approveJob,
  suspendJob,
  deleteJob,
  updateJob,
  getJobById,
  getAllAppliedCandidates,
  getAppliedCandidateById,
  getAllActiveJobs,
  getAllCreatorJobs,
  getAllJobs,
  getAllSavedJobs,
  getCounters,
} from "../Controllers/job.controller.js";
import {
  protect,
  checkAuthentication,
  authorize,
} from "../Controllers/auth.controller.js";

// Middleware
import {
  userIdParamHandler,
  jobIdParamHandler,
} from "../Middleware/param.middleware.js";

import { jobCategories } from "../lib/jobCategories.js";

// Utils
import limiter from "../utils/limiter.js";

const router = express.Router();

// Param Middleware
router.param("userId", userIdParamHandler);
router.param("jobId", jobIdParamHandler);

// ALl Routes
router.get("/categories", (req, res) => {
  res.status(200).json({
    status: "success",
    data: jobCategories,
  });
});

router.get("/", protect, authorize("admin"), getAllJobs);

router.get("/active", getAllActiveJobs);

router.get("/creator-jobs", protect, authorize("creator"), getAllCreatorJobs);

router.get("/saved", protect, authorize("candidate"), getAllSavedJobs);

router.get("/counters", protect, authorize("admin", "creator"), getCounters);

router.get("/:jobId", checkAuthentication, getJobById);

router.get(
  "/:jobId/applied-candidates",
  protect,
  authorize("admin", "creator"),
  getAllAppliedCandidates
);

router.get(
  "/:jobId/:userId",
  protect,
  authorize("admin", "creator"),
  getAppliedCandidateById
);

router.post(
  "/create",
  protect,
  authorize("creator"),
  limiter(15, 5),
  createJob
);

router.patch("/:jobId", protect, authorize("creator"), updateJob);

router.post("/:jobId/save", protect, authorize("candidate"), saveJob);

router.post("/:jobId/remove", protect, authorize("candidate"), removeJob);

router.patch("/:jobId/approve", protect, authorize("admin"), approveJob);

router.patch("/:jobId/suspend", protect, authorize("admin"), suspendJob);

router.delete("/:jobId", protect, authorize("admin", "creator"), deleteJob);

export default router;
