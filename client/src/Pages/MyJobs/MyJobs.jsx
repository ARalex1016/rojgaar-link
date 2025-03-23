import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// React Icons
import { IoMdAdd } from "react-icons/io";

// Components
import JobCard from "../../Components/JobCard";
import CreateJobComp from "./CreateJobComp";
import TabsWithCounter from "../../Components/Tabs";
import NoData from "../../Components/NoData";
import Pagination from "../../Components/Pagination";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

const MyJobs = () => {
  const { isCreator, isCandidate } = useAuthStore();
  const { counters, customRequest } = useJobStore();

  const [activeTab, setActiveTab] = useState(
    isCandidate ? "applied" : "pending"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenNewJob, setIsOpenNewJob] = useState(false);

  const tabs = isCandidate
    ? ["applied", "saved"]
    : ["pending", "active", "filled", "expired", "suspended"];

  const apiEndpoints = {
    applied: "/application/applied",
    saved: "/jobs/saved",
    pending: "/jobs/creator-jobs?status=pending",
    active: "/jobs/creator-jobs?status=active",
    filled: "/jobs/creator-jobs?status=filled",
    expired: "/jobs/creator-jobs?status=expired",
    suspended: "/jobs/creator-jobs?status=suspended",
  };

  const fetchJobs = async (tab) => {
    setIsLoading(true);
    setJobs([]);

    try {
      let pageQuery = `&page=${currentPage}`;
      const res = await customRequest(apiEndpoints[tab], pageQuery);

      setJobs(res);
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

  // Handle Page Change
  useEffect(() => {
    fetchJobs(activeTab);
  }, [currentPage]);

  return (
    <>
      <div className="w-full">
        {/*Tabs with Counters*/}
        <section className="w-full flex flex-row  justify-around flex-nowrap gap-x-4 overflow-auto scrollbar-hide pt-2 my-2">
          {tabs.map((tab, index) => {
            return (
              <TabsWithCounter
                key={index}
                counter={counters && counters[tab]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {tab}
              </TabsWithCounter>
            );
          })}

          {/* Add New Job Button */}
          {isCreator && (
            <button
              onClick={() => setIsOpenNewJob((pre) => !pre)}
              className="text-neutral/80 text-xs font-normal bg-customBlue rounded-md flex flex-row justify-center items-center gap-x-1 px-2 py-2 transition-all duration-200 float-right fixed bottom-sideSpacing right-sideSpacing z-30 group md:relative md:bottom-0 md:right-0 md:py-0 md:px-3 hover:text-neutral hover:px-3"
            >
              <IoMdAdd style={{ fontSize: "24px" }} /> Add New
            </button>
          )}
        </section>

        {counters && counters[activeTab] > 0 && (
          <p className="text-neutral/70 text-sm">
            Total Jobs Found :{" "}
            <span className="text-neutral font-bold">
              {counters[activeTab]}
            </span>
          </p>
        )}

        {/* Job Cards */}
        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
          {jobs?.data?.length > 0 ? (
            jobs?.data?.map((job) => {
              return (
                <JobCard key={job._id} job={isCandidate ? job.jobDate : job} />
              );
            })
          ) : (
            <NoData />
          )}
        </section>

        {jobs && jobs?.data?.length > 0 && jobs.meta && (
          <Pagination
            totalPages={jobs.meta.totalPages}
            currentPage={jobs.meta.currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        {isOpenNewJob && (
          <CreateJobComp onClose={() => setIsOpenNewJob(false)} />
        )}
      </div>
    </>
  );
};

export default MyJobs;
