import { useState } from "react";
import { motion } from "framer-motion";
import * as Yup from "yup";

// Components
import {
  FloatingLabelInput,
  SalaryInputWithCurrency,
  CategorySelect,
  CountryStateSelect,
  TextAreaFloatingLabel,
  RadioInput,
  DateInput,
} from "../../Components/Input";
import { XIcon, PlusIcon, LoaderCircleIcon } from "./../../Components/Icons";
import { AlertBox } from "../../Components/AlertBox";

// Custom Hooks
import { useMultiStepForm } from "../../Hooks/useMultiStepForm";

// Store
import { useJobStore } from "../../Store/useJobStore";

// Validation schema
const validationSchema = [
  Yup.object().shape({
    title: Yup.string()
      .min(3, "Job title must be at least 3 characters long.")
      .max(100, "Job title cannot exceed 100 characters")
      .required("Job title is required"),
    salary: Yup.number()
      .positive("Salary must be a positive number")
      .typeError("Salary must be a valid  number")
      .required("Salary is required"),
    category: Yup.array()
      .of(Yup.string().nullable())
      .min(1, "Select at least one category.")
      .max(1, "Only one category can be selected.")
      .required("Category is required.")
      .default([""]),
    // .test(
    //   "category-and-otherCategory",
    //   "If 'Others' is selected, specify the category in the 'Other Category' field.",
    //   function (category) {
    //     const { otherCategory } = this.parent;
    //     if (category?.[0] === "Others" && !otherCategory) {
    //       return false;
    //     }
    //     if (category?.[0] !== "Others" && otherCategory) {
    //       return false;
    //     }
    //     return true;
    //   }
    // ),
    otherCategory: Yup.string().nullable().default(""),
    // .when("category", {
    //   is: (category) => category?.[0] === "Others",
    //   then: Yup.string()
    //     .required(
    //       "Other category must be specified when 'Others' is selected."
    //     )
    //     .min(3, "Other category must be at least 3 characters long."),
    //   otherwise: Yup.string()
    //     .nullable()
    //     .test(
    //       "no-otherCategory",
    //       "Other category must be empty if not selecting 'Others'.",
    //       (value) => !value
    //     ),
    // }),
    maximumWorkers: Yup.number()
      .required("Maximum workers is required.")
      .integer("Maximum workers must be an integer.")
      .min(1, "Maximum workers must be at least 1."),
    description: Yup.string()
      .min(20, "Job description must be at least 20 characters long.")
      .required("Job description is required."),
  }),
  Yup.object().shape({
    experienceLevel: Yup.string().required("Experience level is required."),
    requirements: Yup.array()
      .of(
        Yup.string().min(3, "Each requirement must be at least 3 characters.")
      )
      .nullable(),
  }),
  Yup.object().shape({
    companyName: Yup.string()
      .required("Company name is required")
      .min(3, "Company name must be at least 3 characters long.")
      .max(100, "Company name cannot exceed 100 characters"),
    location: Yup.object().shape({
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
    }),
  }),
  Yup.object().shape({
    lastSubmissionDate: Yup.date()
      .required("Last submission date is required")
      .min(new Date(), "Last submission date must be in the future")
      .max(
        new Date(new Date() + 30 * 24 * 60 * 60 * 1000),
        "Last submission date cannot be more than 30 days in the future"
      ),
  }),
];

const Title = ({ children, className }) => {
  return (
    <h2 className={`text-neutral text-center text-lg mb-4 ${className}`}>
      {children}
    </h2>
  );
};

const ErrorMessage = ({ children, className }) => {
  return (
    <p
      className={`text-red text-xs transition-opacity duration-0 py-[2px] ${
        children ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children || "Error"}
    </p>
  );
};

// Step 1
const JobDetails = ({
  jobData,
  firstError,
  handleInputChange,
  handleCategoryChange,
}) => {
  return (
    <>
      <Title>Job Information</Title>

      <div className="flex flex-col">
        {/* Title */}
        <FloatingLabelInput
          label="Title"
          name="title"
          id="title"
          value={jobData.title}
          handleInputChange={handleInputChange}
        />

        <ErrorMessage>{firstError.title}</ErrorMessage>

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

        <ErrorMessage>{firstError.salary}</ErrorMessage>

        {/* Category */}
        <CategorySelect
          selectedCategory={jobData.category}
          handleCategoryChange={handleCategoryChange}
          placeholder="Select a Category"
          className="col-span-2"
        />

        <ErrorMessage>{firstError.category}</ErrorMessage>

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

        <ErrorMessage>{firstError.otherCategory}</ErrorMessage>

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

        <ErrorMessage>{firstError.maximumWorkers}</ErrorMessage>

        {/* Description */}
        <TextAreaFloatingLabel
          label="Description"
          name="description"
          id="description"
          value={jobData.description}
          handleInputChange={handleInputChange}
        />

        <ErrorMessage>{firstError.description}</ErrorMessage>
      </div>
    </>
  );
};

// Step 2
const CandidateRequirements = ({
  jobData,
  firstError,
  handleExperienceLevelChange,
  setJobData,
}) => {
  const handleAddRequirements = () => {
    setJobData((pre) => ({
      ...pre,
      requirements: [...pre.requirements, ""],
    }));
  };

  const handleDeleteRequirements = (index) => {
    setJobData((pre) => ({
      ...pre,
      requirements: pre.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRequirementsChange = (e, index) => {
    const { value } = e.target;

    setJobData((pre) => ({
      ...pre,
      requirements: pre.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  return (
    <>
      <Title>Candidate Requirements</Title>

      <div className="w-full flex flex-col items-start">
        {/* Required Experience Level */}
        <p className="text-neutral/60 text-sm font-semibold">
          Required Experience Level
        </p>

        <section className="w-full col-span-2 flex flex-row justify-between my-2">
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

        <ErrorMessage>{firstError.experienceLevel}</ErrorMessage>

        <p className="text-neutral/60 text-sm font-semibold -mb-3">
          Requirements for the job
        </p>

        {/* Requirements Inputs */}
        <div className="w-full flex flex-col gap-y-2">
          {jobData.requirements.map((req, index) => {
            return (
              <div key={index} className="flex flex-row">
                <p className="w-[3ch] text-neutral text-center bg-transparent flex items-center">
                  {index + 1}.
                </p>

                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementsChange(e, index)}
                  className="w-full text-neutral text-sm px-2 py-1 bg-transparent border-2 border-r-0 border-main focus:outline-none"
                />

                <button
                  onClick={() => handleDeleteRequirements(index)}
                  className="bg-red rounded-r-md"
                >
                  <XIcon className="!text-neutral" />
                </button>
              </div>
            );
          })}
        </div>

        {jobData.requirements.length < 10 && (
          <button
            onClick={handleAddRequirements}
            className="text-neutral bg-blue-700 rounded-md flex items-center gap-x-1 px-4"
          >
            Add <PlusIcon />
          </button>
        )}
      </div>
    </>
  );
};

// Step 3
const CompanyDetails = ({
  jobData,
  firstError,
  handleInputChange,
  handleLocationChange,
}) => {
  return (
    <>
      <Title>Company Information</Title>

      <div className="flex flex-col">
        {/* Company */}
        <FloatingLabelInput
          label="Company Name"
          name="companyName"
          type="text"
          id="companyName"
          value={jobData.companyName}
          handleInputChange={handleInputChange}
        />

        <ErrorMessage>{firstError.companyName}</ErrorMessage>

        {/* Countries && State*/}
        <CountryStateSelect
          country={jobData.location.country}
          state={jobData.location.state}
          onLocationChange={handleLocationChange}
          className="w-full"
        />
      </div>
    </>
  );
};

// Step 4
const DeadlineJobs = ({ jobData, handleDateChange }) => {
  return (
    <>
      <Title>Deadline Date for Job application</Title>
      {/* Last Submission Date */}
      {/* <DateInput
        label="Last Submission Date"
        id="lastSubmissionDate"
        name="lastSubmissionDate"
        value={jobData.lastSubmissionDate}
        handleInputChange={handleInputChange}
      /> */}
    </>
  );
};

const CreateJobMultiStep = ({ onClose }) => {
  const { createJob } = useJobStore();

  const initialJobData = {
    title: "",
    salary: "",
    category: [""],
    otherCategory: "",
    maximumWorkers: "",
    description: "",
    experienceLevel: "",
    requirements: [],
    companyName: "",
    location: {
      country: "",
      state: "",
    },
    lastSubmissionDate: "",
  };

  const [jobData, setJobData] = useState(initialJobData);
  const [firstError, setFirstError] = useState({});
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

  const handleExperienceLevelChange = (e) => {
    setJobData((pre) => ({
      ...pre,
      experienceLevel: e.target.value,
    }));
  };

  const handleDateChange = (value) => {
    console.log(value);

    setJobData((pre) => ({
      ...pre,
      lastSubmissionDate: value,
    }));
  };

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <JobDetails
        jobData={jobData}
        firstError={firstError}
        handleInputChange={handleInputChange}
        handleCategoryChange={handleCategoryChange}
      />,
      <CandidateRequirements
        jobData={jobData}
        firstError={firstError}
        handleExperienceLevelChange={handleExperienceLevelChange}
        setJobData={setJobData}
      />,
      <CompanyDetails
        jobData={jobData}
        firstError={firstError}
        handleInputChange={handleInputChange}
        handleLocationChange={handleLocationChange}
      />,
      <DeadlineJobs
        jobData={jobData}
        firstError={firstError}
        handleDateChange={handleDateChange}
      />,
    ]);

  const validateStep = async () => {
    try {
      await validationSchema[currentStepIndex].validate(jobData, {
        abortEarly: false,
      });
      setFirstError({});
      return true;
    } catch (err) {
      if (err.inner && err.inner.length > 0) {
        // Get only the first error
        const errorFirst = err.inner[0];

        setFirstError({ [errorFirst.path]: errorFirst.message });
      } else {
        setFirstError({});
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) next();
  };

  const handleSubmit = async () => {
    const isValid = await validateStep();

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      let res = await createJob(jobData);

      AlertBox({
        title: "Wait for Admin's Approval",
        text: res.message,
        icon: "success",
      });

      setJobData(initialJobData);
    } catch (error) {
      AlertBox({ title: "Error", text: error.message, icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-sideSpacing">
        <div className="w-full bg-primary shadow-md shadow-main rounded-md p-4 flex flex-col relative">
          {/* X Button */}
          <motion.button
            variants={{
              initial: {
                scale: 1,
              },
              hover: {
                scale: 1.05,
              },
              tap: {
                scale: 0.9,
              },
            }}
            whileHover="hover"
            whileTap="tap"
            transition={{
              duration: 0.1,
            }}
            className="absolute top-3 right-3 z-10"
            onClick={onClose}
          >
            <XIcon className="!bg-red !text-neutral transition-all duration-200 hover:border-neutral shadow-sm shadow-gray" />
          </motion.button>

          <h2 className="text-xl text-main font-medium  text-center">
            Create new Job
          </h2>

          <p className="text-neutral/75 text-sm">
            Step {currentStepIndex + 1} of {steps.length}
          </p>

          {/* Slider Container */}
          <div className="w-full flex-grow overflow-x-hidden customScrollbarStyle">
            {/* Form & Slider */}
            <form
              className="w-full flex flex-row transition-transform duration-500"
              style={{
                transform: `translateX(-${
                  currentStepIndex * (100 / steps.length)
                }%)`,
                width: `${steps.length * 100}%`,
              }}
            >
              {/* Slides */}
              {steps.map((step, index) => {
                return (
                  <div
                    key={index}
                    className="w-full overflow-y-auto customScrollbarStyle flex flex-col"
                    style={{
                      width: `${100 / steps.length}%`,
                    }}
                  >
                    {step}
                  </div>
                );
              })}
            </form>
          </div>

          {/* Action Button */}
          <div className="flex flex-row justify-between items-center gap-4 mt-4">
            <motion.button
              variants={{
                initial: {
                  scale: 1,
                },
                hover: {
                  scale: 1.05,
                },
                tap: {
                  scale: 0.9,
                },
              }}
              // whileHover="hover"
              // whileTap="tap"
              layout
              transition={{
                duration: 0.2,
              }}
              disabled={isFirstStep}
              onClick={back}
              className="min-w-20 text-neutral/75 font-medium bg-red/75 rounded-md py-1 cursor-pointer hover:text-neutral hover:bg-red disabled:bg-gray/60 disabled:cursor-not-allowed"
            >
              Back
            </motion.button>

            <p className="text-neutral/80 text-sm font-medium">
              {currentStepIndex + 1} / {steps.length}
            </p>

            <motion.button
              variants={{
                initial: {
                  scale: 1,
                },
                hover: {
                  scale: 1.05,
                },
                tap: {
                  scale: 0.9,
                },
              }}
              // whileHover="hover"
              // whileTap="tap"
              layout
              transition={{
                duration: 0.2,
              }}
              disabled={isSubmitting}
              onClick={isLastStep ? handleSubmit : handleNext}
              className="min-w-20 text-neutral/75 font-medium bg-main/75 rounded-md py-1 cursor-pointer hover:text-neutral hover:bg-main disabled:bg-gray disabled:cursor-not-allowed"
            >
              {isLastStep ? (
                isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin mx-auto" />
                ) : (
                  "Sign Up"
                )
              ) : (
                "Next"
              )}
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateJobMultiStep;
