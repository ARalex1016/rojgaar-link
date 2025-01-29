import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

// Utils
import { getDateDetails } from "../../Utils/DateManager";

// React Icons
import { BiLoaderAlt } from "react-icons/bi";

const Title = ({ children, className }) => {
  return (
    <p className={`text-neutral/75 col-span-4 ${className}`}>{children}</p>
  );
};

const Detail = ({ children, className }) => {
  return (
    <p className={`text-neutral font-semibold col-span-3 ${className}`}>
      {children}
    </p>
  );
};

const Job = () => {
  const navigate = useNavigate();

  const { isAuthenticated, isCandidate } = useAuthStore();
  const { getJobById, saveJob, applyJob } = useJobStore();

  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await saveJob(jobId);

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);

    try {
      const res = await applyJob(jobId);

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      {job && (
        <section className="w-full py-2 flex flex-col justify-center items-center gap-y-4">
          {/* Title */}
          <h2 className="text-neutral text-center font-medium text-xl">
            {job.title}
          </h2>

          {/* Job Details */}
          <section className="w-full grid grid-cols-7 gap-y-2">
            <Title>Company</Title>
            <Detail>{job.companyName}</Detail>

            <Title>Location</Title>
            <Detail>
              {job.location.city}, {job.location.country}
            </Detail>

            <Title>Salary</Title>
            <Detail className="text-accent font-extrabold">
              {job.salaryRange.min} - {job.salaryRange.max}
            </Detail>

            <Title>Category</Title>
            <Detail>{job.category}</Detail>

            <Title>Last Date</Title>
            <Detail>{getDateDetails(job.lastSubmissionDate)}</Detail>

            <span className="col-span-4"></span>
            <p className="text-neutral font-bold col-span-3 text-left mt-2">
              {job.workersHired}/{job.maximumWorkers}{" "}
              <span className="opacity-60">Hired</span>
            </p>
          </section>

          {/* Creator Details */}
          <section className="w-full bg-neutral rounded-t-lg px-5 py-2 shadow-inner-lg shadow-black/80 flex flex-col gap-y-2">
            <h2 className="text-primary text-center font-medium text-xl">
              Creator Details
            </h2>

            <section className="w-full grid grid-cols-5 gap-y-2 rounded-t-md">
              <p className="text-black/80 text-sm col-span-2">Email</p>

              <p className="text-black text-xs font-medium  col-span-3 leading-4">
                aslamsheikh1016@gmail.com
              </p>

              <p className="text-black/80 text-sm col-span-2">Phone Number</p>

              <p className="text-black text-sm font-medium  col-span-3">
                0976565656338
              </p>
            </section>
          </section>

          {/* Action */}
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
