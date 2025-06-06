// Components
import { XIcon } from "lucide-react";

const TermsAndConditions = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-primary bg-opacity-50 z-20 flex justify-center items-center px-sideSpacing py-menuHeight">
      <div className="bg-white rounded-md p-6 w-full max-w-3xl h-full overflow-y-auto customScrollbarStyle shadow-xl">
        {/* Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Terms and Conditions</h2>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close Terms and Conditions"
              className="text-red rounded-full hover:text-neutral hover:bg-red p-[2px]"
            >
              <XIcon />
            </button>
          )}
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Welcome to our platform. By accessing or using our services, you
            agree to be bound by the following terms and conditions. Please read
            them carefully.
          </p>

          <h3 className="font-semibold">1. User Responsibilities</h3>

          <p>
            You are responsible for ensuring the accuracy and authenticity of
            the information you provide when registering or applying for jobs.
            It is your duty to verify the legitimacy of job postings before
            applying.
          </p>

          <h3 className="font-semibold">2. Job Listings</h3>

          <p>
            We do not guarantee the accuracy, completeness, or reliability of
            job listings posted by creators. Apply at your own discretion.
          </p>

          <h3 className="font-semibold">3. Prohibited Activities</h3>

          <p>
            Users are prohibited from submitting false information, engaging in
            fraudulent activities, or misusing the platform in any way.
          </p>

          <h3 className="font-semibold">4. Intellectual Property</h3>

          <p>
            All content, including text, images, and logos, are the property of
            the platform and may not be used without permission.
          </p>

          <h3 className="font-semibold">5. Liability</h3>

          <p>
            The platform is not responsible for any loss, damage, or
            inconvenience caused by the use of our services.
          </p>

          <h3 className="font-semibold">6. Changes to Terms</h3>

          <p>
            We reserve the right to update these terms at any time. Changes will
            be communicated through the platform.
          </p>

          <p>
            By continuing to use our services, you agree to the updated terms
            and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
