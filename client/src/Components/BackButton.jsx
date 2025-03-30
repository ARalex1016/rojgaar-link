import { useNavigate } from "react-router-dom";

// React-Icons
import { IoChevronBackOutline } from "react-icons/io5";

const BackButton = ({ className }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigates to the previous page
  };

  return (
    <>
      <button
        onClick={handleBackClick}
        className={`mobilesm:text-sm mobile:text-base text-neutral font-medium fixed top-menuHeight left-sideSpacing z-20 bg-red border-2 border-red rounded-md py-[2px] pr-2 flex flex-row justify-center items-center gap-x-1 transition-all duration-200 hover:scale-105 ${className}`}
      >
        <IoChevronBackOutline
          style={{
            color: "var(--red)",
            fontSize: "20px",
          }}
        />{" "}
        Back
      </button>
    </>
  );
};

export default BackButton;
