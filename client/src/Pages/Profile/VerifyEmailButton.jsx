import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

const VerifyEmailButton = () => {
  const navigate = useNavigate();

  const { sendEmailWithOTP } = useAuthStore();

  const [sendingEmail, setSendingEmail] = useState(false);

  const handleVerifyEmail = async () => {
    setSendingEmail(true);

    try {
      let res = await sendEmailWithOTP();

      toast.success(res.message);

      navigate("/email-verify");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
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
      disabled={sendingEmail}
      onClick={handleVerifyEmail}
      className="text-neutral font-medium bg-red rounded-md px-3 cursor-pointer disabled:bg-gray disabled:cursor-not-allowed"
    >
      Verify
    </motion.button>
  );
};

export default VerifyEmailButton;
