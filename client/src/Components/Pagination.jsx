import { useState, useEffect } from "react";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

const Buttons = ({ currentPage, onClick, disabled, children, className }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`min-w-10 h-10 text-neutral text-sm font-medium bg-black rounded-md border-2 border-neutral/80 shadow-md shadow-gray/60 cursor-pointer disabled:text-red disabled:bg-gray/40 disabled:border-2 disabled:border-red disabled:cursor-not-allowed px-1 ${
        currentPage === children && "bg-customBlue border-none"
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Pagination = ({ totalPages, currentPage, setCurrentPage, className }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [totalDisplayPages, setTotalDisplayPages] = useState(3);

  let prePageNo = Array.from(
    { length: totalDisplayPages },
    (_, index) => currentPage - index - 1
  )
    .filter((page) => page > 0)
    .reverse();

  let nextPageNo = Array.from(
    { length: totalDisplayPages + 1 },
    (_, index) => currentPage + index
  ).filter((page) => page <= totalPages);

  const displayPageNo = [...prePageNo, ...nextPageNo];

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (width < 400) {
      setTotalDisplayPages(1);
    } else if (width < 500) {
      setTotalDisplayPages(2);
    } else if (width < 768) {
      setTotalDisplayPages(3);
    } else if (width < 1024) {
      setTotalDisplayPages(4);
    } else if (width < 1280) {
      setTotalDisplayPages(5);
    } else if (width < 1536) {
      setTotalDisplayPages(6);
    } else {
      setTotalDisplayPages(7);
    }
  }, [width]);

  return (
    <div
      className={`w-full rounded-md mt-4 flex flex-row flex-nowrap gap-x-2 ${
        totalPages === 1 ? "justify-evenly" : "justify-between"
      } ${className}`}
    >
      <Buttons
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage((pre) => Math.max(pre - 1, 1))}
        className="bg-red"
      >
        <ChevronLeft />
      </Buttons>

      {displayPageNo.map((page) => {
        return (
          <Buttons
            key={page}
            onClick={() => setCurrentPage(page)}
            currentPage={currentPage}
          >
            {page}
          </Buttons>
        );
      })}

      <Buttons
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage((pre) => Math.min(pre + 1, totalPages))}
        className="bg-red"
      >
        <ChevronRight />
      </Buttons>
    </div>
  );
};

export default Pagination;
