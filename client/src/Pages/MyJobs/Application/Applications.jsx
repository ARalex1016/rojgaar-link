import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import BackButton from "../../../Components/BackButton";
import { ExpandableTable } from "../../../Components/Table";

// Store
import { useJobStore } from "../../../Store/useJobStore";

const Applications = () => {
  const { jobId } = useParams();
  const { getAllAppliedCandidates, getAppliedCandidateById } = useJobStore();

  // All Applied User State
  const [appliedUsers, setAppliedUser] = useState(null);

  // Selected Applied User State
  const [appliedUserId, setAppliedUserId] = useState(null);
  const [isFetchingUserDetail, setIsFetchingUserDetail] = useState(false);
  const [appliedUserDetail, setAppliedUserDetail] = useState(null);

  const [page, setPage] = useState(1);

  const handleUserIdChange = (id) => {
    setAppliedUserId((prevId) => (prevId === id ? "" : id));
  };

  const fetchAppliedCandidates = async () => {
    try {
      let res = await getAllAppliedCandidates(jobId, page);

      setAppliedUser(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAppliedCandidateProfileById = async () => {
    setIsFetchingUserDetail(true);

    try {
      let res = await getAppliedCandidateById(jobId, appliedUserId);

      setAppliedUserDetail(res.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetchingUserDetail(false);
    }
  };

  useEffect(() => {
    fetchAppliedCandidates();
  }, [page]);

  useEffect(() => {
    if (appliedUserId) {
      fetchAppliedCandidateProfileById();
    }
  }, [appliedUserId]);

  return (
    <>
      <section>
        <BackButton className="mt-2" />

        {appliedUsers && (
          <ExpandableTable
            data={appliedUsers?.data}
            meta={appliedUsers?.meta}
            toggleRow={handleUserIdChange}
            isFetchingSelectedRowData={isFetchingUserDetail}
            selectedRowId={appliedUserId}
            selectedRowData={appliedUserDetail}
            setPage={setPage}
            className="mt-12"
          />
        )}
      </section>
    </>
  );
};

export default Applications;
