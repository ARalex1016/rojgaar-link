import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

// Components
import {
  FloatingLabelInput,
  CountryStateSelect,
  RadioInput,
  DateInput,
  PasswordInput,
} from "../../Components/Input";
import { LoaderCircleIcon } from "./../../Components/Icons";
import { AlertBox } from "../../Components/AlertBox";
import TermsAndConditions from "../TermsAndConditions";
import { CircleXIcon, CircleCheckBigIcon } from "./../../Components/Icons";

// Custom Hooks
import { useMultiStepForm } from "../../Hooks/useMultiStepForm";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

// Validation schema
const validationSchema = [
  yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10,}$/, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    dateOfBirth: yup
      .date()
      .required("Date of Birth is required")
      .typeError("Enter a valid date")
      .max(new Date(), "Date of Birth cannot be in the future")
      .test(
        "is-18-years-old",
        "You must be at least 18 years old",
        (value) =>
          value && new Date(value) <= new Date(Date.now() - 567648000000) // Check if date is at least 18 years ago
      ),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "Gender is required")
      .required("Gender is required"),
  }),
  yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  yup.object().shape({
    location: yup.object().shape({
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
    }),
    termsAccepted: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions"),
  }),
];

const Title = ({ children, className }) => {
  return (
    <h2 className={`text-neutral/75 text-base text-center mb-4 ${className}`}>
      {children}
    </h2>
  );
};

const ErrorMessage = ({ visibility = false, children, className }) => {
  return (
    <p
      className={`text-red text-xs transition-opacity duration-0 py-[2px] ${
        visibility ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {visibility ? children : "Error"}
    </p>
  );
};

const ValidIcon = ({ validate = false }) => {
  return (
    <>
      {validate ? (
        <CircleCheckBigIcon size={18} className="text-customGreen" />
      ) : (
        <CircleXIcon size={18} className="text-red" />
      )}
    </>
  );
};

const PasswordValidation = ({ userData }) => {
  const [validationStatus, setValidationStatus] = useState({
    minLength: false,
    maxLength: false,
    uppercase: false,
    lowercase: false,
    digit: false,
  });

  let listClasses = "flex flex-row items-center gap-x-2";

  const validatePassword = (value) => {
    // Check password against each rule in the schema
    setValidationStatus({
      minLength: value.length >= 8,
      maxLength: value.length <= 20,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      digit: /\d/.test(value),
    });
  };

  useEffect(() => {
    const password = userData.password;

    validatePassword(password);
  }, [userData.password]);

  return (
    <>
      <ul className="text-neutral/75 text-xs flex flex-col gap-y-1">
        <li className={listClasses}>
          <ValidIcon validate={validationStatus.uppercase} /> At least one
          uppercase letter
        </li>

        <li className={listClasses}>
          <ValidIcon validate={validationStatus.lowercase} /> At least one
          lowercase letter
        </li>

        <li className={listClasses}>
          <ValidIcon validate={validationStatus.digit} /> At least one number
        </li>

        <li className={listClasses}>
          <ValidIcon
            validate={validationStatus.minLength && validationStatus.maxLength}
          />
          Must be between 8 to 20 characters
        </li>
      </ul>
    </>
  );
};

// Step 1
const PersonalDetails = ({ userData, firstError, handleInputChange }) => {
  return (
    <>
      <Title>Personal Information</Title>

      <div className="flex flex-col">
        {/* Title */}
        <FloatingLabelInput
          label="Name"
          name="name"
          id="name"
          value={userData.name}
          handleInputChange={handleInputChange}
        />
        {
          <ErrorMessage visibility={firstError.name}>
            {firstError.name}
          </ErrorMessage>
        }

        {/* Email */}
        <FloatingLabelInput
          label="Email"
          name="email"
          id="email"
          value={userData.email}
          handleInputChange={handleInputChange}
        />
        <ErrorMessage visibility={firstError.email}>
          {firstError.email}
        </ErrorMessage>

        {/* Phone Number */}
        <FloatingLabelInput
          label="Phone Number"
          type="number"
          name="phone"
          id="phone"
          value={userData.phone}
          handleInputChange={handleInputChange}
        />
        <ErrorMessage visibility={firstError.phone}>
          {firstError.phone}
        </ErrorMessage>

        {/* Date of Birth */}
        <DateInput
          label="Date of Birth"
          name="dateOfBirth"
          id="dateOfBirth"
          value={userData.dateOfBirth}
          handleInputChange={handleInputChange}
        />

        <ErrorMessage visibility={firstError.dateOfBirth}>
          {firstError.dateOfBirth}
        </ErrorMessage>

        {/* Gender Radio Input */}

        <div className="flex justify-between">
          <RadioInput
            label="Male"
            name="gender"
            value="male"
            id="male"
            checked={userData.gender === "male"}
            handleInputChange={handleInputChange}
          />

          <RadioInput
            label="Female"
            name="gender"
            value="female"
            id="female"
            checked={userData.gender === "female"}
            handleInputChange={handleInputChange}
          />

          <RadioInput
            label="Other"
            name="gender"
            value="other"
            id="other"
            checked={userData.gender === "other"}
            handleInputChange={handleInputChange}
          />
        </div>

        <ErrorMessage visibility={firstError.gender}>
          {firstError.gender}
        </ErrorMessage>
      </div>
    </>
  );
};

// Step 2
const AccountSecurityDetails = ({
  userData,
  firstError,
  handleInputChange,
}) => {
  return (
    <>
      <Title>Account Security</Title>

      <div className="flex flex-col gap-y-4">
        <PasswordValidation userData={userData} />

        {/* Password */}
        <PasswordInput
          label="Password"
          name="password"
          id="password"
          value={userData.password}
          handleInputChange={handleInputChange}
        />
        {/* <ErrorMessage visibility={firstError.password}>
          {firstError.password}
        </ErrorMessage> */}

        {/* Confirm Password */}
        <div>
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            value={userData.confirmPassword}
            handleInputChange={handleInputChange}
          />
          <ErrorMessage visibility={firstError.confirmPassword}>
            {firstError.confirmPassword}
          </ErrorMessage>
        </div>
      </div>
    </>
  );
};

// Step 3
const LocationDetails = ({ userData, firstError, handleLocationChange }) => {
  return (
    <>
      <Title>Location</Title>

      <div className="w-full h-full flex flex-col items-start gap-y-4 overflow-visible relative">
        {/* Countries && State*/}
        <CountryStateSelect
          country={userData.location.country}
          state={userData.location.state}
          onLocationChange={handleLocationChange}
          className="w-full"
        />
        {!firstError["location.state"] && (
          <ErrorMessage visibility={firstError["location.country"]}>
            {firstError["location.country"]}
          </ErrorMessage>
        )}

        <ErrorMessage visibility={firstError["location.state"]}>
          {firstError["location.state"]}
        </ErrorMessage>
      </div>
    </>
  );
};

const SignupMultiStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleFromState = location.state?.role || "";

  const { isSigningIn, signup } = useAuthStore();

  const initialData = {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    location: {
      country: "",
      state: "",
    },
    termsAccepted: false,
  };

  const [userData, setUserData] = useState(initialData);
  const [firstError, setFirstError] = useState({});
  const [openTermsAndCondition, setOpenTermsAndCondition] = useState(false);

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setUserData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleLocationChange = (newLocation) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      location: {
        ...prevUserData.location,
        ...newLocation,
      },
    }));
  };

  const handleTermsChange = (value) => {
    setUserData((pre) => ({
      ...pre,
      termsAccepted: value.target.checked,
    }));
  };

  useEffect(() => {
    if (roleFromState === "creator") {
      setUserData((prev) => ({ ...prev, role: "creator" }));
    }
  }, [roleFromState, userData?.role]);

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([
      <PersonalDetails
        userData={userData}
        firstError={firstError}
        handleInputChange={handleInputChange}
      />,
      <AccountSecurityDetails
        userData={userData}
        firstError={firstError}
        handleInputChange={handleInputChange}
      />,
      <LocationDetails
        userData={userData}
        firstError={firstError}
        handleLocationChange={handleLocationChange}
      />,
    ]);

  const validateStep = async () => {
    try {
      await validationSchema[currentStepIndex].validate(userData, {
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

  const handleSignUp = async () => {
    const isValid = await validateStep();

    if (!isValid) return;

    // Sign Up
    try {
      const res = await signup(userData);

      setUserData(initialData);
      AlertBox({ title: res.message, icon: "success" });

      navigate("/jobs");
    } catch (error) {
      AlertBox({ title: error.message, icon: "error" });
    }
  };

  return (
    <>
      <div className="w-full h-[75vh] mt-4">
        <section className="w-full bg-primary shadow-md shadow-main rounded-md p-4 flex flex-col relative">
          <p className="text-neutral/75 text-xs font-medium absolute top-2 left-4">
            Step {currentStepIndex + 1} of {steps.length}
          </p>

          <h2 className="text-xl text-main font-medium  text-center">
            Sign Up as{" "}
            <span>{roleFromState === "creator" ? "Creator" : "Candidate"}</span>
          </h2>

          {/* Slider Container */}
          <div className="w-full flex-grow overflow-x-hidden customScrollbarStyle">
            {/* Form & Slider */}
            <form
              className="flex flex-row transition-transform duration-500"
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
                    className="w-full overflow-y-auto customScrollbarStyle"
                    style={{
                      width: `${100 / steps.length}%`,
                      height: "100%",
                    }}
                  >
                    {step}
                  </div>
                );
              })}
            </form>

            {/* Terms And Conditions */}
            <div
              className={`w-full flex flex-row gap-x-1 px-2 mt-2 ${
                isLastStep ? "visible" : "invisible"
              }`}
            >
              <input
                type="checkbox"
                name="termsAccepted"
                id="terms&conditions"
                checked={userData.termsAccepted}
                onChange={handleTermsChange}
              />

              <label
                htmlFor="terms&conditions"
                className="text-neutral/90 text-xs"
              >
                Accept{" "}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenTermsAndCondition(true);
                  }}
                  className="text-neutral font-bold underline"
                >
                  Terms & Conditions
                </span>{" "}
                to Continue
              </label>
            </div>

            <ErrorMessage
              visibility={firstError.termsAccepted}
              className="px-2"
            >
              {firstError.termsAccepted}
            </ErrorMessage>

            {openTermsAndCondition && (
              <TermsAndConditions
                onClose={() => setOpenTermsAndCondition(false)}
              />
            )}
          </div>

          {/* Action Button */}
          <div className="justify-end flex flex-row gap-4 mt-2">
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
              className="min-w-20 text-neutral/75 font-medium bg-red/75 rounded-md py-1 cursor-pointer hover:text-neutral hover:bg-red disabled:bg-gray disabled:cursor-not-allowed"
            >
              Back
            </motion.button>

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
              disabled={isSigningIn}
              onClick={isLastStep ? handleSignUp : handleNext}
              className="min-w-20 text-neutral/75 font-medium bg-main/75 rounded-md py-1 cursor-pointer hover:text-neutral hover:bg-main disabled:bg-gray disabled:cursor-not-allowed"
            >
              {isLastStep ? (
                isSigningIn ? (
                  <LoaderCircleIcon className="animate-spin mx-auto" />
                ) : (
                  "Sign Up"
                )
              ) : (
                "Next"
              )}
            </motion.button>
          </div>
        </section>

        <p className="text-sm text-white/50 text-center mt-2">
          Already have account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-base text-white/75 font-bold"
          >
            Log in
          </span>
        </p>
      </div>
    </>
  );
};

export default SignupMultiStep;
