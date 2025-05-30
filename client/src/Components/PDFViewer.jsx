import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pdfjs, Document, Page } from "react-pdf";

// Components
import { PlusIcon, MinusIcon } from "./Icons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Components
import { ViewIcon, DownloadIcon, XIcon } from "./Icons";

const PDFComp = ({ pdf, title }) => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <>
      <div className="flex flex-row justify-around px-2">
        <p className="text-neutral font-medium">{title}</p>

        <p className="text-neutral/75">
          Page {pageNumber} of {numPages}
        </p>
      </div>

      <div
        className="overflow-auto customScrollbarStyle"
        style={{ touchAction: "pan-y" }}
      >
        <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page, index) => {
              return (
                <Page
                  key={index}
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              );
            })}
        </Document>
      </div>
    </>
  );
};

const PdfDisplay = ({ url, title, close }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <button className="absolute top-2 right-2 z-10" onClick={close}>
          <XIcon className="border-2 border-red !bg-red !text-neutral hover:border-neutral shadow-sm shadow-gray" />
        </button>

        <div className="w-[95%] h-[95%] bg-darkGray shadow-sm shadow-gray rounded-lg overflow-auto flex flex-col gap-2 p-2">
          <PDFComp pdf={url} title={title} />
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

  // Disable Main Scroll when PdfDisplay is open
  useEffect(() => {
    if (isPdfDisplayOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isPdfDisplayOpen]);

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
                scale: 0.9,
              },
            }}
            whileHover="hover"
            whileTap="tap"
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            title={`View ${label || "PDF"}`}
            onClick={() => setIsPdfDisplayOpen(true)}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <ViewIcon size={20} />
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
                scale: 0.9,
              },
            }}
            whileHover="hover"
            whileTap="tap"
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            title={`Download ${label || "PDF"}`}
            onClick={handleDownloadPdf}
            className="text-neutral bg-customBlue rounded-full p-1"
          >
            <DownloadIcon size={20} />
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
