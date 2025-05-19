import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useMetricsStore } from "../../Store/useMetricsStore";

import ScoreBoard from "./ScoreBoard";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isCreator, isCandidate } = useAuthStore();
  const { adminMetrics, getAdminMetrics } = useMetricsStore();

  const handleSignup = (role) => {
    navigate("/signup", { state: { role } });
  };

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        let res = await getAdminMetrics();
      } catch (error) {}
    };

    fetchAdminMetrics();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-black rounded-md shadow-md shadow-gray/80 px-4 pt-4 pb-6 mt-2">
        <div className="bg-[url('https://example.com/your-image.jpg')] rounded-md aspect-video bg-cover border-[1px] border-neutral/20 flex flex-col justify-end px-2 mb-2">
          <h2 className="text-neutral/70 text-lg font-medium">
            Connecting Nepali Talent with Global Opportunities
          </h2>

          <p className="text-neutral/30 text-sm">
            Find jobs abroad or recruit skilled candidates transparently and
            securely
          </p>
        </div>

        {!isAuthenticated && (
          <>
            <button
              onClick={() => handleSignup("")}
              className="w-full text-neutral font-medium bg-customBlue rounded-md py-1 mb-2"
            >
              Search Jobs
            </button>

            <button
              onClick={() => handleSignup("creator")}
              className="w-full text-neutral font-medium bg-customBlue rounded-md py-1"
            >
              Post a Job
            </button>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <button
            onClick={() => navigate("/")}
            className="w-full text-neutral font-medium bg-customBlue rounded-md py-1 mb-2"
          >
            Go to Dashboard
          </button>
        )}

        {isAuthenticated && isCreator && (
          <button
            onClick={() => navigate("/myjobs")}
            className="w-full text-neutral font-medium bg-customBlue rounded-md py-1"
          >
            Post a Job
          </button>
        )}

        {isAuthenticated && isCandidate && (
          <button
            onClick={() => navigate("/jobs")}
            className="w-full text-neutral font-medium bg-customBlue rounded-md py-1"
          >
            Search Job
          </button>
        )}
      </section>

      {/* Metrics & Statistics */}
      {adminMetrics && Object.keys(adminMetrics).length >= 1 && (
        <section className="bg-neutral rounded-md shadow-inner shadow-gray py-2 my-4">
          {/* <p className="text-center text-lg text-main font-bold">ScoreBoard</p> */}

          <div className="flex flex-row justify-around">
            <ScoreBoard
              title="Total Active Jobs"
              score={adminMetrics?.totalActiveJobs || 0}
            />

            <ScoreBoard
              title="Total Users"
              score={adminMetrics?.totalUsers || 0}
            />
          </div>
        </section>
      )}

      {/* "Nepali for Nepali: It’s not just a slogan; it’s a promise. */}
    </>
  );
};

export default Home;
