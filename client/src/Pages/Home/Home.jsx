import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const adCode = `<script type="text/javascript">
    atOptions = {
      'key' : '35056e4e30387b34fa86a750ecf89d87',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="//www.highperformanceformat.com/35056e4e30387b34fa86a750ecf89d87/invoke.js"></script>`;

  const handleSignup = (role) => {
    navigate("/signup", { state: { role } });
  };

  return (
    <>
      {!isAuthenticated && (
        <section className="w-full aspect-video bg-black rounded-md flex flex-col justify-end items-center px-4 py-4">
          <p className="text-neutral text-sm text-center">To Apply for Jobs</p>

          <button
            onClick={() => handleSignup("")}
            className="w-full text-neutral font-medium bg-customBlue rounded-md px-2 py-1 mb-4"
          >
            Sign Up as Candidate
          </button>

          <p className="text-neutral text-sm text-center">
            To Hire Employee or Create Jobs
          </p>

          <button
            onClick={() => handleSignup("creator")}
            className="w-full text-neutral font-medium bg-customBlue rounded-md px-2 py-1"
          >
            Sign Up as Creator
          </button>
        </section>
      )}
      {/* "Nepali for Nepali: It’s not just a slogan; it’s a promise. */}
    </>
  );
};

export default Home;
