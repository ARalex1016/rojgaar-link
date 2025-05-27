import { useState } from "react";
import { motion } from "framer-motion";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Components
import { ViewIcon, DownloadIcon, XIcon } from "./Icons";

const PDF = ({ pdf }) => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <p className="text-neutral">
        Page {pageNumber} of {numPages}
      </p>
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
};

const PdfDisplay = ({ url, title, close }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <button className="absolute top-2 right-2 z-10" onClick={close}>
          <XIcon className="border-2 border-red !bg-red !text-neutral hover:border-neutral shadow-sm shadow-gray" />
        </button>

        <div className="w-[95%] h-[95%] bg-darkGray shadow-sm shadow-gray rounded-lg overflow-auto flex flex-col gap-2 p-4 pt-4">
          {/* <iframe
            src={url}
            className="w-full h-full border-2 border-neutral rounded"
            title={title}
          /> */}
          <PDF pdf={url} />
        </div>
      </div>
    </>
  );
};

export const PDFViewer = ({ pdf, label, className }) => {
  const [isPdfDisplayOpen, setIsPdfDisplayOpen] = useState(false);

  const closePdfDisplay = () => {
    setIsPdfDisplayOpen(false);
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

          {/* View Button */}
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
            onClick={() => setIsPdfDisplayOpen(true)}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <ViewIcon />
          </motion.button>

          {/* Download Button */}
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

          {/* Modal */}
          {isPdfDisplayOpen && (
            <PdfDisplay
              url={pdf.url}
              title={pdf.title}
              close={closePdfDisplay}
            />
          )}
        </div>
      )}
    </>
  );
};
