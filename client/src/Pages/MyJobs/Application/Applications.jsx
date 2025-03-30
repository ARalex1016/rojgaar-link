import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import BackButton from "../../../Components/BackButton";
import TabsWithCounter from "../../../Components/Tabs";
import { ExpandableTable } from "../../../Components/Table";
import NoData from "../../../Components/NoData";

// Store
import { useJobStore } from "../../../Store/useJobStore";

const Applications = () => {
  const { jobId } = useParams();
  const { getAllAppliedCandidates } = useJobStore();

  const [activeStatus, setActiveStatus] = useState("pending");
  const [appliedUsers, setAppliedUser] = useState(null);
  const [appliedUserId, setAppliedUserId] = useState(null);
  const [page, setPage] = useState(1);

  const allStatus = ["pending", "shortlisted", "hired", "rejected"];

  const handleUserIdChange = (id) => {
    setAppliedUserId((prevId) => (prevId === id ? "" : id));
  };

  const fetchAppliedCandidates = async () => {
    try {
      let res = await getAllAppliedCandidates(jobId, activeStatus, page);

      setAppliedUser(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filterOutUserId = (applicationId) => {
    setAppliedUser((pre) =>
      pre.data.filter((application) => application._id !== applicationId)
    );
  };

  useEffect(() => {
    fetchAppliedCandidates();
  }, [page, activeStatus]);

  return (
    <>
      <section>
        <BackButton className="mt-2" />

        {/* Tabs */}
        <section className="w-full flex flex-row  justify-around flex-nowrap gap-x-4 overflow-auto scrollbar-hide pt-2 mt-9 mb-4">
          {allStatus?.map((status, index) => {
            return (
              <TabsWithCounter
                key={index}
                activeTab={activeStatus}
                setActiveTab={setActiveStatus}
              >
                {status}
              </TabsWithCounter>
            );
          })}
        </section>

        {appliedUsers?.data?.length >= 1 ? (
          <ExpandableTable
            data={appliedUsers?.data}
            meta={appliedUsers?.meta}
            toggleRow={handleUserIdChange}
            selectedRowId={appliedUserId}
            filterOutRowId={filterOutUserId}
            setPage={setPage}
            className=""
          />
        ) : (
          <NoData />
        )}
      </section>
    </>
  );
};

export default Applications;
