import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

// Components
import { LoadingCircle } from "../../Components/Loading";

const EmailVerificationPage = () => {
  const { verifyEmail } = useAuthStore();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleChange = (value, index) => {
    // Ensure input is a number
    if (!/^\d*$/.test(value)) return;

    // Prevent further input if all fields are already filled
    if (code.every((digit) => digit !== "")) return;

    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      pastedCode.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);
      // Focus the last non-empty input or stay at the last input
      const lastFilledIndex = pastedCode.length - 1;
      inputRefs.current[Math.min(lastFilledIndex, 5)].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text");

    if (pastedData.length > 6 || !/^\d+$/.test(pastedData)) {
      e.preventDefault(); // Block pasting if the data is invalid
    }
  };

  const handleVerifyEmail = async () => {
    let otp = code.join("");

    if (!otp || otp.length < 6) {
      return toast.error("Please enter the 6-digit OTP to proceed.");
    }

    setVerifyingOtp(true);

    try {
      let res = await verifyEmail(otp);

      toast.success(res.message);
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (!email) return;

  return (
    <div className="w-full max-w-[450px] bg-neutral/75 rounded-md flex flex-col gap-y-2 p-5 mt-24 mx-auto">
      <h2 className="text-main font-bold text-xl text-center">
        Verify Your Email
      </h2>

      <p className="text-center text-base">
        We've sent an email with OTP to{" "}
        <span className="text-main font-medium">{email}</span>
      </p>

      <p className="text-center text-xs">Enter the 6-digit code here</p>

      <div className="w-full flex flex-row justify-between gap-x-1">
        {code.map((digit, index) => {
          return (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="6"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e)}
              className="mobilesm:size-10 mobile:size-12 text-center text-2xl font-bold text-primary bg-neutral rounded-lg border-2 border-primary/60 focus:border-main focus:outline-none"
            />
          );
        })}
      </div>

      <motion.button
        variants={{
          initial: {
            scale: 1,
          },
          tap: {
            scale: 0.95,
          },
        }}
        whileTap="tap"
        disabled={verifyingOtp}
        onClick={handleVerifyEmail}
        className="w-full h-10 text-lg text-neutral font-medium bg-main shadow-md shadow-gray rounded-md my-1 cursor-pointer disabled:bg-gray disabled:cursor-not-allowed"
      >
        {verifyingOtp ? <LoadingCircle size={30} /> : "Verify Email"}
      </motion.button>
    </div>
  );
};

export default EmailVerificationPage;
