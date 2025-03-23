import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import TabsWithCounter from "../../Components/Tabs";
import JobCard from "../../Components/JobCard";
import NoData from "../../Components/NoData";
import Pagination from "../../Components/Pagination";

// Store
import { useJobStore } from "../../Store/useJobStore";

// Utils
import { isValidObjectId, isEmptyObject } from "../../Utils/StringManager";

const AdminJobs = () => {
  const { counters, getAllJobs, getJobById } = useJobStore();

  //   State for All Jobs By Status
  const [jobs, setJobs] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);

  //  State for Search Job
  const [searchedJob, setSearchedJob] = useState({});
  const [jobId, setJobId] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const tabs = [
    "search",
    "pending",
    "active",
    "suspended",
    "filled",
    "expired",
  ];

  const handleSearch = async () => {
    if (isValidObjectId(jobId)) {
      try {
        let res = await getJobById(jobId);

        setSearchedJob(res);
      } catch (error) {
        setSearchedJob({});
        toast.error("Failed to fetch job details. Please try again.");
      }
    } else {
      setSearchedJob({});
      toast.error("Please provide a valid Job ID!");
    }
  };

  const getJobByStatus = async () => {
    setJobs({});
    try {
      const pageQuery = `&page=${currentPage}`;

      const res = await getAllJobs(activeTab, pageQuery);

      setJobs(res);
    } catch (error) {}
  };

  useEffect(() => {
    if (activeTab === tabs[0]) {
      setIsOpenSearch(true);
    } else if (tabs.includes(activeTab) && activeTab !== tabs[0]) {
      setIsOpenSearch(false);

      getJobByStatus();
    }
  }, [activeTab]);

  //   Reset Input Fleid
  useEffect(() => {
    if (!isOpenSearch) {
      setJobId("");
    }
  }, [isOpenSearch]);

  // Handle Page Change
  useEffect(() => {
    getJobByStatus();
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
        </section>

        {/* Search Box */}
        {isOpenSearch && (
          <section className="w-full mt-4 flex flex-row">
            <input
              type="text"
              placeholder="Search By Job ID"
              id="jobId"
              name="jobId"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-2/3 text-base text-neutral font-medium rounded-l-md px-2 py-1 bg-transparent border-2 border-r-0 border-main outline-none focus:border-neutral/80"
            />

            <button
              onClick={handleSearch}
              className="w-1/3 text-lg text-neutral font-medium bg-customBlue/80 rounded-r-md py-1 cursor-pointer"
            >
              Search
            </button>
          </section>
        )}

        {counters && counters[activeTab] > 0 && (
          <p className="text-neutral/70 text-sm">
            Total Jobs Found :{" "}
            <span className="text-neutral font-bold">
              {counters[activeTab]}
            </span>
          </p>
        )}

        {/* Job Card for Search Job By ID*/}
        {isOpenSearch && (
          <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
            {!isEmptyObject(searchedJob) ? (
              <JobCard job={searchedJob} />
            ) : (
              <NoData />
            )}
          </section>
        )}

        {/* Job Cards (All Tabs) */}
        {!isOpenSearch && (
          <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
            {jobs && jobs.data && jobs.data.length > 0 ? (
              jobs.data.map((job) => {
                return <JobCard key={job._id} job={job} />;
              })
            ) : (
              <NoData />
            )}
          </section>
        )}

        {jobs && jobs?.data?.length > 0 && jobs.meta && (
          <Pagination
            totalPages={jobs.meta.totalPages}
            currentPage={jobs.meta.currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default AdminJobs;
