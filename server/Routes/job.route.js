import express from "express";
import rateLimit from "express-rate-limit";

// Controller
import {
  saveJob,
  createJob,
  approveJob,
  suspendJob,
  deleteJob,
  updateJob,
  getJobById,
  getAllActiveJobs,
  getAllCreatorJobs,
  getAllJobs,
  getAllSavedJobs,
} from "../Controllers/job.controller.js";
import {
  protect,
  checkAuthentication,
  authorize,
} from "../Controllers/auth.controller.js";

// Middleware
import { jobIdParamHandler } from "../Middleware/param.middleware.js";

import { jobCategories } from "../lib/jobCategories.js";

// Utils
import limiter from "../utils/limiter.js";

const router = express.Router();

// Param Middleware
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

router.get("/:jobId", checkAuthentication, getJobById);

router.post(
  "/create",
  protect,
  authorize("creator"),
  limiter(15, 5),
  createJob
);

router.patch("/:jobId", protect, authorize("creator"), updateJob);

router.post("/:jobId/save", protect, authorize("candidate"), saveJob);

router.patch("/:jobId/approve", protect, authorize("admin"), approveJob);

router.patch("/:jobId/suspend", protect, authorize("admin"), suspendJob);

router.delete("/:jobId", protect, authorize("admin", "creator"), deleteJob);

export default router;
