import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Image
import NepaliFlagImage from "./../../../public/Images/nepali-flag-bg.jpg";

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
      <section className="w-full mt-2 relative">
        <img
          src={NepaliFlagImage}
          alt="Nepali flag background"
          className="w-full h-auto object-cover rounded-md"
        />

        <div className="w-1/2 absolute top-1/2 right-0 z-10 -translate-y-1/2 p-2">
          <h2 className="text-black mobilesm:text-xs text-sm font-medium">
            Connecting Nepali Talent with Global Opportunities
          </h2>

          <p className="text-gray text-xs">
            Find jobs abroad or recruit skilled candidates transparently and
            securely
          </p>

          {/* Call to Action Buttons */}
          {!isAuthenticated && (
            <div className="flex flex-col gap-y-2 pt-2">
              <motion.button
                variants={{
                  initial: {
                    scale: 1,
                  },
                  final: {
                    scale: 1.05,
                  },
                }}
                whileTap="final"
                onClick={() => handleSignup("")}
                className="w-full text-neutral mobilesm:text-sm mobile:text-base font-medium bg-red rounded-md py-1"
              >
                Search Jobs
              </motion.button>

              <motion.button
                variants={{
                  initial: {
                    scale: 1,
                  },
                  final: {
                    scale: 1.05,
                  },
                }}
                whileTap="final"
                onClick={() => handleSignup("creator")}
                className="w-full text-neutral mobilesm:text-sm mobile:text-base font-medium bg-blue-700 rounded-md py-1"
              >
                Post Jobs
              </motion.button>
            </div>
          )}

          {isAuthenticated && isAdmin && (
            <motion.button
              variants={{
                initial: {
                  scale: 1,
                },
                final: {
                  scale: 1.05,
                },
              }}
              whileTap="final"
              onClick={() => navigate("/")}
              className="w-full text-neutral mobilesm:text-sm mobile:text-base font-medium bg-customBlue rounded-md py-1 mb-2"
            >
              Go to Dashboard
            </motion.button>
          )}

          {isAuthenticated && isCreator && (
            <motion.button
              variants={{
                initial: {
                  scale: 1,
                },
                final: {
                  scale: 1.05,
                },
              }}
              whileTap="final"
              onClick={() => navigate("/myjobs")}
              className="w-full text-neutral mobilesm:text-sm mobile:text-base font-medium bg-customBlue rounded-md py-1"
            >
              Post New Job
            </motion.button>
          )}

          {isAuthenticated && isCandidate && (
            <motion.button
              variants={{
                initial: {
                  scale: 1,
                },
                final: {
                  scale: 1.05,
                },
              }}
              whileTap="final"
              onClick={() => navigate("/jobs")}
              className="w-full text-neutral mobilesm:text-sm mobile:text-base font-medium bg-customBlue rounded-md py-1"
            >
              Search Job
            </motion.button>
          )}
        </div>
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
    </>
  );
};

export default Home;
