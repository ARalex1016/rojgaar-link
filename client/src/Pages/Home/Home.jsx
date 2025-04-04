import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleSignup = (role) => {
    navigate("/signup", { state: { role } });
  };

  return (
    <>
      {!isAuthenticated && (
        <section className="w-full aspect-video bg-white">
          <p className="text-center text-lg">Click Here</p>

          <div>
            <p className="col-span-1">To Search and Apply for Jobs</p>

            <button
              onClick={() => handleSignup("")}
              className="text-neutral font-medium bg-customBlue rounded-md px-2 py-1"
            >
              Sign Up as Candidate
            </button>
          </div>

          <div>
            <p className="col-span-1">To Create New Jobs</p>

            <button
              onClick={() => handleSignup("creator")}
              className="text-neutral font-medium bg-customBlue rounded-md px-2 py-1"
            >
              Sign Up as Creator
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
