// Components
import { BiLoader } from "react-icons/bi";

const ButtonWithLoader = ({
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
      className={`text-neutral/80 font-medium rounded-md px-2 py-2 shadow-sm shadow-neutral/50 cursor-pointer transition-all duration-300 hover:text-neutral disabled:text-neutral/90 disabled:bg-gray/60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <BiLoader className="text-2xl animate-spin mx-auto" />
      ) : (
        label
      )}
    </button>
  );
};

export default ButtonWithLoader;
