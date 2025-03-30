import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";

// Components
import { ProfilePicSM } from "./Image";
import Pagination from "./Pagination";

// Icons
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";

// Utils
import { getDateDetails } from "../Utils/DateManager";

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

const Row = ({ disableHover, className, children }) => {
  return (
    <>
      <tr
        className={`border-b-[1px] border-neutral/40 ${
          disableHover ? "" : "hover:bg-[rgb(45,45,45)]"
        } 
        }${className}`}
      >
        {children}
      </tr>
    </>
  );
};

const ExpandCollapseButton = ({
  rowId,
  selectedRowId,
  isLoading,
  onClick,
  className,
  children,
}) => {
  return (
    <>
      <div className="w-full flex flex-row justify-center">
        {isLoading && rowId === selectedRowId ? (
          <FiLoader className="text-slate-400 text-xl animate-spin" />
        ) : (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onClick}
            className={`bg-red rounded-full border-none outline-none cursor-pointer p-[1px] hover:scale-110 ${className}`}
          >
            {children}
          </motion.button>
        )}
      </div>
    </>
  );
};

const ExpandedRowData = ({ rowData, className }) => {
  return (
    <>
      <td
        colSpan="4"
        className={`text-sm border-b-[1px] border-neutral/40 px-6 py-4 ${className}`}
      >
        <p className="text-neutral/80">
          Name:{" "}
          <span className="text-neutral font-medium">
            {rowData?.candidateId?.name}
          </span>
        </p>

        <p className="text-neutral/80">
          Email:{" "}
          <span className="text-neutral font-medium">
            {rowData?.candidateId?.email}
          </span>
        </p>

        <p className="text-neutral/80">
          Contact:{" "}
          <span className="text-neutral font-medium">
            {rowData?.profileSnapshot?.contact?.phoneNumber}
          </span>
        </p>

        <p className="text-neutral/80">
          Location:{" "}
          <span className="text-neutral font-medium">
            {rowData?.profileSnapshot?.location?.country}, State
          </span>
        </p>

        <p className="text-neutral/80">
          Applied At:{" "}
          <span className="text-neutral font-medium">
            {getDateDetails(rowData?.createdAt, false)}
          </span>
        </p>

        <img
          src={rowData?.profileSnapshot?.resume}
          alt="Resume Image"
          className="border-2 border-main/50 hover:border-main rounded-md my-2"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full text-lg text-neutral bg-customBlue rounded-md py-1 mx-auto my-2"
        >
          Download Resume
        </motion.button>
      </td>
    </>
  );
};

export const ExpandableTable = ({
  data = [],
  meta = {},
  toggleRow,
  selectedRowId,
  setPage,
  className,
}) => {
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
                <Row isExpandedRow={selectedRowId === row?.candidateId?._id}>
                  <Data className="font-medium px-4">
                    {meta?.limit * (meta?.currentPage - 1) + (index + 1)}
                  </Data>

                  <Data>
                    <ProfilePicSM
                      imgSrc={row?.candidateId?.profilePic}
                      alt="User Profile"
                      className="size-8"
                    />
                  </Data>

                  <Data className="hover:font-medium">
                    {row?.candidateId?.name}
                  </Data>

                  <Data>
                    <ExpandCollapseButton
                      rowId={row?.candidateId}
                      selectedRowId={selectedRowId}
                      onClick={() => toggleRow(row?.candidateId)}
                    >
                      {selectedRowId === row?.candidateId ? (
                        <ChevronUp size={22} />
                      ) : (
                        <ChevronDown size={22} />
                      )}
                    </ExpandCollapseButton>
                  </Data>
                </Row>

                {/* Expanded Row */}
                <AnimatePresence>
                  {selectedRowId === row?.candidateId && (
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
                      <ExpandedRowData rowData={row} />
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}

            {/* Table Details (Metrics) */}
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
