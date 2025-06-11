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
import CreateJobMultiStep from "./CreateJobMultiStep";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useJobStore } from "../../Store/useJobStore";

const MessageBox = ({ className, children }) => {
  return (
    <p
      className={`text-sm bg-neutral/75 rounded-md px-2 py-1 my-1 ${className}`}
    >
      {children}
    </p>
  );
};

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
    ? [
        {
          name: "applied",
          message: "Track the status of jobs you have applied for here.",
        },
        {
          name: "saved",
          message:
            "View jobs you’ve saved for quick access or future reference.",
        },
      ]
    : [
        {
          name: "pending",
          message:
            "These jobs are awaiting admin's approval and will be listed once approved.",
        },
        {
          name: "active",
          message: "These jobs are live and available for candidates to apply.",
        },
        {
          name: "filled",
          message:
            "These jobs have reached their worker limit and are no longer accepting applications.",
        },
        {
          name: "expired",
          message:
            "These jobs have passed their application deadline and are no longer accepting candidates.",
        },
        {
          name: "suspended",
          message:
            "These jobs have been suspended and are currently unavailable to candidates.",
        },
      ];

  const apiEndpoints = {
    applied: "/application/applied?",
    saved: "/jobs/saved?",
    pending: "/jobs/creator-jobs?status=pending",
    active: "/jobs/creator-jobs?status=active",
    filled: "/jobs/creator-jobs?status=filled",
    expired: "/jobs/creator-jobs?status=expired",
    suspended: "/jobs/creator-jobs?status=suspended",
  };

  const fetchJobs = async (tab) => {
    setIsLoading(true);

    try {
      let pageQuery = `page=${currentPage}`;

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
      setJobs([]);

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
        {/* Add New Job Button */}
        {isCreator && (
          <button
            onClick={() => setIsOpenNewJob((pre) => !pre)}
            className="text-neutral/80 text-xs font-medium bg-customBlue/80 rounded-md flex flex-row justify-center items-center gap-x-1 px-2 py-1 transition-all duration-200 float-end mt-2 hover:text-neutral hover:bg-customBlue hover:shadow-sm hover:shadow-neutral/75 hover:px-3"
          >
            <IoMdAdd style={{ fontSize: "24px" }} /> Add New
          </button>
        )}

        {/*Tabs with Counters*/}
        <section className="w-full flex flex-row  justify-around flex-nowrap gap-x-4 overflow-auto scrollbar-hide pt-2 my-2">
          {tabs.map((tab, index) => {
            return (
              <TabsWithCounter
                key={index}
                counter={counters && counters[tab.name]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
                {tab.name}
              </TabsWithCounter>
            );
          })}

          {/* Add New Job Button */}
          {/* {isCreator && (
            <button
              onClick={() => setIsOpenNewJob((pre) => !pre)}
              className="text-neutral/80 text-xs font-normal bg-customBlue rounded-md flex flex-row justify-center items-center gap-x-1 px-2 py-2 transition-all duration-200 float-right fixed bottom-menuHeight right-sideSpacing z-30 shadow-sm shadow-customBlue/80 group md:relative md:bottom-0 md:right-0 md:py-0 md:px-3 hover:text-neutral hover:px-3"
            >
              <IoMdAdd style={{ fontSize: "24px" }} /> Add New
            </button>
          )} */}
        </section>

        {tabs.map((tab, index) => {
          if (tab.name === activeTab) {
            return (
              <div key={index}>
                <MessageBox>{tab.message}</MessageBox>
              </div>
            );
          }
        })}

        <p className="text-neutral/70 text-sm">
          Total Jobs Found :{" "}
          <span className="text-neutral font-bold">
            {jobs?.meta?.totalJobs ?? 0}
          </span>
        </p>

        {/* Job Cards */}
        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap mt-4">
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

        {/* Pagination */}
        {jobs && jobs?.data?.length > 0 && jobs.meta && (
          <Pagination
            totalPages={jobs.meta.totalPages}
            currentPage={jobs.meta.currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        {isOpenNewJob && (
          <CreateJobMultiStep onClose={() => setIsOpenNewJob(false)} />
        )}
      </div>
    </>
  );
};

export default MyJobs;
