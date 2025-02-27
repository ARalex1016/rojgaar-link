import { useState, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// React Icons
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

// Mui
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

// Store
import { useJobStore } from "../Store/useJobStore";

const customStyles =
  "w-full text-white text-base bg-transparent border-2 border-main/80 outline-none focus:border-white pl-3 py-2 rounded-md mobilesm:text-sm sm:text-base";

// Custom Styles for React Select
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "rgb(var(--primary))",
    borderColor: state.isFocused
      ? "rgb(var(--neutral), 0.8)"
      : "rgb(var(--main))",
    borderWidth: "2px", // Set the border width explicitly
    borderRadius: "6px",
    boxShadow: "none", // Ensure no extra shadow appears on focus
    "&:hover": {
      borderColor: state.isFocused ? "rgb(var(--neutral))" : "rgb(var(--main))", // Keep hover consistent with focus
    },
  }),
  // Other styles remain unchanged
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    backgroundColor: state.isSelected
      ? "rgb(var(--main))"
      : state.isFocused
      ? "rgba(var(--main), 0.6)"
      : "rgb(var(--neutral))",
    color: state.isSelected ? "white" : "black",
    padding: "0.5rem",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgba(var(--neutral), 0.8)",
    fontSize: "12px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "rgb(var(--neutral))",
    fontSize: "12px",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "rgba(var(--neutral), 0.6)",
    "&:hover": {
      color: "rgba(var(--neutral))",
    },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    padding: "0",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "rgba(var(--main), 0.3)",
    borderRadius: "6px",
    padding: "0 2px",
    "&:hover": {
      backgroundColor: "rgba(var(--main), 0.5)",
    },
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "rgb(var(--neutral))",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "rgb(var(--red))",
    transition: "background-color 0.1s ease, color 0.1s ease",
    "&:hover": {
      color: "rgb(var(--red))",
      backgroundColor: "rgb(var(--red), 0.2)",
    },
  }),
  clearIndicator: (base, state) => ({
    ...base,
    color: "rgb(var(--red))", // Set the color to red
    transition: "color 0.2s ease",
    "&:hover": {
      color: "rgba(var(--red))",
      backgroundColor: "rgb(var(--red), 0.2)",
    },
  }),
};

export const FloatingLabelInput = ({
  label,
  name,
  type = "text",
  id,
  value,
  handleInputChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className="w-full relative">
        <label
          htmlFor={id}
          className={`leading-[1] transition-all duration-200 ease-in absolute ${
            isFocused
              ? "text-white text-[12px] bg-primary -top-[7px] left-2"
              : "text-white/40 text-[18px] bg-transparent top-[30%] left-4"
          }`}
        >
          {label}
        </label>

        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={(e) => handleInputChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(value ? true : false)}
          className={customStyles}
          style={{
            backgroundColor: "transparent",
          }}
        />

        <style>
          {`
          input:-webkit-autofill {
            background-color: rgb(var(--primary)) !important;
            color: white !important;
          }
        `}
        </style>
      </div>
    </>
  );
};

export const PasswordInput = ({
  label,
  name,
  id,
  value,
  handleInputChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="w-full relative">
        <FloatingLabelInput
          label={label}
          name={name}
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          handleInputChange={handleInputChange}
        />

        {showPassword ? (
          <IoMdEyeOff
            onClick={() => setShowPassword(false)}
            className="text-white/40 absolute top-[30%] right-[5%]"
          />
        ) : (
          <IoMdEye
            onClick={() => setShowPassword(true)}
            className="text-white/60 absolute top-[30%] right-[5%]"
          />
        )}
      </div>
    </>
  );
};

export const RadioInput = ({ label, name, value, id, handleInputChange }) => {
  return (
    <>
      <div className="flex items-center gap-1">
        <input
          type="radio"
          name={name}
          value={value}
          id={id}
          onChange={(e) => handleInputChange(e)}
          className="peer hidden"
        />
        <label
          htmlFor={id}
          className="w-[8ch] text-white/60 text-sm text-center border-2 border-main/60 rounded-md py-1 cursor-pointer peer-checked:text-white peer-checked:bg-main"
        >
          {label}
        </label>
      </div>
    </>
  );
};

export const CountrySelect = ({ country, handleCountryChange, className }) => {
  const countries = countryList().getData();

  return (
    <>
      <Select
        name="country"
        options={countries}
        value={country}
        onChange={handleCountryChange}
        placeholder="Select country"
        styles={customSelectStyles}
        className={`w-full ${className}`}
      />
    </>
  );
};

export const SortSelect = ({ handleSortChange, className }) => {
  const options = [
    { value: "low_to_high", label: "Salary: Low to High" },
    { value: "high_to_low", label: "Salary: High to Low" },
  ];

  return (
    <>
      <Select
        name="sort"
        options={options}
        onChange={handleSortChange}
        placeholder="Sort by"
        styles={customSelectStyles}
        className={`w-full ${className}`}
      />
    </>
  );
};

export const CategorySelect = ({
  selectedCategory,
  handleCategoryChange,
  className,
}) => {
  const { categories } = useJobStore();

  const selectedOptions = categories?.filter((category) =>
    selectedCategory.includes(category)
  );

  return (
    <>
      <Select
        isMulti
        options={categories?.map((category) => ({
          value: category,
          label: category,
        }))}
        value={selectedOptions?.map((category) => ({
          value: category,
          label: category,
        }))}
        onChange={(selected) =>
          handleCategoryChange(selected ? selected.map((opt) => opt.value) : [])
        }
        placeholder="Select upto 5 categories"
        isSearchable
        styles={customSelectStyles}
        className={`${className}`}
      />
    </>
  );
};

export const SalaryRange = ({ query = {}, handleSalaryChange, className }) => {
  const { minSalary, maxSalary } = query;

  const minRange = 400;
  const maxRange = 5000;

  // Function to display the values in the slider (value in dollars)
  function salarytext(salaryRange) {
    return `$${salaryRange}`;
  }

  // Minimum distance between the two slider thumbs
  const minDistance = 100;

  // Handling the slider change event
  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    // Ensuring the range is valid
    if (activeThumb === 0) {
      handleSalaryChange(
        Math.min(newValue[0], maxSalary - minDistance),
        maxSalary
      );
    } else {
      handleSalaryChange(
        minSalary,
        Math.max(newValue[1], minSalary + minDistance)
      );
    }
  };

  return (
    <>
      <div className={`${className}`}>
        <div className="flex flex-row gap-x-2 items-center">
          <p className="text-neutral/60 text-xs">Salary Range</p>

          {/* Display Selected Range */}
          <p className="text-text text-sm font-bold">
            ${minSalary} - $
            {maxSalary === maxRange ? maxSalary + "+" : maxSalary}
          </p>
        </div>

        <Box sx={{ width: "100%" }}>
          <Slider
            getAriaLabel={() => "Salary range"}
            value={[minSalary, maxSalary]}
            onChange={handleChange}
            valueLabelDisplay="auto"
            valueLabelFormat={salarytext}
            disableSwap
            min={minRange}
            max={maxRange}
            sx={{
              color: "rgb(var(--main), 0.8)", // Custom color for the track and thumb
              // height: 8, // Custom height for the track
              "& .MuiSlider-thumb": {
                width: 20, // Custom size for the thumb
                height: 20,
                backgroundColor: "rgb(var(--main), 0.8)", // Custom color for the thumb (circle)
                borderRadius: "50%", // Make the thumb circular
                "&:hover": {
                  backgroundColor: "rgb(var(--main))", // Change color on hover
                },
              },
              "& .MuiSlider-track": {
                height: 6, // Track height
                borderRadius: 4, // Rounded track edges
              },
              "& .MuiSlider-rail": {
                opacity: 0.3, // Slightly faded rail for better aesthetics
                backgroundColor: "rgb(var(--main), 0.6)",
                height: 6,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </div>
    </>
  );
};

export const TextAreaFloatingLabel = ({
  label,
  name,
  id,
  value,
  handleInputChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full relative">
      <label
        htmlFor={id}
        className={`leading-[1] transition-all duration-200 ease-in absolute ${
          isFocused
            ? "text-white text-[12px] bg-primary -top-[7px] left-2"
            : "text-white/40 text-[18px] bg-transparent top-4 left-4"
        }`}
      >
        {label}
      </label>

      <textarea
        label={label}
        name={name}
        id={id}
        value={value}
        onChange={(e) => handleInputChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value ? true : false)}
        className={`min-h-20 max-h-36 ${customStyles}`}
      ></textarea>
    </div>
  );
};

export const SalaryInputWithCurrency = ({ currency, className }) => {
  const currencies = [{ label: "$ (USD)", value: "$" }];

  const defaultCurrency = currency || currencies[0].value;

  const handleCurrencyChange = (value) => {
    // console.log(value);
  };

  return (
    <div className={`flex flex-row ${className}`}>
      <input
        type="number"
        placeholder="Salary"
        className={customStyles}
        style={{
          MozAppearance: "textfield",
          WebkitAppearance: "none",
          appearance: "none",
        }}
      />

      <Select
        name={currency}
        options={currencies}
        value={currencies.find((c) => c.value === defaultCurrency)}
        onChange={(selectedOption) => handleCurrencyChange(selectedOption)}
        placeholder=""
        styles={customSelectStyles}
      />
    </div>
  );
};
