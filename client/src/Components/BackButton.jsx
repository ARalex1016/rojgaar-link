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
        className={`text-red font-medium fixed top-menuHeight left-sideSpacing bg-transparent border-2 border-red rounded-md px-2 flex flex-row justify-center items-center gap-x-1 ${className}`}
      >
        <IoChevronBackOutline
          style={{ color: "var(--red)", fontSize: "20px" }}
        />{" "}
        Back
      </button>
    </>
  );
};

export default BackButton;
