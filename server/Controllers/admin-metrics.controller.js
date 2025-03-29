// Models
import AdminMetrics from "../Models/admin-metric.model.js";

export const initializeAdminMetrics = async () => {
  const metrics = await AdminMetrics.findOne();
  console.log(metrics);

  // If no document exists, create it with default values
  if (!metrics) {
    await AdminMetrics.create({
      totalUsers: 0,
      totalCreators: 0,
      jobListings: { totalJobListings: 0, active: 0, pending: 0, suspended: 0 },
      totalDonations: 0,
      searchAnalytics: { jobCategories: {}, countries: {} },
    });
  }
};

export const getAdminMetrics = async (req, res) => {
  try {
    const adminMetrics = await AdminMetrics.findOne();

    if (!adminMetrics) {
      return res.status(404).json({
        status: "fail",
        message: "No metrics document found.",
      });
    }

    // Success
    res.status(200).json({
      status: "success",
      messgae: "Admin Metrics retrieved succcessfully!",
      data: adminMetrics,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateNewUser = async (role) => {
  try {
    await AdminMetrics.updateOne({}, { $inc: { [`users.${role}`]: 1 } });

    // TODO: New user (in real-time)
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateNewJob = async () => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: {
          "jobListings.totalJobListings": 1,
          "jobListings.pending": 1,
        },
      }
    );

    // TODO: the real-time addition of a new request qpproval jobs queue for admin
    // TODO: New job notification for admin
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateJobStatus = async (newStatus, prevStatus) => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: {
          [`jobListings.${newStatus}`]: 1,
          [`jobListings.${prevStatus}`]: -1,
        },
      }
    );
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateRejectRemaining = async (
  excludeStatuses = ["hired"],
  totalRejected
) => {
  try {
    let allStatus = ["pending", "shortlisted", "hired"];

    // Determine statuses to reset
    const resetFields = allStatus.reduce((acc, status) => {
      if (!excludeStatuses.includes(status)) {
        acc[`jobListings.${status}`] = 0; // Reset non-excluded statuses to 0
      }
      return acc;
    }, {});

    // Include the rejected count update
    resetFields["jobListings.rejected"] = totalRejected;

    await AdminMetrics.updateOne({}, { $set: resetFields });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateDeletedJob = async (prevStatus) => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: {
          [`jobListings.${prevStatus}`]: -1,
          "jobListings.totalJobListings": -1,
        },
      }
    );

    // TODO: Remove the job from searching active joblistings (if preStatus was active) (in real-time)
    // TODO: Notify the creator of the job that there job post has been archived
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateSearchAnalytics = async (jobCategory, country) => {
  try {
    const updateFields = {};

    if (jobCategory) {
      updateFields["searchAnalytics.jobCategories." + jobCategory] = 1;
      await AdminMetrics.updateOne({});
    }

    if (country) {
      updateFields["searchAnalytics.countries." + country] = 1;
    }

    await AdminMetrics.updateOne({}, { $inc: updateFields });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
