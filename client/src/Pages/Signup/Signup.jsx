import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Component
import {
  FloatingLabelInput,
  PasswordInput,
  RadioInput,
} from "../../Components/Input";

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

  const { isSigningIn, signup } = useAuthStore();

  const initialData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  };

  const [userData, setUserData] = useState(initialData);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleButtonCLick = async () => {
    const validEmail = emailValidator(userData.email);

    const validPassword = handlePasswordValidation(userData, setMessage);

    if (!validEmail) {
      setMessage("Invalid Email");
      return;
    }
    if (!validPassword) return;

    try {
      const res = await signup(userData);

      toast.success(res);
      setUserData(initialData);
      setMessage("");

      navigate("/jobs");
    } catch (error) {
      toast.error(error.message);
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
        <section className="w-full max-w-[450px] border-t-2 border-t-main/60 shadow-md shadow-main rounded-xl flex flex-col items-center py-6">
          <h2 className="text-2xl text-main font-medium  text-center">
            Sign Up
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
          <div className="w-4/5 max-w-72 flex flex-col items-center justify-center gap-y-6">
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

            <button
              disabled={isSigningIn}
              onClick={handleButtonCLick}
              className={`w-full max-w-72 h-10 text-white text-lg font-medium rounded-md disabled:bg-gray-600 ${
                isSigningIn ? "bg-gray" : "bg-main/60"
              }`}
            >
              {isSigningIn ? (
                <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
              ) : (
                "Sign up"
              )}
            </button>
          </div>

          <p className="text-sm text-white/50 mt-1">
            Already have accound?{" "}
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
