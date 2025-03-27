// Models
import Application from "../Models/application.model.js";
import CandidateProfile from "../Models/candidateProfile.model.js";
import Jobs from "../Models/job.model.js";

export const applyJob = async (req, res) => {
  const { user, job } = req;

  try {
    const alreadyApplied = await Application.findOne({
      candidateId: user._id,
      jobId: job._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({
        status: "fail",
        message: "You have already Applied in this job",
      });
    }
    // Get candidate profile
    const candidateProfile = await CandidateProfile.findOne({
      userId: user._id,
    }).select("-userId -appliedJobs -createdAt -updatedAt");

    if (!candidateProfile.eligible) {
      return res.status(400).json({
        status: "fail",
        message: "You are not Eligible to apply for job yet!",
      });
    }
    // Apply for job
    const application = await Application.create({
      candidateId: user._id,
      jobId: job._id,
      profileSnapshot: candidateProfile,
    });
    // TODO: Add applicants to creator (in real-time)

    // Success
    res.status(201).json({
      status: "success",
      message: "Successfully Applied for job",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllAppliedJobs = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const { user } = req;

  try {
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

    const appliedApplications = await Application.find({
      candidateId: user._id,
    })
      .select("jobId status createdAt")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalJobs = await Application.countDocuments({
      candidateId: user._id,
    });

    // Extract job IDs from applications
    const jobIds = appliedApplications.map((application) => application.jobId);

    // Fetch all jobs in a single query
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
        select: "profilePic name", // Add other fields if needed
      });

    // Create a map of job IDs to job data
    const jobsMap = jobs.reduce((acc, job) => {
      acc[job._id.toString()] = job;
      return acc;
    }, {});

    // Merge applications with their respective job details
    const combinedData = appliedApplications.map((application) => ({
      ...application.toObject(),
      jobDate: jobsMap[application.jobId.toString()] || null, // Handle missing jobs gracefully
    }));

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all applications",
      data: combinedData,
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

export const getCreatorApplications = async (req, res) => {
  const { job } = req;

  try {
    const applications = await Application.find({ jobId: job._id });

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all applications",
      data: applications,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const shortListApplication = async (req, res) => {
  const { job, application } = req;

  try {
    if (application.jobId.toString() !== job._id.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "This application does not belong to the specified job post.",
      });
    }

    // Check if the application is rejected
    if (application.status === "rejected") {
      return res.status(400).json({
        status: "fail",
        message: "Rejected applications can't proceed to the shortlisted stage",
      });
    }

    // Check if the application is already shortlisted
    if (application.status === "shortlisted") {
      return res.status(400).json({
        status: "fail",
        message: "This application is already marked as shortlisted.",
      });
    }

    // Mark application as shortlisted
    application.status = "shortlisted";
    await application.save();

    // TODO: send notification to the applicants, that there application was shortlisted

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully shortlisted the application!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const hireApplication = async (req, res) => {
  const { job, application } = req;

  try {
    if (application.jobId.toString() !== job._id.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "This application does not belong to the specified job post.",
      });
    }

    // Check if the application is rejected
    if (application.status === "rejected") {
      return res.status(400).json({
        status: "fail",
        message: "Rejected application can't proceed to the hiring stage!",
      });
    }

    // Check if the application is already hired
    if (application.status === "hired") {
      return res.status(400).json({
        status: "fail",
        message: "This application is already marked as hired!",
      });
    }

    // Mark application as shortlisted
    application.status = "hired";
    await application.save();

    // TODO: send notification to the applicants, that there application was hired
    // TODO: update status from applicants (in real-time)

    // Add workersHired from job
    job.workersHired += 1;
    await job.save();
    // TODO: also in real-time

    // TODO: if job.maximumWorkers === job.workersHired, mark job as filled

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully hired the application!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const rejectRemainingApplication = async (req, res) => {
  const { job } = req;

  // Determine which applications to reject
  let excludeStatuses = [];
  const hiredApplications = await Application.find({
    jobId: job._id,
    status: "hired",
  });

  if (hiredApplications.length > 0) {
    // Context: After hiring
    excludeStatuses = ["hired"];
  } else {
    // Context: After shortlisting
    excludeStatuses = ["shortlisted"];
  }

  // Reject all applications not in excludeStatuses
  const result = await Application.updateMany(
    {
      jobId: job._id,
      status: { $nin: excludeStatuses }, // Reject all except specified statuses
    },
    { $set: { status: "rejected" } }
  );

  // Success
  res.status(200).json({
    status: "success",
    message: `Successfully rejected ${result.modifiedCount} application(s).`,
  });
  try {
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
