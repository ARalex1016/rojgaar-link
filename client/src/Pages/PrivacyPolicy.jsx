import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="text-neutral max-w-4xl mx-auto py-4">
      {/* Page Title */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>

        <p className="text-neutral/80 text-gray-600">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </header>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>

        <p className="text-neutral/80 text-gray-700">
          Welcome to{" "}
          <span className="text-neutral font-bold">Rojgaar Link</span>. Your
          privacy is important to us. This Privacy Policy outlines how we
          collect, use, and protect your information. By using our platform, you
          agree to the terms of this Privacy Policy.
        </p>
      </section>

      {/* Data Collection */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data We Collect</h2>

        <ul className="text-neutral/80 list-disc list-inside text-gray-700">
          <li>
            Personal Information: Name, email, phone number, address, and
            resume.
          </li>
          <li>Technical Data: IP address and cookies.</li>
          <li>Donation Data: Processed via Ko-fi.</li>
        </ul>
      </section>

      {/* Purpose of Data */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>

        <p className="text-neutral/80 text-gray-700 mb-4">
          We use your information for the following purposes:
        </p>

        <ul className="text-neutral/80 list-disc list-inside text-gray-700">
          <li>Email for verification, updates, and news.</li>
          <li>Phone number for inquiries related to job approval.</li>
          <li>IP address for autofilling registration address.</li>
          <li>Cookies to store JWT tokens for authentication.</li>
          <li>Platform analytics and performance improvements.</li>
        </ul>

        <p className="text-neutral/80 text-gray-700 mt-4">
          We do not share your data with third parties. However, in the future,
          we may integrate Google Ads and Stripe for better user experiences.
        </p>
      </section>

      {/* Data Storage and Security */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Data Storage and Security
        </h2>

        <p className="text-neutral/80 text-gray-700">
          Your data is securely stored in MongoDB Atlas cloud servers (located
          in Romania). Passwords are encrypted using bcrypt.js. We retain your
          data until you delete your account.
        </p>
      </section>

      {/* User Rights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Rights</h2>

        <ul className="text-neutral/80 list-disc list-inside text-gray-700">
          <li>Request access to your data.</li>
          <li>Update or delete your account information.</li>
          <li>Control cookie settings for JWT tokens.</li>
        </ul>
      </section>

      {/* Cookies */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>

        <p className="text-neutral/80 text-gray-700">
          We only use cookies to store JWT tokens for secure authentication. No
          tracking or marketing cookies are used.
        </p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>

        <p className="text-neutral/80 text-gray-700">
          For privacy-related inquiries, you can reach us via the{" "}
          <span
            onClick={() => navigate("/contact-us")}
            className="text-neutral font-bold"
          >
            Contact Us
          </span>{" "}
          page or follow us on our Facebook page.
        </p>
      </section>

      {/* Policy Updates */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Policy Updates</h2>

        <p className="text-neutral/80 text-gray-700">
          We may update this Privacy Policy from time to time. Users will be
          notified via email of any significant changes.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral text-sm">
        <p>
          &copy; {new Date().getFullYear()} Rojgaar Link. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
