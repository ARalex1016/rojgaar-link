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
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`text-neutral/80 font-medium bg-main/80 rounded-md px-2 py-1 shadow-sm shadow-neutral/50 cursor-pointer transition-all duration-300 hover:text-neutral hover:bg-main disabled:text-neutral/90 disabled:bg-gray/60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <BiLoader className="text-2xl animate-spin mx-auto" />
      ) : (
        label
      )}
    </button>
  );
};
