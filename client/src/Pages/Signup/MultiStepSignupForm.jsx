import { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

const Step1 = ({ onNext, formData }) => {
  const formik = useFormik({
    initialValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      onNext(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.name && formik.errors.name ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.confirmPassword}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Next
      </button>
    </form>
  );
};

const Step2 = ({ onNext, onPrevious, formData }) => {
  const formik = useFormik({
    initialValues: {
      gender: formData.gender,
      birthdate: formData.birthdate,
    },
    validationSchema: Yup.object({
      gender: Yup.string().required("Gender is required"),
      birthdate: Yup.date().required("Birthdate is required"),
    }),
    onSubmit: (values) => {
      onNext(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.gender}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {formik.touched.gender && formik.errors.gender ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="birthdate"
          className="block text-sm font-medium text-gray-700"
        >
          Birthdate
        </label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.birthdate}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.birthdate && formik.errors.birthdate ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.birthdate}</p>
        ) : null}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};

const Step3 = ({ onSubmit, onPrevious, isSubmitting }) => {
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Enter OTP
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.otp}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.otp && formik.errors.otp ? (
          <p className="text-red-500 text-sm mt-1">{formik.errors.otp}</p>
        ) : null}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Verify"}
        </button>
      </div>
    </form>
  );
};

const steps = ["User Info", "Gender & Birthdate", "OTP Verification"];

const MultiStepSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthdate: "",
    otp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (otpData) => {
    setIsSubmitting(true);
    try {
      // Call your sign-up API
      // Assuming sign-up and OTP sending are successful
      console.log("Form submitted: ", { ...formData, ...otpData });
      // Redirect to jobs
      window.location.href = "/jobs";
    } catch (error) {
      console.error("Error during sign-up:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepComponents = [
    <Step1 onNext={handleNext} formData={formData} />,
    <Step2
      onNext={handleNext}
      onPrevious={handlePrevious}
      formData={formData}
    />,
    <Step3
      onSubmit={handleSubmit}
      onPrevious={handlePrevious}
      isSubmitting={isSubmitting}
    />,
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">Multi-Step Signup Form</h2>
        <p className="text-gray-500">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
        </p>
      </div>

      {/* Step Animation */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        {stepComponents[currentStep - 1]}
      </motion.div>
    </div>
  );
};

export default MultiStepSignupForm;
