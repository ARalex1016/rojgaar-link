import { NavLink, Outlet } from "react-router-dom";

const SupportUs = () => {
  return (
    <>
      <div>
        {/* Tab */}
        {/* <section className="w-full flex flex-row  justify-around flex-nowrap gap-x-4 overflow-auto scrollbar-hide my-2">
          <NavLink
            to="."
            end // Ensure exact matching to the index route
            className={({ isActive }) =>
              `text-neutral rounded-md px-4 py-1 ${
                isActive
                  ? "bg-main/80 hover:bg-main"
                  : "bg-gray/80 hover:bg-gray"
              }`
            }
          >
            <button>Donate</button>
          </NavLink>

          <NavLink
            to="top-donors"
            className={({ isActive }) =>
              `text-neutral rounded-md px-4 py-1 ${
                isActive
                  ? "bg-main/80 hover:bg-main"
                  : "bg-gray/80 hover:bg-gray"
              }`
            }
          >
            <button>Top Donors</button>
          </NavLink>
        </section> */}

        <section className="w-full flex flex-col items-center justify-center gap-y-1 py-4">
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default SupportUs;
