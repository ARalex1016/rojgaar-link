import mongoose from "mongoose";

// Models
import User from "../Models/user.model.js";
import Jobs from "../Models/job.model.js";
import Application from "../Models/application.model.js";

export const userIdParamHandler = async (req, res, next, userId) => {
  try {
    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    req.targetUser = user;

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const jobIdParamHandler = async (req, res, next, jobId) => {
  try {
    // Validate if jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid job ID format",
      });
    }

    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        status: "fail",
        message: "Job not found",
      });
    }

    req.job = job;

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const applicationIdParamHandler = async (
  req,
  res,
  next,
  applicationId
) => {
  try {
    // Validate if applicationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid application ID format",
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        status: "fail",
        message: "Application not found",
      });
    }

    req.application = application;

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
