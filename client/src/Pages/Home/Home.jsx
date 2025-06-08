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
        <section className="w-full rounded-md overflow-hidden shadow-md shadow-gray relative">
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

            <p className="text-gray text-xs mb-2">
              Find jobs abroad or recruit skilled candidates transparently and
              securely
            </p>

            {/* Call to Action Buttons */}
            {!isAuthenticated && (
              <div className="flex flex-col gap-y-2">
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
          <section className="border-y-2 border-neutral/60 rounded-md shadow-md shadow-gray py-4">
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

        {/* Our Mission & Support Us */}
        <section className="bg-black rounded-md shadow-md shadow-gray px-4 py-4 flex flex-col gap-y-1 justify-center items-center">
          <p className="text-center text-lg text-neutral font-bold">
            Our Mission
          </p>

          <p className="w-full text-neutral font-medium">
            What is our Mission?
          </p>

          <p className="text-neutral/75">
            Our mission is to connect Nepali job seekers with employers abroad,
            providing a platform that is secure, transparent, and user-friendly.
          </p>

          <p className="text-center text-lg text-blue-500 font-bold pt-2">
            Support Our Mission
          </p>

          <p className="text-neutral/65 mb-2">
            We can't do this without your support! Your contribution can make a
            big difference.
          </p>

          <p className="w-full text-neutral/75">
            You can support us financially by
          </p>

          <ul className="w-full list-disc list-inside text-neutral/75 text-sm flex flex-col gap-y-1">
            <li>
              <span className="text-blue-500 font-bold">Khalti:</span> Donate
              with Khalti Id or Khalti QR pay
            </li>

            <li>
              <span className="text-blue-500 font-bold">IME Pay:</span> Donate
              with IME Pay or IME QR pay
            </li>
            <li>
              <span className="text-blue-500 font-bold">
                Credit/Debit Cards:
              </span>{" "}
              Donate with MasterCard and Visa payments.
            </li>
          </ul>

          <motion.button
            variants={{
              initial: {
                scale: 1,
              },
              hover: {
                scale: 1.1,
              },
              tap: {
                scale: 0.9,
              },
            }}
            whileHover="hover"
            whileTap="tap"
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            onClick={() => navigate("/support-us")}
            className="text-neutral text-lg font-medium bg-blue-700 rounded-md px-5 py-1 mx-auto my-2"
          >
            Support Us
          </motion.button>

          <p className="text-neutral/75 text-xs">
            <span className="font-medium">Remember:</span> You can aslo support
            us by sharing this platform to your friends, family and relatives.{" "}
            <span className="text-blue-500 font-bold underline">Share</span>
          </p>
        </section>

        {/* How it works */}
        <section className="border-[1px] border-neutral rounded-md shadow-md shadow-gray flex flex-col gap-y-2 pb-2 my-2">
          <p className="text-center text-lg text-neutral font-bold border-b-[1px] border-neutral shadow-md shadow-gray py-1">
            How It Works
          </p>

          <div className="w-full px-4">
            <p className="text-neutral font-bold">For Candidates</p>

            <ol className="w-full text-neutral/80 text-sm list-decimal list-inside">
              <li>
                Create an account{" "}
                <span
                  onClick={() => handleSignup()}
                  className="text-neutral text-base font-bold underline"
                >
                  Sign up as Candidate
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
                Create an account{" "}
                <span
                  onClick={() => handleSignup("creator")}
                  className="text-neutral text-base font-bold underline"
                >
                  Sign up as Creator
                </span>
              </li>
              <li>Post new Job from My Jobs Page</li>
              <li>Wait for Admin to approve the job</li>
            </ol>
          </div>
        </section>

        {/* Contact Us */}
        <section className="bg-black rounded-md shadow-md shadow-gray px-4 py-2">
          <p className="text-center text-lg text-neutral font-bold">
            Contact Us
          </p>

          <p className="text-neutral/80 text-sm text-center">
            If you have any questions or feedback, feel free to reach out to us
            through our{" "}
            <span
              onClick={() => navigate("/contact-us")}
              className="text-blue-500 font-bold underline"
            >
              Contact Us
            </span>{" "}
            form
          </p>

          {/* <p className="text-black/80 text-sm font-medium text-center italic">
            OR
          </p> */}
        </section>
      </div>
    </>
  );
};

export default Home;
