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
        className={`mobilesm:text-sm mobile:text-base text-neutral font-medium fixed top-menuHeight left-sideSpacing bg-red rounded-md py-1 pr-3 flex flex-row justify-center items-center gap-x-1 ${className}`}
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
