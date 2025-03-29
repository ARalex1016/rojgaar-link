import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { ProfilePicSM } from "./Image";
import Pagination from "./Pagination";

// Icons
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";

const Head = ({ className, children }) => {
  return (
    <th
      className={`text-neutral font-bold bg-black border-b-[1px] border-neutral/40 px-2 py-3 ${className}`}
    >
      {children}
    </th>
  );
};

const Data = ({ colSpan, className, children }) => {
  return (
    <>
      <td
        colSpan={colSpan}
        className={`text-left text-neutral/80 p-2 hover:text-neutral ${className}`}
      >
        {children}
      </td>
    </>
  );
};

const Row = ({ isExpandedRow, disableHover, className, children }) => {
  return (
    <>
      <tr
        className={`${disableHover ? "" : "hover:bg-[rgb(45,45,45)]"} ${
          !isExpandedRow && "border-b-[1px] border-neutral/40"
        } ${className}`}
      >
        {children}
      </tr>
    </>
  );
};

const ExpandedRowData = ({ className, children }) => {
  return (
    <>
      <td
        colSpan="4"
        className={`border-b-[1px] border-neutral/40 ${className}`}
      >
        {children}
      </td>
    </>
  );
};

const ExpandCollapseButton = ({ onClick, className, children }) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`bg-red rounded-full border-none outline-none cursor-pointer p-[1px] hover:scale-110 ${className}`}
      >
        {children}
      </button>
    </>
  );
};

export const ExpandableTable = ({
  data = [],
  meta = {},
  toggleRow,
  setPage,
  className,
}) => {
  const [expandedRow, setExpandedRow] = useState();

  return (
    <>
      <>
        <table
          border="1"
          className={`w-full text-left bg-darkGray rounded-md overflow-hidden ${className}`}
        >
          <thead>
            <Row disableHover={true}>
              <Head className="w-1/12">S.N</Head>
              <Head className="w-3/12">Profile</Head>
              <Head className="w-5/12">Name</Head>
              <Head className="w-3/12"></Head>
            </Row>
          </thead>

          <tbody>
            {data?.map((row, index) => (
              <React.Fragment key={row?._id}>
                {/* Row */}
                <Row isExpandedRow={expandedRow === row?._id}>
                  <Data className="font-medium px-4">
                    {meta?.limit * (meta?.currentPage - 1) + (index + 1)}
                  </Data>

                  <Data>
                    <ProfilePicSM
                      imgSrc={row?.profilePic}
                      alt="User Profile"
                      className="size-8"
                    />
                  </Data>

                  <Data className="hover:font-medium">{row?.name}</Data>

                  <Data className="flex flex-row justify-center items-center">
                    <ExpandCollapseButton onClick={() => toggleRow(row?._id)}>
                      {expandedRow === row?._id ? (
                        <ChevronUp size={22} />
                      ) : (
                        <ChevronDown size={22} />
                      )}
                    </ExpandCollapseButton>
                  </Data>
                </Row>

                {/* Expanded Row */}
                <AnimatePresence>
                  {expandedRow === row?._id && (
                    <motion.tr
                      variants={{
                        initial: {
                          height: 0,
                          opacity: 0,
                          paddingBlock: 0,
                          overflow: "hidden",
                        },
                        final: {
                          height: "auto",
                          opacity: 1,
                          overflow: "hidden",
                        },
                      }}
                      initial="initial"
                      animate="final"
                      exit="initial"
                      transition={{
                        height: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.3, ease: "easeInOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <ExpandedRowData />
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}

            {/* Table Details */}
            <Row disableHover={true} className="border-b-0">
              <Data colSpan={4} className="w-full font-medium text-right px-5">
                {(meta?.currentPage - 1) * meta?.limit + 1}-
                {Math.min(meta?.currentPage * meta?.limit, meta?.totalData)} of{" "}
                {meta?.totalData}
              </Data>
            </Row>
          </tbody>
        </table>

        <Pagination
          totalPages={meta?.totalPages}
          currentPage={meta?.currentPage}
          setCurrentPage={setPage}
        />
      </>
    </>
  );
};
