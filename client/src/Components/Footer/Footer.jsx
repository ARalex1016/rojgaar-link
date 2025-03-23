import { useNavigate } from "react-router-dom";

const FooterElements = ({ label, onClick, className }) => {
  return (
    <>
      <p
        onClick={onClick}
        className={`text-neutral/80 mobilesm:text-sm md:text-base hover:text-neutral mobilesm:pl-16 md:pl-24 lg:pl-80 ${className}`}
      >
        {label}
      </p>
    </>
  );
};

const Footer = () => {
  const navigate = useNavigate();

  return (
    <>
      <footer className="w-[100vw] bg-black grid grid-cols-2 gap-y-2 py-4 mt-8">
        <FooterElements label="All Jobs" onClick={() => navigate("/jobs")} />

        <FooterElements
          label="Support Us"
          onClick={() => navigate("/support-us")}
          className="font-medium"
        />

        <FooterElements label="About Us" />

        <FooterElements label="Social Links" />

        <FooterElements label="Contact Us" />

        <FooterElements label="FAQs" />

        <FooterElements label="Privacy Policy" />

        <FooterElements label="Terms & Conditions" />
      </footer>
    </>
  );
};

export default Footer;
