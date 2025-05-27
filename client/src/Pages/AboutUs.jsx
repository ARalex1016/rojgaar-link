import { useNavigate } from "react-router-dom";

// Store
import { useAuthStore } from "../Store/useAuthStore";

const AboutUs = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();

  return (
    <div className="text-gray-800">
      {/* Header Section */}
      <section className="text-white text-center pb-5">
        <h1 className="text-2xl text-neutral font-bold text-center my-4">
          About Us
        </h1>

        <p className="text-neutral/80 mt-2">
          Empowering Nepalese community to connect with better opportunities
          abroad.
        </p>
      </section>

      {/* Main Content Section */}
      <section className="max-w-6xl mx-auto py-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Section */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Our Mission</h2>

            <p className="text-neutral/80 text-lg mt-4">
              At{" "}
              <span className="text-neutral font-semibold">Rojgaar Link</span>,
              we are dedicated to helping Nepalese workers find better-paid jobs
              and work environments abroad. We connect the skills and hard work
              of Nepalese people with job opportunities that reflect their
              value.
            </p>

            <p className="text-neutral/80 text-lg mt-4">
              By providing a platform where Nepalese can connect with job
              creators, we aim to build a community where{" "}
              <span className="font-semibold">Nepali can help Nepali</span>.
              This not only benefits individuals but also indirectly contributes
              to the progress of our beloved country, Nepal.
            </p>
          </div>

          {/* Placeholder for Team Photos */}
          <div className="flex justify-center items-center">
            <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
              <p className="text-neutral">[Team Photo Placeholder]</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-neutral/90 rounded-lg hover:bg-neutral px-4 py-6">
          <h3 className="text-xl font-bold text-blue-600 text-center">
            Explore Opportunities or Join Us Today!
          </h3>

          <p className="mt-2 text-center">
            Whether you're looking for your dream job or have opportunities to
            share, Rojgaar Link is here to bridge the gap. Let’s connect!
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/jobs")}
              className="bg-blue-600 mobilesm:text-sm mobile:text-base text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Jobs
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="bg-main/90 text-white py-2 px-4 ml-4 rounded-lg font-semibold hover:bg-main transition"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section with Multilingual Support */}
      <footer className="bg-gray-800 text-neutral py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            <span className="font-bold">Rojgaar Link</span> | A platform by
            Nepalese, for Nepalese.
          </p>

          <p className="mt-2 text-sm">
            यो प्लाटफर्म सम्पूर्ण नेपालीहरुलाई उपयुक्त रोजगारीको अवसरहरू प्रदान
            गर्न समर्पित छ।
            <span className="italic">
              {" "}
              ("This platform is dedicated to providing suitable job
              opportunities to all Nepalese.")
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
