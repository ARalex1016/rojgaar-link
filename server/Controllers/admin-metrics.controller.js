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

export const updateNewUser = async (user) => {
  try {
    await AdminMetrics.updateOne({}, { $inc: { totalUsers: 1 } });

    // TODO: New user (in real-time)
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateNewJob = async (job) => {
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

export const updateApproveJob = async (job) => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: { "jobListings.active": 1, "jobListings.pending": -1 },
      }
    );

    // TODO: Add the job to searching active joblistings (in real-time)
    // TODO: Notify the creator of the job that there job post has been approved or listed
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateSuspendJob = async (job) => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: { "jobListings.active": -1, "jobListings.suspended": 1 },
      }
    );

    // TODO: Remove the job from searching active joblistings (in real-time)
    // TODO: Notify the creator of the job that there job post has been suspended for investigation
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const updateDeletedJob = async (preStatus) => {
  try {
    await AdminMetrics.updateOne(
      {},
      {
        $inc: {
          [`jobListings.${preStatus}`]: -1,
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
