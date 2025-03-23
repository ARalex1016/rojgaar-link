import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// React-Icons
import { IoClose } from "react-icons/io5";

// Component
import {
  FloatingLabelInput,
  TextAreaFloatingLabel,
  SalaryInputWithCurrency,
  CountryStateSelect,
  CategorySelect,
  DateInput,
  RadioInput,
} from "../../Components/Input";

// React Icons
import { BiLoaderAlt } from "react-icons/bi";

// Store
import { useJobStore } from "../../Store/useJobStore";

export const CreateJobComp = ({ onClose }) => {
  const { createJob } = useJobStore();

  const initialJobData = {
    title: "",
    description: "",
    salary: "",
    location: {
      country: "",
      state: "",
    },
    companyName: "",
    category: [],
    otherCategory: "",
    maximumWorkers: "",
    experienceLevel: "",
    lastSubmissionDate: "",
  };

  const [jobData, setJobData] = useState(initialJobData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setJobData((pre) => ({ ...pre, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions) => {
    if (!selectedOptions) {
      setJobData((prev) => ({
        ...prev,
        category: [],
      }));
    } else if (selectedOptions.length <= 1) {
      setJobData((prev) => ({
        ...prev,
        category: selectedOptions.map((option) => option),
      }));
    } else {
      alert("You can only select 1 category!");
    }

    if (selectedOptions !== "Others") {
      setJobData((prev) => ({
        ...prev,
        otherCategory: "",
      }));
    }
  };

  const handleLocationChange = (newLocation) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      location: {
        ...prevJobData.location,
        ...newLocation,
      },
    }));
  };

  const handleExperienceLevelChange = (value) => {
    setJobData((pre) => ({
      ...pre,
      experienceLevel: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let res = await createJob(jobData);

      toast.success(res.message);

      setJobData(initialJobData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        className="w-full bg-primary rounded-md shadow-md shadow-main fixed top-menuHeight z-40 flex flex-col gap-y-4 overflow-y-auto px-8 pt-10 pb-6 customScrollbarStyle"
        style={{
          width: "calc(100% - (2 * var(--sideSpacing)))",
          height: "calc(100vh - var(--menuHeight) - var(--sideSpacing))",
          top: "calc(var(--menuHeight) + (var(--sideSpacing) / 5))",
        }}
      >
        {/* Close Button */}
        <button
          className="font-medium text-neutral bg-red p-1 rounded-md absolute top-2 right-2 z-20 transition-all duration-200 hover:scale-105"
          onClick={onClose}
        >
          <IoClose style={{ color: "", fontSize: "20px" }} />
        </button>

        {/* Title */}
        <FloatingLabelInput
          label="Title"
          name="title"
          id="title"
          value={jobData.title}
          handleInputChange={handleInputChange}
        />

        {/* Company */}
        <FloatingLabelInput
          label="Company Name"
          name="companyName"
          type="text"
          id="companyName"
          value={jobData.companyName}
          handleInputChange={handleInputChange}
        />

        {/* Countries && State*/}
        <CountryStateSelect
          country={jobData.location.country}
          state={jobData.location.state}
          onLocationChange={handleLocationChange}
          className="w-full"
        />

        {/* Salary */}
        <div className="flex flex-row items-center gap-x-1">
          <SalaryInputWithCurrency
            id="salary"
            name="salary"
            value={jobData.salary}
            handleSalaryChange={handleInputChange}
            className="w-4/5"
          />

          <p className="text-neutral text-sm font-medium">/month</p>
        </div>

        {/* Category */}
        <CategorySelect
          selectedCategory={jobData.category}
          handleCategoryChange={handleCategoryChange}
          placeholder="Select a Category"
          className="col-span-2"
        />

        {/* Other Category */}
        {jobData.category.includes("Others") && (
          <FloatingLabelInput
            label="Mention Other Category"
            name="otherCategory"
            type="text"
            id="otherCategory"
            value={jobData.otherCategory}
            handleInputChange={handleInputChange}
          />
        )}

        {/* Maximum Workers */}
        <FloatingLabelInput
          label="Total Workers Required"
          name="maximumWorkers"
          type="number"
          id="maximumWorkers"
          value={jobData.maximumWorkers}
          handleInputChange={handleInputChange}
          className="w-1/2"
        />

        {/* Required Experience Level */}
        <p className="text-neutral/60 text-xs font-semibold -mb-3">
          Required Experience Level
        </p>
        <section className="col-span-2 flex flex-row justify-between pr-2">
          <RadioInput
            label="Beginer"
            name="experienceLevel"
            id="beginer"
            value="beginer"
            checked={jobData.experienceLevel === "beginer"}
            handleInputChange={handleExperienceLevelChange}
          />

          <RadioInput
            label="Intermediate"
            name="experienceLevel"
            id="intermediate"
            value="intermediate"
            checked={jobData.experienceLevel === "intermediate"}
            handleInputChange={handleExperienceLevelChange}
          />

          <RadioInput
            label="Skilled"
            name="experienceLevel"
            id="skilled"
            value="skilled"
            checked={jobData.experienceLevel === "skilled"}
            handleInputChange={handleExperienceLevelChange}
          />
        </section>

        {/* Last Submission Date */}
        <DateInput
          label="Last Submission Date"
          id="lastSubmissionDate"
          name="lastSubmissionDate"
          value={jobData.lastSubmissionDate}
          handleInputChange={handleInputChange}
        />

        {/* Description */}
        <TextAreaFloatingLabel
          label="Description"
          name="description"
          id="description"
          value={jobData.description}
          handleInputChange={handleInputChange}
        />

        {/* Note */}
        <p className="text-white/80 text-xs">
          <span className="text-white font-bold">Note: </span>Your contact
          details (email and phone number) will be visible to the candidates you
          hire.
        </p>

        {/* Submit Button */}
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="min-h-10 text-primary text-lg font-medium bg-customBlue rounded-md py-1 disabled:bg-gray"
        >
          {isSubmitting ? (
            <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
          ) : (
            "Submit"
          )}
        </button>
      </section>
    </>
  );
};

export default CreateJobComp;
