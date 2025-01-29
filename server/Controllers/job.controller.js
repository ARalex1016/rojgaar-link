// Model
import Jobs from "../Models/job.model.js";
import Application from "../Models/application.model.js";
import SaveJob from "../Models/save-job.models.js";

// Controller
import {
  updateNewJob,
  updateApproveJob,
  updateSuspendJob,
  updateDeletedJob,
  updateSearchAnalytics,
} from "./admin-metrics.controller.js";

// Utils
import { canViewJobDetails } from "../utils/canViewJobDetails.js";

export const saveJob = async (req, res) => {
  const { user, job } = req;

  try {
    const existSaved = await SaveJob.findOne({
      candidateId: user._id,
      jobId: job._id,
    });

    if (existSaved) {
      return res.status(400).json({
        status: "fail",
        message: "Already Saved the job",
      });
    }

    const saveJob = await SaveJob.create({
      candidateId: user._id,
      jobId: job._id,
    });

    // Success
    res.status(201).json({
      status: "success",
      message: "Successfully saved the job",
    });
  } catch (error) {
    // Error

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createJob = async (req, res) => {
  const {
    title,
    description,
    salaryRange,
    location,
    companyName,
    contactDetails,
    category,
    maximumWorkers,
    lastSubmissionDate,
  } = req.body;

  if (
    !title ||
    !description ||
    !location ||
    !companyName ||
    !contactDetails ||
    !category ||
    !maximumWorkers ||
    !lastSubmissionDate
  ) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required",
    });
  }

  if (new Date(lastSubmissionDate) < new Date()) {
    return res.status(400).json({
      status: "fail",
      message: "Last submission date cannot be in the past",
    });
  }

  if (maximumWorkers <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Maximum workers must be a positive number",
    });
  }

  try {
    const jobData = {
      title,
      description,
      salaryRange,
      location,
      companyName,
      contactDetails,
      category,
      maximumWorkers,
      lastSubmissionDate,
      creatorId: req.user._id,
    };

    const job = await Jobs.create(jobData);

    // Update Admin Metrics
    await updateNewJob(job);

    // Success
    res.status(201).json({
      status: "success",
      message: "Your job post has been sent to admin for approval",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const approveJob = async (req, res) => {
  const { job, user } = req;

  if (job.status === "active") {
    return res.status(400).json({
      status: "fail",
      message: "Job is already active",
    });
  }

  if (job.status !== "pending") {
    return res.status(400).json({
      status: "fail",
      message: "Can't approve the job",
    });
  }

  try {
    job.status = "active";
    job.approvedBy = user._id;
    job.approvedDate = new Date();

    const updatedJob = await job.save();

    // Update Admin Metrics
    await updateApproveJob(updatedJob);

    // Success
    res.status(200).json({
      status: "success",
      message: "Job Approved successfully!",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const suspendJob = async (req, res) => {
  const { job, user } = req;

  if (job.status === "suspended") {
    return res.status(400).json({
      status: "fail",
      message: "Job is already suspended",
    });
  }

  if (job.status !== "active") {
    return res.status(400).json({
      status: "fail",
      message: "Can't suspend",
    });
  }

  try {
    job.status = "suspended";
    const updatedJob = await job.save();

    // Update Admin Metrics
    await updateSuspendJob(updatedJob, preStatus);

    // Success
    res.status(200).json({
      status: "success",
      message: "Job Suspended successfully!",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteJob = async (req, res) => {
  const { job, user } = req;

  if (user.role === "creator") {
    if (job.creatorId.toString() !== user._id.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "You do not have permission to perform this action!",
      });
    }
  }

  try {
    let preStatus = job.status;

    // Delete Job
    await Jobs.findByIdAndDelete(job._id);

    // Delete all Applications belong to the job
    await Application.deleteMany({ jobId: job._id });

    // Update Admin Metrics
    await updateDeletedJob(preStatus);

    // TODO: delete the job, and it's applications from all (in real-time)

    // Success
    res.status(200).json({
      status: "success",
      message: "Job post deleted successfully!",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateJob = async (req, res) => {
  const { user, job } = req;

  try {
    if (job.creatorId.toString() !== user._id.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "You do not have permission to perform this action!",
      });
    }

    const updatedJob = await Jobs.findByIdAndUpdate(job._id, req.body, {
      new: true,
      runValidators: true,
    });

    // Success
    res.status(200).json({
      status: "succcess",
      message: "Job post updated successfully!",
      data: updatedJob,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllSavedJobs = async (req, res) => {
  const { user } = req;

  try {
    const savedJobs = await SaveJob.find({ candidateId: user._id });

    // Extract job IDs from savedJobs
    const jobIds = savedJobs.map((savedJob) => savedJob.jobId);

    //  Fetch all jobs in a single query
    const jobs = await Jobs.find({ _id: { $in: jobIds } }).select({
      description: 0,
      contactDetails: 0,
      approvedBy: 0,
      approvedDate: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    // Create a map of job IDs to job data
    const jobsMap = jobs.reduce((acc, job) => {
      acc[job._id.toString()] = job;
      return acc;
    }, {});

    // Merge Saved Jobs with their respective job details
    const combinedData = savedJobs.map((savedJob) => ({
      ...savedJob.toObject(),
      jobDate: jobsMap[savedJob.jobId.toString()] || null, // Handle missing jobs gracefully
    }));

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all Saved Jobs",
      data: combinedData,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllActiveJobs = async (req, res) => {
  const {
    country,
    category,
    minSalary,
    maxSalary,
    sortBy,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const query = { status: "active" };

    // TODO: Implement filter by GeoCodes (like 50 km radius)

    if (country) {
      const decodedCountry = decodeURIComponent(country.trim());
      query["location.country"] = decodedCountry;
    }

    if (category) {
      const decodedCategories = decodeURIComponent(category.trim());
      const categoriesArray = decodedCategories
        .split(",")
        .map((cat) => cat.trim());
      query.category = { $in: categoriesArray };
    }

    if (minSalary) {
      query["salaryRange.min"] = { $gte: parseInt(minSalary, 10) };
    }
    if (maxSalary && parseInt(maxSalary, 10) < 5000) {
      query["salaryRange.max"] = { $lte: parseInt(maxSalary, 10) };
    }

    let sortOption = {};

    if (sortBy === "low_to_high") {
      sortOption = { "salaryRange.min": 1 }; // Sort by salary (min) ascending
    } else if (sortBy === "high_to_low") {
      sortOption = { "salaryRange.min": -1 }; // Sort by salary (min) descending
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid page or limit value. Please provide positive integers.",
      });
    }

    const [activeJobs, totalJobs] = await Promise.all([
      Jobs.find(query)
        .select({
          description: 0,
          contactDetails: 0,
          approvedBy: 0,
          approvedDate: 0,
          createdAt: 0,
          updatedAt: 0,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sortOption),
      Jobs.countDocuments(query),
    ]);

    // Update Admin Metrics
    if (category || country) {
      await updateSearchAnalytics(category, country);
    }

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all active jobs",
      data: activeJobs,
      meta: {
        totalJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalJobs / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllJobs = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  try {
    // Build the query object
    const query = {};
    if (status) {
      query.status = status;
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const jobs = await Jobs.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total count for pagination metadata
    const totalJobs = await Jobs.countDocuments(query);

    // Success response with metadata
    res.status(200).json({
      status: "success",
      data: jobs,
      meta: {
        totalJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalJobs / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllCreatorJobs = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const { user } = req;

  try {
    const query = {};

    if (user) {
      query.creatorId = user._id;
    }

    if (status) {
      query.status = status;
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const creatorJobs = await Jobs.find(query)
      .select({
        description: 0,
        contactDetails: 0,
        approvedBy: 0,
        approvedDate: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total count for pagination metadata
    const totalCreatorJobs = await Jobs.countDocuments(query);

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all jobs",
      data: creatorJobs,
      meta: {
        totalCreatorJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCreatorJobs / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    // Eorror

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getJobById = async (req, res) => {
  const { job, isAuthenticated, user } = req;

  const isAdmin = user?.role === "admin";
  const isCreator = job.creatorId.equals(user?._id);
  try {
    const canView = await canViewJobDetails(
      job,
      user,
      isAuthenticated,
      isAdmin,
      isCreator
    );
    if (!canView) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to view the details of this job.",
      });
    }
    const jobDetails = {
      ...job.toObject(),
      contactDetails: isAuthenticated ? job.contactDetails : undefined,
      approvedBy: isAdmin ? job.approvedBy : undefined,
      approvedDate: isAdmin ? job.approvedDate : undefined,
    };

    // Check if is Applied or Saved
    if (user?.role === "candidate") {
      const hasApplied = await Application.find({
        candidateId: user._id,
        jobId: job._id,
      });

      const hasSaved = await SaveJob.find({
        candidateId: user._id,
        jobId: job._id,
      });

      if (hasApplied) {
        jobDetails.hasApplied = true;
      }

      if (hasSaved) {
        jobDetails.hasSaved = true;
      }
    }
    // Success
    res.status(200).json({
      status: "success",
      data: jobDetails,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
