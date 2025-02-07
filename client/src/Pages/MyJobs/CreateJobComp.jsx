import { useState } from "react";

// React-Icons
import { IoClose } from "react-icons/io5";

// Component
import {
  FloatingLabelInput,
  TextAreaFloatingLabel,
  SalaryInputWithCurrency,
  CountrySelect,
} from "../../Components/Input";

export const CreateJobComp = ({ onClose }) => {
  const initialJobData = {
    title: "",
    description: "",
    salary: "",
    location: {
      country: "",
      state: "",
    },
  };

  const [jobData, setJobData] = useState(initialJobData);

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setJobData((pre) => ({ ...pre, [name]: value }));
  };

  const handleSalaryChange = () => {};

  const handleCountryChange = (selectedCountry) => {
    setJobData((pre) => ({
      ...pre,
      location: {
        ...pre.location,
        country: selectedCountry,
      },
    }));
  };

  return (
    <>
      <section
        className="w-4/5 bg-primary rounded-md shadow-md shadow-main fixed top-menuHeight z-40 flex flex-col gap-y-4 px-8 py-10"
        style={{
          width: "calc(100% - (2 * var(--sideSpacing)))",
          height: "calc(100vh - var(--menuHeight) - var(--sideSpacing))",
          top: "calc(var(--menuHeight) + (var(--sideSpacing) / 5))",
        }}
      >
        {/* Close Button */}
        <button
          className="font-medium text-neutral bg-red p-1 rounded-md absolute top-2 right-2 z-20 transition-all duration-200 hover:scale-110"
          onClick={onClose}
        >
          <IoClose style={{ color: "", fontSize: "20px" }} />
        </button>

        <FloatingLabelInput
          label="Title"
          name="title"
          id="title"
          value={jobData.title}
          handleInputChange={handleInputChange}
        />

        {/* Countries && State*/}
        <div className="w-full flex flex-row">
          <CountrySelect country={jobData.country} className="w-1/2" />
        </div>

        {/* Salary */}
        <div className="flex flex-row items-center gap-x-1">
          <SalaryInputWithCurrency className="w-4/5" />

          <p className="text-neutral text-sm font-medium">/month</p>
        </div>

        <TextAreaFloatingLabel
          label="Description"
          name="description"
          id="description"
          value={jobData.description}
          handleInputChange={handleInputChange}
        />
      </section>
    </>
  );
};

export default CreateJobComp;
