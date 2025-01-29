import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="w-full py-2 flex flex-col justify-center items-center gap-y-0">
        <p className="text-neutral text-lg">This page doesn't exists</p>

        <p className="text-neutral/75 text-base">
          Return to{" "}
          <span
            onClick={() => navigate("/home")}
            className="text-orange font-bold"
          >
            Home
          </span>{" "}
          page
        </p>
      </section>
    </>
  );
};

export default NotFound;
