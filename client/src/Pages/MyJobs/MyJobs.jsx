import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// React Icons
import { IoMdAdd } from "react-icons/io";

// Components
import JobCard from "../../Components/JobCard";
import CreateJobComp from "./CreateJobComp";
import NoData from "../../Components/NoData";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

// Utils
import { capitalize } from "../../Utils/StringManager";

const MyJobs = () => {
  const { isCreator, isCandidate } = useAuthStore();
  const { customRequest } = useJobStore();

  const [activeTab, setActiveTab] = useState(
    isCandidate ? "applied" : "pending"
  );
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenNewJob, setIsOpenNewJob] = useState(false);

  const tabs = isCandidate
    ? ["applied", "saved"]
    : ["pending", "live", "filled", "expired", "suspended"];

  const apiEndpoints = {
    applied: "/application/applied",
    saved: "/jobs/saved",
    pending: "/jobs/creator-jobs?status=pending",
    live: "/jobs/creator-jobs?status=approved",
    filled: "/jobs/creator-jobs?status=filled",
    expired: "/jobs/creator-jobs?status=expired",
    suspended: "/jobs/creator-jobs?status=suspended",
  };

  const fetchJobs = async (tab) => {
    setIsLoading(true);
    setJobs([]);

    try {
      const res = await customRequest(apiEndpoints[tab]);
      setJobs(res.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch jobs when the active tab changes
    if (!jobs[activeTab]) {
      fetchJobs(activeTab);
    }
  }, [activeTab]);

  // Prevendt Scroll When New Job Component is Opened
  useEffect(() => {
    // Toggle body scroll based on isOpenNewJob
    if (isOpenNewJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenNewJob]);

  return (
    <>
      <div className="w-full">
        {/*Tabs */}
        <section className="w-full flex flex-row  justify-around flex-nowrap gap-x-4 overflow-auto scrollbar-hide my-2">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-20 w-auto flex-shrink-0 text-neutral/80 font-medium  rounded-md px-4 py-1 hover:text-neutral ${
                  tab === activeTab
                    ? "bg-main/80 hover:bg-main"
                    : "bg-gray/80 hover:bg-gray"
                }`}
              >
                {capitalize(tab)}
              </button>
            );
          })}

          {/* Add New Job Button */}
          {isCreator && (
            <button
              onClick={() => setIsOpenNewJob((pre) => !pre)}
              className="text-neutral/80 text-xs font-normal bg-blue rounded-md flex flex-row justify-center items-center gap-x-1 px-1 py-2 hover:px-3 transition-all duration-200 hover:text-neutral float-right fixed bottom-sideSpacing right-sideSpacing z-30 group md:relative md:bottom-0 md:right-0 md:py-0 md:px-3"
            >
              <IoMdAdd style={{ fontSize: "24px" }} /> Add New
            </button>
          )}
        </section>

        {/* Job Cards */}
        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return (
                <JobCard key={job._id} job={isCandidate ? job.jobDate : job} />
              );
            })
          ) : (
            <NoData />
          )}
        </section>

        {isOpenNewJob && (
          <CreateJobComp onClose={() => setIsOpenNewJob(false)} />
        )}
      </div>
    </>
  );
};

export default MyJobs;
