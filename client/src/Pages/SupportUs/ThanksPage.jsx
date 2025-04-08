import { useLocation, useNavigate } from "react-router-dom";

const ThanksPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const amount = queryParams.get("amount");
  const name = queryParams.get("name");

  return (
    <>
      <p className="text-neutral/80 text-xl font-medium">
        Successfully donated{" "}
        {amount && <span className="text-neutral">${amount}</span>}
      </p>

      <p className="text-neutral/80 text-sm">
        Thank you{" "}
        <span className="text-neutral font-medium italic">
          {name ?? "User"}
        </span>{" "}
        for your support
      </p>

      <button
        onClick={() => navigate("/support-us")}
        className="font-medium bg-neutral/80 rounded-md px-5 py-1 mt-2"
      >
        Okay
      </button>
    </>
  );
};

export default ThanksPage;
