// React-Icons
import { IoClose } from "react-icons/io5";

export const CreateJobComp = ({ onClose }) => {
  return (
    <>
      <section
        className="w-4/5 bg-neutral rounded-md fixed top-menuHeight z-40"
        style={{
          width: "calc(100% - (2 * var(--sideSpacing)))",
          height: "calc(100vh - var(--menuHeight) - var(--sideSpacing))",
          top: "calc(var(--menuHeight) + (var(--sideSpacing) / 5))",
        }}
      >
        {/* Close Button */}
        <button
          className="font-medium absolute top-2 right-2 text-neutral bg-black/80 p-1 rounded-md hover:bg-black"
          onClick={onClose}
        >
          <IoClose style={{ fontSize: "20px" }} />
        </button>
      </section>
    </>
  );
};

export default CreateJobComp;
