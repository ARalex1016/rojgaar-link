import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import JobCard from "../../Components/JobCard";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

// Utils
import { capitalize } from "../../Utils/stringManager";

const MyJobs = () => {
  const { isCreator, isCandidate } = useAuthStore();
  const { customRequest } = useJobStore();

  const [activeTab, setActiveTab] = useState(
    isCandidate ? "applied" : "pending"
  );
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      <div className="w-full">
        <section className="w-full flex flex-row  justify-around flex-nowrap overflow-auto scrollbar-hide py-4">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-16 text-neutral/80 font-medium  rounded-sm px-3 py-1 hover:text-neutral ${
                  tab === activeTab
                    ? "bg-main/80 hover:bg-main"
                    : "bg-gray/80 hover:bg-gray"
                }`}
              >
                {capitalize(tab)}
              </button>
            );
          })}
        </section>

        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return (
                <JobCard key={job._id} job={isCandidate ? job.jobDate : job} />
              );
            })
          ) : (
            <p className="text-neutral/80 text-center leading-10">
              No data found
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default MyJobs;
