import { useNavigate } from "react-router-dom";

// React Icons
import { RxAvatar } from "react-icons/rx";

// Utils
import { getDateDetails } from "../Utils/DateManager";

const JobTable = ({ job = {} }) => {
  const titleStyle = "text-xs text-primary/75 text-left col-span-5";
  const detailStyle = "text-xs font-medium col-span-6";

  return (
    <>
      <div className="w-full grid grid-cols-11 gap-x-2 gap-y-3">
        <p className={titleStyle}>Country</p>
        <p className={detailStyle}>{job.location.country}</p>

        <p className={titleStyle}>Salary</p>
        <p
          className={`${detailStyle} text-main font-bold`}
        >{`$${job.salaryRange.min} - $${job.salaryRange.max}`}</p>

        <p className={titleStyle}>Company</p>
        <p className={detailStyle}>{job.companyName}</p>

        <p className={titleStyle}>Category</p>
        <p className={detailStyle}>{job.category}</p>

        <p className={titleStyle}>Last Date</p>
        <p className={detailStyle}>{getDateDetails(job?.lastSubmissionDate)}</p>
      </div>
    </>
  );
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => navigate(job._id)}
        className="w-64 bg-neutral/85 hover:bg-neutral rounded-lg flex flex-col items-center gap-y-2 shadow-sm shadow-main/60 pt-8 pb-6 px-6 relative
      "
      >
        {/* Creator Profile */}
        <div className="w-8 aspect-square bg-main rounded-full flex justify-center items-center absolute top-3 right-3">
          {job?.creatorProfile ? (
            <img
              src={job.creatorProfile}
              alt={`Profile picture of ${job.creatorName || "creator"}`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <RxAvatar className="w-full h-full text-white/60" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-main font-medium mb-2">{job.title}</h2>

        {/* Detail Table */}
        <JobTable job={job} />

        {/* Hired  */}
        <p className="w-full text-textOpposite/60 text-xs text-right">
          <span className="font-semibold">
            {job?.workersHired}/{job?.maximumWorkers}
          </span>{" "}
          {job.workersHired === job.maximumWorkers ? "Fully Hired" : "Hired"}
        </p>

        {/* Button */}
        <button className="w-2/3 text-text font-bold bg-main rounded-md py-2 hover:bg-main/80 focus:outline-none focus:ring">
          View Details
        </button>
      </div>
    </>
  );
};

export default JobCard;
