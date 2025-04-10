import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Component
import JobCard from "../../Components/JobCard";
import {
  CountryStateSelect,
  SortSelect,
  CategorySelect,
  SalaryRange,
  RadioInput,
} from "../../Components/Input";
import Pagination from "../../Components/Pagination";
import NoData from "../../Components/NoData";

// React Icons
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

// Store
import { useJobStore } from "../../Store/useJobStore";
import { useAuthStore } from "../../Store/useAuthStore";

const Filters = ({ isOpen, toggleSection, currentPage }) => {
  const { getAllActiveJobs } = useJobStore();

  const initialQuery = {
    location: {
      country: "",
      state: "",
    },
    category: [],
    minSalary: 200,
    maxSalary: 5000,
    experienceLevel: "",
    sortBy: null,
  };

  const [query, setQuery] = useState(initialQuery);

  const handleSortChange = (value) => {
    setQuery((pre) => ({ ...pre, sortBy: value.value }));
  };

  const handleSalaryChange = (minSalary, maxSalary) => {
    setQuery((pre) => ({
      ...pre,
      minSalary,
      maxSalary,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    if (!selectedOptions) {
      setQuery((prev) => ({
        ...prev,
        category: [],
      }));
    } else if (selectedOptions.length <= 5) {
      setQuery((prev) => ({
        ...prev,
        category: selectedOptions.map((option) => option),
      }));
    } else {
      alert("You can only select up to 5 categories!");
    }
  };

  const handleLocationChange = (newLocation) => {
    setQuery((prevJobData) => ({
      ...prevJobData,
      location: {
        ...prevJobData.location,
        ...newLocation,
      },
    }));
  };

  const handleExperienceLevelChange = (e) => {
    const value = e.target.value;

    setQuery((pre) => ({
      ...pre,
      experienceLevel: value,
    }));
  };

  const handleRemoveFilter = () => {
    setQuery(initialQuery);
  };

  const handleSearch = async () => {
    let queries = [];

    if (query.location.country) {
      queries.push(`country=${encodeURIComponent(query.location.country)}`);
    }

    if (query.location.state) {
      queries.push(`state=${encodeURIComponent(query.location.state)}`);
    }

    if (query.category && query.category.length > 0) {
      const categories = query.category.join(",");
      queries.push(`category=${encodeURIComponent(categories)}`);
    }

    if (query.experienceLevel) {
      queries.push(`experienceLevel=${query.experienceLevel}`);
    }

    if (query.minSalary) {
      queries.push(`minSalary=${query.minSalary}`);
    }

    if (query.maxSalary) {
      queries.push(`maxSalary=${query.maxSalary}`);
    }

    if (query.sortBy) {
      queries.push(`sortBy=${query.sortBy}`);
    }

    queries.push(`page=${currentPage}&limit=5`);

    const queryString = queries.join("&");

    try {
      await getAllActiveJobs(queryString);
    } catch (error) {}

    queries = [];
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  return (
    <>
      <AnimatePresence>
        <motion.section
          variants={{
            initial: {
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            },
            final: {
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            },
          }}
          initial="initial"
          animate="final"
          exit="initial"
          transition={{
            duration: 0.05,
            ease: "easeInOut",
          }}
          className="w-[100svw] -ml-sideSpacing px-sideSpacing shadow-md shadow-neutral/40 grid grid-cols-3 gap-x-4 gap-y-2 pt-2 pb-5 m-auto"
        >
          {/* Countries & State */}
          <CountryStateSelect
            country={query.location.country}
            state={query.location.state}
            onLocationChange={handleLocationChange}
            className="col-span-3"
          />

          {/* Category */}
          <CategorySelect
            selectedCategory={query.category}
            handleCategoryChange={handleCategoryChange}
            className="col-span-3"
          />

          {/* Experienced Level Options */}
          <section className="col-span-2 flex flex-row justify-between">
            <RadioInput
              label="Beginer"
              name="experienceLevel"
              id="beginer"
              value="beginer"
              checked={query.experienceLevel === "beginer"}
              handleInputChange={handleExperienceLevelChange}
            />

            <RadioInput
              label="Intermediate"
              name="experienceLevel"
              id="intermediate"
              value="intermediate"
              checked={query.experienceLevel === "intermediate"}
              handleInputChange={handleExperienceLevelChange}
            />

            <RadioInput
              label="Skilled"
              name="experienceLevel"
              id="skilled"
              value="skilled"
              checked={query.experienceLevel === "skilled"}
              handleInputChange={handleExperienceLevelChange}
            />
          </section>

          {/* Sort By */}
          <SortSelect
            value={query.sortBy}
            handleSortChange={handleSortChange}
            className="col-span-1"
          />

          {/* Salary range */}
          <SalaryRange
            query={query}
            handleSalaryChange={handleSalaryChange}
            className="col-span-3"
            x
          />

          {/* Action Buttons (Remove Filter & Search )*/}
          <div className="col-span-3 flex justify-center items-center gap-x-4">
            <button
              onClick={handleRemoveFilter}
              className="w-full text-neutral text-base font-medium bg-red/60 rounded-md py-1 hover:bg-red"
            >
              Remove Filter
            </button>

            <button
              onClick={handleSearch}
              className="w-full text-neutral text-base font-medium bg-main/60 rounded-md py-1 hover:bg-main"
            >
              Appply Filter
            </button>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Dropdown || Up Icon */}
      <div
        onClick={toggleSection}
        className={`w-fit text-neutral/80 text-xl bg-main/70 rounded-full flex justify-center items-center -translate-y-[50%] transition-all duration-300 hover:shadow-sm hover:shadow-main hover:text-neutral hover:bg-main ${
          isOpen ? "p-1" : "px-2 py-1"
        }`}
      >
        {isOpen ? (
          <>
            {/* <p className="text-xs">Close Filter</p> */}
            <FaAngleDown />
          </>
        ) : (
          <>
            <p className="text-xs">Open Filter</p>
            <FaAngleUp />
          </>
        )}
      </div>
    </>
  );
};

const Jobs = () => {
  const { jobs } = useJobStore();
  const { isAuthenticated, isAdmin } = useAuthStore();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSection = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <div>
        {/* Filter */}
        <Filters
          isOpen={isOpen}
          toggleSection={toggleSection}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Admin Jobs Button */}
        {isAuthenticated && isAdmin && !isOpen && (
          <button
            onClick={() => navigate("/admin/jobs")}
            className="text-neutral/80 text-lg bg-red/80 rounded-md px-4 absolute top-menuHeight right-sideSpacing mt-3 hover:shadow-md hover:shadow-red/40 hover:text-neutral hover:bg-red"
          >
            Admin
          </button>
        )}

        <p className="text-neutral/70 text-sm">
          Total Jobs Found :{" "}
          <span className="text-neutral font-bold">
            {jobs?.meta?.totalJobs ?? 0}
          </span>
        </p>

        {/* All Jobs */}
        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
          {jobs && jobs.data.length > 0 ? (
            jobs.data.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <NoData />
          )}
        </section>

        {jobs && jobs?.data?.length > 0 && jobs?.meta && (
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

export default Jobs;
