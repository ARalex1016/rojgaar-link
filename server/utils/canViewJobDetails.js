export const canViewJobDetails = async (
  job,
  user,
  isAuthenticated,
  isAdmin,
  isCreator
) => {
  // Active jobs are visible to everyone
  if (job.status === "active") return true;

  // Non-authenticated users cannot see non-active jobs
  if (!isAuthenticated) return false;

  // Admins and creators can view all job statuses
  if (isAdmin || isCreator) return true;

  // For "filled" status, check if the user is a hired candidate
  if (job.status === "filled") {
    const isHiredCandidate = await Application.exists({
      jobId: job._id,
      candidateId: user._id,
      status: "hired",
    });
    return isHiredCandidate;
  }

  // Other statuses are not viewable by this user
  return false;
};
