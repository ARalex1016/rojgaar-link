import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import BackButton from "../../../Components/BackButton";
import { ExpandableTable } from "../../../Components/Table";
import Pagination from "../../../Components/Pagination";

// Store
import { useJobStore } from "../../../Store/useJobStore";

const Applications = () => {
  const { jobId } = useParams();
  const { getAllAppliedCandidates, getAppliedCandidateById } = useJobStore();

  const [appliedUsers, setAppliedUser] = useState(null);
  const [appliedUserId, setAppliedUserId] = useState(null);
  const [page, setPage] = useState(1);

  const handleUserIdChange = (id) => {
    setAppliedUserId((prevId) => (prevId === id ? "" : id));
  };

  const fetchAppliedCandidates = async () => {
    try {
      let res = await getAllAppliedCandidates(jobId, page);

      setAppliedUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAppliedCandidateProfile = async () => {
    try {
      let res = await getAppliedCandidateById(jobId, appliedUserId);

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppliedCandidates();
  }, [page]);

  useEffect(() => {
    if (appliedUserId) {
      fetchAppliedCandidateProfile();
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
            setPage={setPage}
            className="mt-12"
          />
        )}
      </section>
    </>
  );
};

export default Applications;
