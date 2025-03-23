import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import BackButton from "../../Components/BackButton";
import ExpandableText from "../../Components/ExpandableText";
import ButtonWithLoader from "../../Components/Button";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

// Utils
import { getDateDetails } from "../../Utils/DateManager";
import { capitalize } from "../../Utils/StringManager";

// React Icons
import { BiLoaderAlt } from "react-icons/bi";

const Title = ({ children, className }) => {
  return (
    <p
      className={`mobilesm:text-sm mobile:text-base text-neutral/75 col-span-4 ${className}`}
    >
      {children}
    </p>
  );
};

const Detail = ({ children, className }) => {
  return (
    <p
      className={`mobilesm:text-sm mobile:text-base text-neutral font-semibold col-span-3 ${className}`}
    >
      {children}
    </p>
  );
};

const Job = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, isCreator, isCandidate } =
    useAuthStore();
  const { getJobById, saveJob, applyJob, approveJob, suspendJob, deleteJob } =
    useJobStore();

  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [jobCreator, setJobCreator] = useState(false);

  // Loading State
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getjob = async (jobId) => {
      try {
        const res = await getJobById(jobId);

        setJob(res);
      } catch (error) {
        toast(error);
      }
    };

    getjob(jobId);
  }, [jobId]);

  useEffect(() => {
    setJobCreator(isAuthenticated && isCreator && job?.creatorId === user._id);
  }, [job, isAuthenticated, isCreator, user]);

  // Candidate
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await saveJob(jobId);

      toast.success(res.message);
      setJob((pre) => ({ ...pre, hasSaved: true }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Candidate
  const handleApply = async () => {
    setIsApplying(true);

    try {
      const res = await applyJob(jobId);

      toast.success(res.message);
      setJob((pre) => ({ ...pre, hasApplied: true }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  // Admin
  const handleApproveJob = async () => {
    setIsApproving(true);

    try {
      const res = await approveJob(job._id);

      toast.success(res);

      setJob((pre) => ({
        ...pre,
        status: "active",
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApproving(false);
    }
  };

  // Admin
  const handleSuspend = async () => {
    setIsSuspending(true);

    try {
      const res = await suspendJob(job._id);

      toast.success(res);

      setJob((pre) => ({
        ...pre,
        status: "suspended",
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSuspending(false);
    }
  };

  // Admin || Creator
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await deleteJob(job._id);

      toast.success(res);

      setJob(null);
      navigate(-1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {job && (
        <section className="w-full pt-6 flex flex-col justify-center items-center gap-y-4">
          {/* Back Button */}
          <BackButton className="mt-2" />

          {/* Title */}
          <h2 className="text-neutral text-center font-medium mobilesm:text-lg mobile:text-xl">
            {capitalize(job.title)}
          </h2>

          {/* Job Details */}
          <section className="w-full grid grid-cols-7 gap-y-2">
            <Title>Company</Title>
            <Detail>{capitalize(job.companyName)}</Detail>

            <Title>Location</Title>
            <Detail>
              {job.location.country}, {job.location.state}
            </Detail>

            <Title>Salary</Title>
            <Detail className="text-green font-extrabold">${job.salary}</Detail>

            <Title>Experienced Level</Title>
            <Detail className="text-blue">
              {capitalize(job.experienceLevel)}
            </Detail>

            <Title>Category</Title>
            <Detail>
              {job.category !== "Others" && job.category}
              {job.category === "Others" &&
                (`${job.otherCategory} (Others)` || "---")}
            </Detail>

            <Title>Last Submission Date</Title>
            <Detail>{getDateDetails(job.lastSubmissionDate, false)}</Detail>

            {/* Status */}
            {!isCandidate && (
              <>
                <Title>Status</Title>
                <Detail
                  className={`${
                    job.status === "pending" && "text-yellow-300"
                  } ${job.status === "active" && "text-customGreen"} ${
                    job.status === "suspended" && "text-orange"
                  } ${job.status === "filled" && "text-customBlue"} ${
                    job.status === "expired" && "text-red"
                  }`}
                >
                  {capitalize(job.status)}
                </Detail>
              </>
            )}

            <span className="col-span-4"></span>
            <p className="text-neutral font-bold col-span-3 text-left">
              {job.workersHired}/{job.maximumWorkers}{" "}
              <span className="opacity-60">Hired</span>
            </p>

            {/* Description */}
            <div className="col-span-7 min-h-24 text-center bg-gray/60 shadow-inner-lg shadow-neutral/40  rounded-md px-4 py-2 my-2">
              <h2 className="text-orange/70 text-lg font-medium mb-1">
                Description
              </h2>

              <ExpandableText text={job?.description} />
            </div>
          </section>

          {/* Creator Details */}
          {(isAdmin || isCreator) && job.creatorDetails && (
            <section className="w-full bg-neutral/80 rounded-t-md px-5 py-2 shadow-inner-lg shadow-black/80 flex flex-col gap-y-2">
              <h2 className="text-primary text-center font-medium text-xl">
                Creator Details
              </h2>

              <section className="w-full grid grid-cols-5 gap-y-2 rounded-t-md">
                <p className="text-black/80 text-sm col-span-2">Name</p>
                <p className="text-black text-xs font-medium  col-span-3 leading-4">
                  {capitalize(job.creatorDetails.creatorName)}
                </p>

                <p className="text-black/80 text-sm col-span-2">Email</p>
                <p className="text-black text-xs font-medium  col-span-3 leading-4">
                  {job.creatorDetails.creatorEmail}
                </p>

                <p className="text-black/80 text-sm col-span-2">Created At</p>
                <p className="text-black text-xs font-medium  col-span-3 leading-4">
                  {getDateDetails(job.creatorDetails.createdAt, false)}
                </p>

                {isAdmin && (
                  <>
                    <p className="text-black/80 text-sm col-span-2">
                      Creator Id
                    </p>
                    <p className="text-black text-xs font-medium  col-span-3 leading-4">
                      {job.creatorDetails.creatorId}
                    </p>
                  </>
                )}
              </section>
            </section>
          )}

          {/* Approver Details */}
          {isAdmin && job.approverDetails && job.status === "active" && (
            <section className="w-full bg-black/80 rounded-md px-5 py-2 shadow-inner-lg shadow-neutral/80 flex flex-col gap-y-2 m-2">
              <h2 className="text-neutral/80 text-center font-medium text-xl">
                Approver Details
              </h2>

              <section className="w-full grid grid-cols-5 gap-y-2 rounded-t-md">
                {/* Approver Name */}
                <p className="text-neutral/80 text-sm col-span-2">Name</p>
                <p className="text-neutral text-xs font-medium  col-span-3 leading-4">
                  {capitalize(job.approverDetails.approverName)}
                </p>

                {/* Approver Email */}
                <p className="text-neutral/80 text-sm col-span-2">Email</p>
                <p className="text-neutral text-xs font-medium  col-span-3 leading-4">
                  {job.approverDetails.approverEmail}
                </p>

                {/* Approver Date */}
                <p className="text-neutral/80 text-sm col-span-2">
                  Approved Date
                </p>
                <p className="text-neutral text-xs font-medium  col-span-3 leading-4">
                  {getDateDetails(job.approverDetails.approvedDate, false)}
                </p>

                {/* Approver Date */}
                <p className="text-neutral/80 text-sm col-span-2">
                  Approver Role
                </p>
                <p className="text-neutral text-xs font-medium  col-span-3 leading-4">
                  {capitalize(job.approverDetails.approverRole)}
                </p>

                {/* Approver ID */}
                <p className="text-neutral/80 text-sm col-span-2">
                  Approver ID
                </p>
                <p className="text-neutral text-xs font-medium  col-span-3 leading-4">
                  {job.approverDetails.approverId}
                </p>
              </section>
            </section>
          )}

          {/* Action Buttons */}
          {/* Apply & Save (for Candidate) */}
          {isAuthenticated && isCandidate && (
            <section className="w-full flex flex-row justify-between mt-4">
              <button
                onClick={handleSave}
                disabled={job.hasSaved || isSaving}
                className={`w-1/3 text-lg text-neutral font-medium bg-blue/60 hover:bg-blue rounded-md py-1 disabled:text-neutral/90 disabled:bg-gray/60 disabled:cursor-not-allowed ${
                  job.hasSaved && "cursor-not-allowed"
                }`}
              >
                {job.hasSaved ? (
                  "Saved"
                ) : isSaving ? (
                  <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
                ) : (
                  "Save Job"
                )}
              </button>

              <button
                onClick={handleApply}
                disabled={job.hasApplied || isApplying}
                className={`w-1/3 text-lg text-neutral font-medium bg-main/60 hover:bg-main rounded-md py-1 disabled:text-neutral/90 disabled:bg-gray/60 disabled:cursor-not-allowed ${
                  job.hasApplied && "cursor-not-allowed"
                }`}
              >
                {job.hasApplied ? (
                  "Applied"
                ) : isApplying ? (
                  <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
                ) : (
                  "Apply Now"
                )}
              </button>
            </section>
          )}

          {/* Approve / Suspend / Update / Delete Job (for Admin || jobCreator) */}
          {isAuthenticated && (isAdmin || jobCreator) && (
            <section className="w-full flex flex-row justify-between mb-4">
              {/* Approve Button */}
              {isAdmin && job.status !== "active" && (
                <ButtonWithLoader
                  label="Approve"
                  isLoading={isApproving}
                  onClick={handleApproveJob}
                  className="w-1/5 bg-customBlue/80 hover:bg-customBlue"
                />
              )}

              {/* Suspend Button */}
              {isAdmin && job.status !== "suspended" && (
                <ButtonWithLoader
                  label="Suspend"
                  isLoading={isSuspending}
                  onClick={handleSuspend}
                  className="w-1/5 bg-orange/70 hover:bg-orange/90"
                />
              )}

              {/* Update Button */}
              {jobCreator && (
                <ButtonWithLoader
                  label="Update"
                  // isLoading={isDeleting}
                  // onClick={handleDelete}
                  className="w-1/5 bg-customBlue/80 hover:bg-customBlue"
                />
              )}

              {/* Delete Button */}
              {(isAdmin || jobCreator) && (
                <ButtonWithLoader
                  label="Delete"
                  isLoading={isDeleting}
                  onClick={handleDelete}
                  className="w-1/5 bg-red/80 hover:bg-red"
                />
              )}
            </section>
          )}

          {/* Not Logged Users */}
          {!isAuthenticated && (
            <p className="text-neutral text-center">
              Please{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-orange font-semibold"
              >
                Login
              </span>{" "}
              to Apply or Save the Job
            </p>
          )}
        </section>
      )}
    </>
  );
};

export default Job;
