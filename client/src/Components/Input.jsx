import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Country, State } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Components
import { LoaderCircleIcon, PlusIcon, UploadIcon, XIcon } from "./Icons";

// React Icons
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Copy, CircleCheckBig } from "lucide-react";

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
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    "&:hover": {
      borderColor: state.isFocused ? "rgb(var(--neutral))" : "rgb(var(--main))", // Keep hover consistent with focus
    },
  }),
  input: (base) => ({
    ...base,
    color: "rgb(var(--neutral), 0.7)", // Set the text color here
    fontSize: "12px",
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    whiteSpace: "nowrap",
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

export const CopyableText = ({ text, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {text && (
        <div
          title="Click to copy"
          className={`w-full text-lg bg-neutral rounded-md relative overflow-hidden ${className}`}
        >
          <div className="text-black/80 font-medium text-sm text-nowrap p-2">
            {text}
          </div>

          <motion.button
            variants={{
              initial: { boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" },
              final: { boxShadow: "inset 4px 4px 10px rgba(99, 99, 99, 1)" },
            }}
            whileTap="final"
            transition={{
              duration: 0.1,
            }}
            onClick={handleCopy}
            className={`h-full aspect-square rounded-md flex justify-center items-center absolute right-0 top-0 ${
              copied && "bg-green-500"
            }`}
          >
            {copied ? (
              <CircleCheckBig
                size={20}
                className="text-neutral font-extrabold"
              />
            ) : (
              <Copy size={20} />
            )}
          </motion.button>
        </div>
      )}
    </>
  );
};

export const FloatingLabelInput = ({
  label,
  name,
  type = "text",
  id,
  value,
  checked,
  readOnly,
  handleInputChange,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Watch for changes in value and set focus state
  useEffect(() => {
    if (value) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  }, [value]);

  return (
    <>
      <div className="w-full relative">
        <label
          htmlFor={id}
          className={`leading-[1] transition-all duration-200 ease-in absolute ${
            isFocused
              ? "text-white text-[12px] bg-primary -top-[7px] left-2"
              : "text-white/40 text-[16px] bg-transparent top-[30%] left-4"
          } ${className}`}
        >
          {label}
        </label>

        <input
          type={type}
          id={id}
          name={name}
          value={value}
          checked={checked}
          readOnly={readOnly}
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

export const DateInput = ({ label, name, id, value, handleInputChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleContainerClick = (e) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div
        className="w-full relative"
        onClick={handleContainerClick}
        style={{ cursor: "pointer" }}
      >
        <label htmlFor={id} className="text-neutral/60 text-xs font-semibold">
          {label}
        </label>

        <input
          type="date"
          id={id}
          name={name}
          value={value}
          ref={inputRef}
          onChange={(e) => handleInputChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(value ? true : false)}
          className={`${customStyles} pr-4`}
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

export const RadioInput = ({
  label,
  name,
  value,
  id,
  checked,
  handleInputChange,
  className,
}) => {
  return (
    <>
      <div className={`flex items-center gap-1 ${className}`}>
        <input
          type="radio"
          name={name}
          value={value}
          id={id}
          checked={checked}
          onChange={(e) => handleInputChange(e)}
          className="peer hidden"
        />

        <label
          htmlFor={id}
          className="min-w-[8ch] text-white/60 mobilesm:text-xs md:text-sm text-center border-2 border-main/60 rounded-md py-1 cursor-pointer peer-checked:text-white peer-checked:bg-main px-2"
        >
          {label}
        </label>
      </div>
    </>
  );
};

export const PhoneNumberInput = ({ value, handlePhoneNumberChange }) => {
  const handleInputChange = (phone, countryData) => {
    const { dialCode } = countryData;

    // Extract raw number (remove country code)
    const rawNumber = phone.startsWith(dialCode)
      ? phone.slice(dialCode.length)
      : phone;

    // Validate phone number length
    if (rawNumber.length <= 10) {
      handlePhoneNumberChange(phone);
    }
  };

  return (
    <PhoneInput
      country={"us"}
      value={value}
      onChange={(phone, countryData) => handleInputChange(phone, countryData)}
    />
  );
};

export const FileUpload = ({
  label,
  name,
  id,
  img,
  accept,
  handleUpload,
  className,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;

      setIsUploadingFile(true);
      setSelectedFile(base64Image);

      try {
        let res = await handleUpload(base64Image);
        toast.success(res.message);
      } catch (error) {
        setSelectedFile(null);
      } finally {
        setIsUploadingFile(false);
      }
    };
  };

  return (
    <>
      <div className="w-full aspect-video border-2 border-neutral/60 border-dashed rounded-md relative overflow-hidden">
        {(selectedFile || img) && (
          <img
            src={selectedFile || img}
            alt={label}
            loading="lazy"
            className={`absolute ${isUploadingFile && "animate-pulse"}`}
          />
        )}

        <label
          htmlFor={id}
          className="w-full h-full text-neutral text-sm flex flex-row justify-center items-center absolute z-10"
        >
          {isUploadingFile
            ? "Uploading..."
            : `Click here to Upload your ${label}`}
        </label>

        <input
          type="file"
          name={name}
          id={id}
          disabled={isUploadingFile}
          accept={accept || "image/*"}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </>
  );
};

export const PDFUpload = ({ handlePdfUpload, className }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploadingFile(true);

    try {
      const res = await handlePdfUpload(formData);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the input field
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <>
      <div
        className={`w-full border-2 border-neutral/50 rounded-md shadow-md shadow-gray flex flex-row justify-center p-2 ${className}`}
      >
        {!selectedFile && (
          <>
            <input
              ref={fileInputRef} // Attach the ref to the input
              id="pdfupload"
              type="file"
              accept="application/pdf"
              disabled={isUploadingFile}
              onChange={handleChange}
              className="hidden"
            />

            <label
              htmlFor="pdfupload"
              className="text-neutral font-medium bg-blue-700 rounded-md px-2 py-1"
            >
              Upload New PDF
            </label>
          </>
        )}

        {selectedFile && (
          <div className="w-full h-full px-2 relative">
            <p className="text-neutral text-sm font-medium text-center col-span-4">
              Selected PDF
            </p>

            <XIcon
              size={26}
              handleClick={() => setSelectedFile(null)}
              className="!bg-red !text-neutral absolute top-0 right-2"
            />

            <div className="flex flex-row justify-between items-center py-2">
              <div className="flex flex-col">
                <p className="text-neutral/80 col-span-3">
                  Name:{" "}
                  <span className="text-neutral font-medium">
                    {selectedFile.name}
                  </span>
                </p>

                <p className="text-neutral/80 col-span-3">
                  Size:{" "}
                  <span className="text-neutral font-medium">
                    {Number(selectedFile.size / 1024).toFixed(2)} KB
                  </span>{" "}
                </p>
              </div>

              <button
                disabled={isUploadingFile}
                onClick={handleUpload}
                className="text-neutral bg-customBlue rounded-md cursor-pointer hover:scale-110 px-2 py-1 disabled:bg-gray disabled:cursor-not-allowed"
              >
                {isUploadingFile ? (
                  <LoaderCircleIcon className="animate-spin m-auto" />
                ) : (
                  <UploadIcon className="m-auto" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const SelectSimple = ({
  options,
  value,
  name,
  placeholder,
  handleSelect,
  className,
}) => {
  return (
    <>
      <Select
        name={name}
        options={options}
        value={value ? options.find((o) => o.label === value) : null}
        onChange={(selectedValue) => handleSelect(selectedValue)}
        placeholder={placeholder}
        styles={customSelectStyles}
        className={`w-full ${className}`}
      />
    </>
  );
};

export const CountryStateSelect = ({
  country,
  state,
  onLocationChange,
  className,
}) => {
  const [countries, setCountries] = useState(
    Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }))
  );
  const [states, setStates] = useState([]);

  const handleCountryChange = (selectedCountry) => {
    const newCountry = {
      country: selectedCountry.label,
      state: "", // Reset state when country changes
    };

    setStates([]);
    onLocationChange(newCountry);

    // Update states dropdown
    setStates(
      State.getStatesOfCountry(selectedCountry.value).map((s) => ({
        key: s.isoCode,
        value: s.isoCode,
        label: s.name,
      }))
    );
  };

  const handleStateChange = (selectedState) => {
    const newState = { state: selectedState.label };
    onLocationChange(newState);
  };

  useEffect(() => {
    if (country) {
      // Update states dropdown
      const updatedStates = State.getStatesOfCountry(
        countries.find((c) => c.label === country)?.value || ""
      ).map((s) => ({
        key: s.isoCode,
        value: s.isoCode,
        label: s.name,
      }));
      setStates(updatedStates);
    }
  }, [country, countries]);

  return (
    <>
      <div className={`flex flex-row items-center gap-x-2 ${className}`}>
        <Select
          name="country"
          options={countries}
          value={countries.find((c) => c.label === country) || null}
          onChange={(selectedOption) => handleCountryChange(selectedOption)}
          placeholder="Select country"
          styles={customSelectStyles}
          className={`w-full ${className}`}
        />

        <Select
          name="state"
          options={states}
          value={states.find((s) => s.label === state) || null}
          onChange={(selectedOption) => handleStateChange(selectedOption)}
          placeholder="States"
          styles={customSelectStyles}
          className={`w-full ${className}`}
        />
      </div>
    </>
  );
};

export const SortSelect = ({ value, handleSortChange, className }) => {
  const options = [
    { value: "low_to_high", label: "Salary: Low to High" },
    { value: "high_to_low", label: "Salary: High to Low" },
  ];

  return (
    <>
      <Select
        name="sort"
        options={options}
        value={options.find((sortBy) => sortBy.value === value) || null}
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
  placeholder,
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
        placeholder={placeholder || "Select upto 5 categories"}
        isSearchable
        styles={customSelectStyles}
        className={`${className}`}
      />
    </>
  );
};

export const SocialMediaSelect = ({
  options,
  handleAddSocialLink,
  className,
}) => {
  const [link, setLink] = useState("");
  const [selectedSocial, setSelectedSocial] = useState(null);

  const handleSelect = (e) => {
    setSelectedSocial(e.value);
  };

  const handleChange = (e) => {
    setLink(e.target.value);
  };

  const handleAddSocial = () => {
    if (!selectedSocial) {
      toast.error("Select Social Media First");
      return;
    }

    if (!link) {
      toast.error("Enter a valid URL");
      return;
    }

    handleAddSocialLink(link, selectedSocial);

    setLink("");
  };

  return (
    <>
      <div className="w-full flex flex-row">
        <Select
          options={options}
          value={options.find((opt) => opt.value === selectedSocial) || null}
          placeholder="Select an option..."
          onChange={handleSelect}
          styles={customSelectStyles}
          className={`w-3/12 ${className}`}
        />

        <input
          type="url"
          name="socialLink"
          id="socialLink"
          value={link}
          placeholder="Link here..."
          onChange={handleChange}
          className={`w-6/12 ${customStyles} border-r-0 rounded-none`}
        />

        <button
          onClick={handleAddSocial}
          className="w-3/12 text-neutral text-sm font-medium bg-customBlue border-none outline-none rounded-r-md cursor-pointer px-1"
        >
          <PlusIcon className="m-auto" />
        </button>
      </div>
    </>
  );
};

export const SalaryRange = ({ query = {}, handleSalaryChange, className }) => {
  const { minSalary, maxSalary } = query;

  const minRange = 200;
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

export const SalaryInputWithCurrency = ({
  id,
  name,
  value,
  handleSalaryChange,
  className,
}) => {
  return (
    <div className={`flex flex-row ${className}`}>
      <input
        id={id}
        name={name}
        type="number"
        value={value}
        placeholder="Salary"
        onChange={handleSalaryChange}
        className={`${customStyles} rounded-tr-none rounded-br-none`}
        style={{
          MozAppearance: "textfield",
          WebkitAppearance: "none",
          appearance: "none",
        }}
      />
    </div>
  );
};

export const TextAreaFloatingLabel = ({
  label,
  name,
  id,
  value,
  handleInputChange,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsFocused(false);
    }
  }, [value]);

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
        className={`min-h-20 max-h-36 overflow-y-auto customScrollbarStyle ${customStyles} ${className}`}
      ></textarea>
    </div>
  );
};
