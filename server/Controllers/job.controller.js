import cron from "node-cron";

// Model
import User from "../Models/user.model.js";
import Jobs from "../Models/job.model.js";
import Application from "../Models/application.model.js";
import SaveJob from "../Models/save-job.models.js";
import CandidateProfile from "../Models/candidateProfile.model.js";

// Controller
import {
  updateNewJob,
  updateJobStatus,
  updateDeletedJob,
  updateSearchAnalytics,
} from "./admin-metrics.controller.js";

// Utils
import { canViewJobDetails } from "../utils/canViewJobDetails.js";

// Cron schedule to run every day at midnight (12:00 AM)
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled cleanup for expired jobs...");

  try {
    // Find all expired jobs
    const expiredJobs = await Jobs.find({
      lastSubmissionDate: { $lte: new Date() }, // Jobs with expiration <= now
    });

    const jobIds = expiredJobs.map((job) => job._id);

    if (jobIds.length > 0) {
      // Update the status of all expired jobs to "expired"
      await Jobs.updateMany({ _id: { $in: jobIds } }, { status: "expired" });

      console.log(`Updated ${jobIds.length} expired jobs to "expired".`);
    } else {
      console.log("No expired jobs found.");
    }
  } catch (error) {
    console.error("Error during cleanup of expired jobs:", error);
  }
});

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

export const removeJob = async (req, res) => {
  const { user, job } = req;

  try {
    const existSaved = await SaveJob.findOneAndDelete({
      candidateId: user._id,
      jobId: job._id,
    });

    if (!existSaved) {
      return res.status(400).json({
        status: "fail",
        message: "Job isn't saved yet!",
      });
    }

    // Success
    res.status(201).json({
      status: "success",
      message: "Successfully removed the job",
      data: null,
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
    salary,
    location,
    companyName,
    category,
    otherCategory,
    experienceLevel,
    maximumWorkers,
    lastSubmissionDate,
  } = req.body;

  if (
    !title ||
    !description ||
    !salary ||
    !location ||
    !location.country ||
    !location.state ||
    !companyName ||
    !experienceLevel ||
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
      salary,
      companyName,
      category: category ? category[0] : null,
      otherCategory: category.includes("Others") ? otherCategory : null,
      location: {
        country: location.country,
        state: location.state,
      },
      experienceLevel,
      maximumWorkers,
      lastSubmissionDate,
      creatorId: req.user._id,
    };

    const job = await Jobs.create(jobData);

    // Update Admin Metrics
    await updateNewJob();

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

  if (job.status !== "pending" && job.status !== "suspended") {
    return res.status(400).json({
      status: "fail",
      message: "Can't approve the job",
    });
  }

  try {
    let prevStatus = job.status;

    job.status = "active";
    job.approvedBy = user._id;
    job.approvedDate = new Date();

    const updatedJob = await job.save();

    // Update Admin Metrics
    await updateJobStatus("active", prevStatus);

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
  const { job } = req;

  if (job.status === "suspended") {
    return res.status(400).json({
      status: "fail",
      message: "Job is already suspended",
    });
  }

  // if (job.status !== "active") {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "Can't suspend",
  //   });
  // }

  try {
    const prevStatus = job.status;

    job.status = "suspended";
    const updatedJob = await job.save();

    // Update Admin Metrics
    await updateJobStatus("suspended", prevStatus);

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
    let prevStatus = job.status;

    // Delete Job
    await Jobs.findByIdAndDelete(job._id);

    // Delete all Applications belong to the job
    await Application.deleteMany({ jobId: job._id });

    // Update Admin Metrics
    await updateDeletedJob(prevStatus);

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
  const { page = 1, limit = 5 } = req.query;

  const { user } = req;

  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const savedJobs = await SaveJob.find({ candidateId: user._id })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get total count of saved jobs for the user
    const totalJobs = await SaveJob.countDocuments({ candidateId: user._id });

    // Extract job IDs from savedJobs
    const jobIds = savedJobs.map((savedJob) => savedJob.jobId);

    //  Fetch all jobs in a single query
    const jobs = await Jobs.find({ _id: { $in: jobIds } })
      .select({
        description: 0,
        contactDetails: 0,
        approvedBy: 0,
        approvedDate: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .populate({
        path: "creatorId",
        select: "profilePic name",
      });

    // Create a map of job IDs to job data
    const jobMap = jobs.reduce((acc, job) => {
      acc[job._id.toString()] = job;
      return acc;
    }, {});

    // Merge Saved Jobs with their respective job details
    const combinedData = savedJobs.map((savedJob) => ({
      ...savedJob.toObject(),
      jobDate: jobMap[savedJob.jobId.toString()] || null, // Handle missing jobs gracefully
    }));

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all Saved Jobs",
      data: combinedData,
      meta: {
        totalJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalJobs / limitNumber),
        limit: limitNumber,
      },
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
    state,
    category,
    minSalary,
    maxSalary,
    experienceLevel,
    sortBy,
    page = 1,
    limit = 5,
  } = req.query;

  try {
    const query = { status: "active" };

    if (country) {
      const decodedCountry = decodeURIComponent(country.trim());
      query["location.country"] = decodedCountry;
    }

    if (state) {
      const decodedState = decodeURIComponent(country.trim());
      query["location.state"] = decodedState;
    }

    if (category) {
      const decodedCategories = decodeURIComponent(category.trim());
      const categoriesArray = decodedCategories
        .split(",")
        .map((cat) => cat.trim());

      // Include jobs with "Others" and `otherCategory`
      if (categoriesArray.includes("Others")) {
        query.$or = [
          {
            category: {
              $in: categoriesArray.filter((cat) => cat !== "Others"),
            },
          },
          { category: "Others" },
        ];
      } else {
        query.category = { $in: categoriesArray };
      }
    }

    if (minSalary) {
      query.salary = { ...query.salary, $gte: parseInt(minSalary, 10) };
    }

    if (maxSalary) {
      query.salary = { ...query.salary, $lte: parseInt(maxSalary, 10) };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
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
        .populate({
          path: "creatorId",
          select: "profilePic",
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
  const { status, page = 1, limit = 5 } = req.query;
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
  const { status, page = 1, limit = 5 } = req.query;
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
        approvedBy: 0,
        approvedDate: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .populate({
        path: "creatorId",
        select: "profilePic",
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
        totalJobs: totalCreatorJobs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCreatorJobs / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    // Eorror
    console.log("error", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getCounters = async (req, res) => {
  const { user } = req;

  try {
    // Initialize counters
    const counters = {
      pending: 0,
      active: 0,
      suspended: 0,
      filled: 0,
      expired: 0,
      totalJobs: 0,
    };

    // List of statuses
    const allStatus = ["pending", "active", "suspended", "filled", "expired"];

    // Define a base query
    const baseQuery = user.role === "creator" ? { creatorId: user._id } : {};

    // Fetch counts for all statuses concurrently
    const results = await Promise.all([
      ...allStatus.map((status) =>
        Jobs.countDocuments({ ...baseQuery, status })
      ),
      Jobs.countDocuments(baseQuery), // Fetch total jobs count
    ]);

    // Map results to counters
    allStatus.forEach((status, index) => {
      counters[status] = results[index];
    });
    counters.totalJobs = results[results.length - 1]; // Total jobs count

    // Success response
    res.status(200).json({
      status: "success",
      data: counters,
      message: "Counters fetched successfully.",
    });
  } catch (error) {
    // Error handling
    console.error("Error fetching counters:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

export const getJobById = async (req, res) => {
  const { user, isAuthenticated, job } = req;

  const isAdmin = user?.role === "admin";
  const isCreator = job?.creatorId.equals(user?._id);

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

    let toSelect = (isAdmin || isCreator) && job.creatorId && "name email";

    const creator = await User.findById(job.creatorId).select(
      `profilePic ${toSelect}`
    );

    if (!creator) {
      return res.status(404).json({
        status: "fail",
        message: "Creator ID not found!",
      });
    }

    let approver = null;
    if (isAdmin && job.approvedBy) {
      approver = await User.findById(job.approvedBy).select("name email role");

      if (!approver) {
        return res.status(404).json({
          status: "fail",
          message: "Approver ID not found!",
        });
      }
    }

    const jobDetails = {
      ...job.toObject(),
      creatorId: undefined,
      createdAt: undefined,
      creatorProfile: creator.profilePic,
      creatorDetails:
        isAdmin || isCreator
          ? {
              creatorName: creator?.name || "N/A",
              creatorEmail: creator?.email || "N/A",
              creatorId: job.creatorId || "N/A",
              createdAt: job.createdAt,
            }
          : undefined,
      approvedBy: undefined,
      approvedDate: undefined,
      approverDetails: isAdmin
        ? {
            approverName: approver?.name || "N/A",
            approverEmail: approver?.email || "N/A",
            approverRole: approver?.role || "N/A",
            approverId: job.approvedBy || "N/A",
            approvedDate: job.approvedDate || "N/A",
          }
        : undefined,
    };

    // Check if candidate has applied or saved the job
    if (user?.role === "candidate") {
      const hasApplied = await Application.findOne({
        candidateId: user._id,
        jobId: job._id,
      });

      const hasSaved = await SaveJob.findOne({
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

    // Applied User Details Counters
    if (job.status === "active" && (isCreator || isAdmin)) {
      let statuses = ["pending", "shortlisted", "hired", "rejected"];

      const applications = await Promise.all(
        statuses.map((status) =>
          Application.countDocuments({
            jobId: job._id,
            ...(status !== "pending" && { status }),
          })
        )
      );

      const applicationDetails = {
        totalApplications: await Application.countDocuments({ jobId: job._id }),
        pending: applications[0],
        shortlisted: applications[1],
        hired: applications[2],
        rejected: applications[3],
      };

      jobDetails["applicationDetails"] = applicationDetails;
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

export const getAllAppliedCandidates = async (req, res) => {
  const { user, job } = req;
  const { status, page = 1, limit = 5 } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const isAdmin = user?.role === "admin";
  const isCreator = job?.creatorId.equals(user?._id);

  const jobId = job._id;

  try {
    if (!isAdmin && !isCreator) {
      return res.status(400).json({
        status: "fail",
        message: "You are not authorized to perform this action!",
      });
    }

    // Fetch applications and candidates in parallel
    const applications = await Application.find({ jobId, ...query })
      .select("candidateId jobId profileSnapshot createdAt status")
      .populate("candidateId", "name email profilePic") // Populate candidate details
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalUsers = await Application.countDocuments({ jobId, ...query });

    const appliedUsers = applications.map((application) =>
      application.toObject()
    );

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved data",
      data: appliedUsers,
      meta: {
        totalData: totalUsers,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
