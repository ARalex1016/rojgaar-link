import { motion } from "framer-motion";

// Components
import { ViewIcon } from "./Icons";

export const PDFViewer = ({ pdf, label }) => {
  const handleViewPdf = () => {
    window.open(pdf?.url, "_blank", "noreferrer");
  };

  return (
    <>
      {pdf?.title && pdf?.url && (
        <div className="w-full flex flex-row justify-center items-center gap-x-2">
          <p className="text-neutral">{pdf?.title}</p>

          <motion.button
            variants={{
              initial: {
                scale: 1,
              },
              hover: {
                scale: 1.1,
              },
              tap: {
                scale: 0.95,
              },
            }}
            whileHover="hover"
            whileTap="tap"
            title={label}
            onClick={handleViewPdf}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <ViewIcon />
            {/* {label} */}
          </motion.button>
        </div>
      )}
    </>
  );
};
