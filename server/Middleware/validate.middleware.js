export const validateJobStatus = async (req, res, next) => {
  const { job } = req;

  try {
    if (job.status === "filled") {
      return res.status(400).json({
        status: "fail",
        message:
          "This job position has already been filled. Additional hires are not allowed.",
      });
    }

    if (job.status === "expired") {
      return res.status(400).json({
        status: "fail",
        message:
          "This job position is no longer active, and additional hires are not permitted.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
