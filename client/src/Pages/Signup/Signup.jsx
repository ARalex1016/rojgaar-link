import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Component
import {
  FloatingLabelInput,
  PasswordInput,
  RadioInput,
} from "../../Components/Input";
import TermsAndConditions from "../TermsAndConditions";
import { AlertBox } from "../../Components/AlertBox";

// React Icons
import { BiLoaderAlt } from "react-icons/bi";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

// Utils
import {
  emailValidator,
  handlePasswordValidation,
} from "../../Utils/StringManager";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleFromState = location.state?.role || "";

  const { isSigningIn, signup, sendEmailWithOTP } = useAuthStore();

  const initialData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    termsAccepted: false,
  };

  const [userData, setUserData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [openTermsAndCondition, setOpenTermsAndCondition] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    const validEmail = emailValidator(userData.email);

    const validPassword = handlePasswordValidation(userData, setMessage);

    if (!validEmail) {
      setMessage("Invalid Email");
      return;
    }
    if (!validPassword) return;

    // Sign Up
    try {
      const res = await signup(userData);

      setUserData(initialData);
      setMessage("");
      AlertBox({ title: res.message, icon: "success" });

      // Send Email With OTP
      // try {
      //   let res = await sendEmailWithOTP();

      //   AlertBox({ title: res.message, icon: "success" });

      //   navigate("/email-verify");
      // } catch (error) {
      //   AlertBox({ title: error.message, icon: "error" });
      // }
    } catch (error) {
      AlertBox({ title: error.message, icon: "error" });
    }
  };

  useEffect(() => {
    if (roleFromState === "creator") {
      setUserData((prev) => ({ ...prev, role: "creator" }));
    }
  }, [roleFromState]);

  return (
    <>
      <div className="min-h-[80vh] flex justify-center items-center">
        {/* Sign up form Container */}
        <section className="w-full max-w-[450px] border-t-2 border-t-main/60 shadow-md shadow-main/60 rounded-xl flex flex-col items-center py-6">
          <h2 className="text-2xl text-main font-medium  text-center">
            Sign Up as{" "}
            <span>{roleFromState === "creator" ? "Creator" : "Candidate"}</span>
          </h2>

          {/* Message */}
          <p
            className={`w-full min-h-6 text-sm text-red text-center ${
              !message && "invisible"
            }`}
          >
            {message}
          </p>

          {/* Forms */}
          <div className="w-4/5 max-w-72 flex flex-col items-center justify-center gap-y-4">
            <FloatingLabelInput
              label="Name"
              name="name"
              id="name"
              value={userData.name}
              handleInputChange={handleInputChange}
            />

            <FloatingLabelInput
              label="Email"
              name="email"
              id="email"
              type="email"
              value={userData.email}
              handleInputChange={handleInputChange}
            />

            <PasswordInput
              label="Password"
              name="password"
              id="password"
              value={userData.password}
              handleInputChange={handleInputChange}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              value={userData.confirmPassword}
              handleInputChange={handleInputChange}
            />

            {/* Gender Radio Input */}
            <div className="w-full flex justify-between gap-x-4">
              <RadioInput
                label="Male"
                name="gender"
                value="male"
                id="male"
                handleInputChange={handleInputChange}
              />

              <RadioInput
                label="Female"
                name="gender"
                value="female"
                id="female"
                handleInputChange={handleInputChange}
              />

              <RadioInput
                label="Other"
                name="gender"
                value="other"
                id="other"
                handleInputChange={handleInputChange}
              />
            </div>

            {/* Terms And Conditions */}
            <div className="w-full flex flex-row gap-x-1">
              <input
                type="checkbox"
                name="termsAccepted"
                id="terms&conditions"
                checked={userData.termsAccepted}
                onChange={() =>
                  setUserData((pre) => ({
                    ...pre,
                    termsAccepted: !pre.termsAccepted,
                  }))
                }
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

            {openTermsAndCondition && (
              <TermsAndConditions
                onClose={() => setOpenTermsAndCondition(false)}
              />
            )}

            <button
              disabled={isSigningIn || !userData?.termsAccepted}
              onClick={handleSignUp}
              className={`w-full max-w-72 h-10 text-white text-lg font-medium bg-main/60 rounded-md disabled:bg-gray disabled:cursor-not-allowed`}
            >
              {isSigningIn ? (
                <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
              ) : (
                "Sign up"
              )}
            </button>
          </div>

          <p className="text-sm text-white/50 mt-1">
            Already have account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-base text-white/75 font-bold"
            >
              Log in
            </span>
          </p>
        </section>
      </div>
    </>
  );
};

export default Signup;
