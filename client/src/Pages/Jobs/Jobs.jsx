import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Component
import JobCard from "../../Components/JobCard";
import {
  CountrySelect,
  SortSelect,
  CategorySelect,
  SalaryRange,
} from "../../Components/Input";
import NoData from "../../Components/NoData";

// React Icons
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

// Store
import { useJobStore } from "../../Store/useJobStore";

const Filters = () => {
  const { getAllActiveJobs } = useJobStore();

  const initialQuery = {
    country: null,
    category: [],
    minSalary: 500,
    maxSalary: 700,
    sortBy: null,
  };

  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen((prevState) => !prevState);
  };

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

  const handleCountryChange = (selectedCountry) => {
    setQuery((pre) => ({
      ...pre,
      location: {
        ...pre.location,
        country: selectedCountry,
      },
    }));
  };

  const handleRemoveFilter = () => {
    setQuery(initialQuery);
  };

  const handleSearch = async () => {
    let queries = [];

    if (query.country) {
      queries.push(`country=${encodeURIComponent(query.country.label)}`);
    }

    if (query.category && query.category.length > 0) {
      const categories = query.category.join(",");
      queries.push(`category=${encodeURIComponent(categories)}`);
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

    const queryString = queries.join("&");

    try {
      const res = await getAllActiveJobs(queryString);
    } catch (error) {}

    queries = [];
  };

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
          className="w-[100svw] -ml-sideSpacing px-sideSpacing shadow-md shadow-neutral/40 grid grid-cols-2 gap-x-4 gap-y-2 pt-2 pb-5 m-auto"
        >
          {/* Countries */}
          <CountrySelect
            country={query.country}
            handleCountryChange={handleCountryChange}
            className="col-span-1"
          />

          {/* Sort By */}
          <SortSelect
            handleSortChange={handleSortChange}
            className="col-span-1"
          />

          {/* Category */}
          <CategorySelect
            selectedCategory={query.category}
            handleCategoryChange={handleCategoryChange}
            className="col-span-2"
          />

          {/* Salary range */}
          <SalaryRange
            query={query}
            handleSalaryChange={handleSalaryChange}
            className="col-span-2"
          />

          {/* Action Buttons (Remove Filter & Search )*/}
          <div className="col-span-2 flex justify-center items-center gap-x-4">
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
        className={`w-fit text-neutral text-xl bg-main rounded-full flex justify-center items-center -translate-y-[50%] ${
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

  return (
    <>
      <div>
        {/* Filter */}
        <Filters />

        {/* All Jobs */}
        <section className="w-full min-h-40 flex justify-around gap-x-8 gap-y-10 flex-wrap py-4">
          {jobs && jobs.map((job) => <JobCard key={job._id} job={job} />)}

          {jobs && jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <NoData />
          )}
        </section>
      </div>
    </>
  );
};

export default Jobs;
