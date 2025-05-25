import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { emailValidator } from "../../Utils/StringManager";

const Login = () => {
  const navigate = useNavigate();

  const { isLoggingIn, login } = useAuthStore();

  const initialData = {
    email: "",
    password: "",
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

    if (!validEmail) {
      setMessage("Invalid Email");
      return;
    }

    try {
      const res = await login(userData);
      toast.success(res);
      setUserData(initialData);
      setMessage("");

      navigate("/jobs");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex justify-center items-center">
        {/* Log in form Container */}
        <section className="w-full max-w-[450px] border-t-2 border-t-main/60 shadow-md shadow-main/60 rounded-xl flex flex-col items-center py-6">
          <h2 className="text-2xl text-main font-medium  text-center">
            Log in
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

            <button
              disabled={isLoggingIn}
              onClick={handleButtonCLick}
              className={`w-full max-w-72 h-10 text-white text-lg font-medium rounded-md disabled:bg-gray-600 ${
                isLoggingIn ? "bg-gray" : "bg-main/60"
              }`}
            >
              {isLoggingIn ? (
                <BiLoaderAlt className="text-2xl animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </button>
          </div>

          <p className="text-sm text-white/50 mt-1">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-base text-white/75 font-bold"
            >
              Sign up
            </span>
          </p>
        </section>
      </div>
    </>
  );
};

export default Login;
