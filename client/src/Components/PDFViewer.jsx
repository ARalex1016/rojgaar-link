export const PDFViewer = ({ pdf, label }) => {
  const showPdf = () => {
    window.open(`${pdf}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {pdf && (
        <div className="w-full flex flex-col items-center my-2">
          <button
            title={label}
            onClick={showPdf}
            className="text-neutral bg-customBlue rounded-md px-4 py-1"
          >
            {label}
          </button>
        </div>
      )}
    </>
  );
};
