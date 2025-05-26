import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import { ArrowRightIcon } from "../../Components/Icons";

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
      <div className="flex flex-col gap-y-4 py-4">
        {/* Hero Section */}
        <section className="w-full shadow-md shadow-gray relative">
          <div className="w-full aspect-video rounded-md bg-neutral">
            <img
              src="/Images/nepali-flag-bg.jpg"
              alt="Nepali flag background"
              className="object-cover"
            />
          </div>

          <div className="w-1/2 absolute top-1/2 right-0 z-10 -translate-y-1/2 pr-2">
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
                    tap: {
                      scale: 0.95,
                    },
                    hover: {
                      scale: 1.05,
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
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
                    tap: {
                      scale: 0.95,
                    },
                    hover: {
                      scale: 1.05,
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
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
                  tap: {
                    scale: 0.95,
                  },
                  hover: {
                    scale: 1.05,
                  },
                }}
                whileHover="hover"
                whileTap="tap"
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
                  tap: {
                    scale: 0.95,
                  },
                  hover: {
                    scale: 1.05,
                  },
                }}
                whileHover="hover"
                whileTap="tap"
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
                  tap: {
                    scale: 0.95,
                  },
                  hover: {
                    scale: 1.05,
                  },
                }}
                whileHover="hover"
                whileTap="tap"
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
          <section className="bg-black rounded-md shadow-inner shadow-gray py-4">
            {/* <p className="text-center text-lg text-neutral font-bold">
              ScoreBoard
            </p> */}

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

        {/* Supports Us */}
        <section className="bg-neutral rounded-md shadow-md shadow-gray px-4 py-2">
          <p className="text-center text-lg text-primary font-bold">
            Support Our Mission
          </p>
        </section>

        {/* How it works */}
        <section className="bg-main/80 rounded-md shadow-md shadow-gray flex flex-col gap-y-2 py-4">
          <p className="text-center text-lg text-neutral font-bold">
            How It Works
          </p>

          <div className="w-full px-4">
            <p className="text-neutral font-bold">For Candidates</p>

            <ol className="w-full text-neutral/80 text-sm list-decimal list-inside">
              <li>
                Create an account as Candidate{" "}
                <span
                  onClick={() => handleSignup()}
                  className="text-base font-bold underline"
                >
                  Sign up
                </span>
              </li>
              <li>Filter, Search & Apply for Jobs</li>
              <li>See all the Applied & Saved Jobs in My Jobs Page</li>
              <li>Wait for Creator to update status</li>
            </ol>
          </div>

          <div className="w-full px-4">
            <p className="text-neutral font-bold">For Creators</p>

            <ol className="w-full text-neutral/80 text-sm list-decimal list-inside">
              <li>
                Create an account as Creator{" "}
                <span
                  onClick={() => handleSignup("creator")}
                  className="text-base font-bold underline"
                >
                  Sign up
                </span>
              </li>
              <li>Post new Job from My Jobs Page</li>
              <li>Wait for Admin to approve the job</li>
            </ol>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
