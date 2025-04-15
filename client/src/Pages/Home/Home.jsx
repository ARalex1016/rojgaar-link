import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

// Components
import AdComponent from "../../Components/Ads/Ads";

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
        <section className="w-full aspect-video bg-white">
          <AdComponent adCode={adCode} />

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
      {/* "Nepali for Nepali: It’s not just a slogan; it’s a promise. */}
    </>
  );
};

export default Home;
