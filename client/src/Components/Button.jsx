import { motion } from "framer-motion";

// Components
import { BiLoader } from "react-icons/bi";

export const ButtonWithLoader = ({
  label,
  disabled,
  isLoading = false,
  onClick,
  className,
}) => {
  return (
    <motion.button
      variants={{
        initia: {
          scale: 1,
        },
        hover: {
          scale: 1.05,
        },
        tap: {
          scale: 0.95,
        },
      }}
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.1,
      }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`text-neutral/80 font-medium bg-main/80 rounded-md px-2 py-1 shadow-sm shadow-neutral/50 cursor-pointer transition-all duration-300 hover:text-neutral hover:bg-main disabled:text-neutral/90 disabled:bg-gray/60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <BiLoader className="text-2xl animate-spin mx-auto" />
      ) : (
        label
      )}
    </motion.button>
  );
};
