import { motion } from "framer-motion";

// Components
import { ViewIcon, DownloadIcon } from "./Icons";

export const PDFViewer = ({ pdf, label, className }) => {
  const handleViewPdf = () => {
    window.open(pdf?.url, "_blank", "noreferrer");
  };

  const handleDownloadPdf = async () => {
    if (pdf?.url) {
      try {
        const response = await fetch(pdf.url, { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to download the PDF");
        }

        const blob = await response.blob(); // Convert the response to a Blob
        const url = window.URL.createObjectURL(blob); // Create a Blob URL
        const link = document.createElement("a");
        link.href = url;
        link.download = pdf.title || "document.pdf"; // Use title or default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Revoke the Blob URL to free memory
      } catch (error) {
        console.error("Error downloading the PDF:", error);
      }
    }
  };

  return (
    <>
      {pdf?.title && pdf?.url && (
        <div
          className={`w-full flex flex-row justify-center items-center gap-x-2 ${className}`}
        >
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
            title={`View ${label || "PDF"}`}
            onClick={handleViewPdf}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <ViewIcon />
          </motion.button>

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
            title={`Download ${label || "PDF"}`}
            onClick={handleDownloadPdf}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <DownloadIcon />
          </motion.button>
        </div>
      )}
    </>
  );
};
