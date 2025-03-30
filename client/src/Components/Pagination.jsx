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
  let prePageNo = Array.from(
    { length: 3 },
    (_, index) => currentPage - index - 1
  )
    .filter((page) => page > 0)
    .reverse();

  let nextPageNo = Array.from(
    { length: 4 },
    (_, index) => currentPage + index
  ).filter((page) => page <= totalPages);

  const displayPageNo = [...prePageNo, ...nextPageNo];

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
        Pre
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
        Next
      </Buttons>
    </div>
  );
};

export default Pagination;
