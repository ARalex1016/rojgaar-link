import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import BackButton from "../../../Components/BackButton";

// Store
import { useJobStore } from "../../../Store/useJobStore";

const Applications = () => {
  const { jobId } = useParams();

  const { getAllAppliedCandidates } = useJobStore();

  const fetchAppliedCandidates = async () => {
    try {
      let res = await getAllAppliedCandidates(jobId);

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  return (
    <>
      <section>
        <BackButton className="mt-2" />
      </section>
    </>
  );
};

export default Applications;
