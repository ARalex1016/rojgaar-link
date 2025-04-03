// Utils
import { capitalize } from "@mui/material";

const TabsWithCounter = ({
  activeTab,
  setActiveTab,
  counter,
  children,
  className,
}) => {
  if (!counter) counter = null;

  if (isNaN(counter)) counter = null;

  if (counter <= 0) counter = null;

  if (counter > 9) counter = "+9";

  return (
    <div className="relative overflow-visible inline-block">
      {counter && (
        <p className="w-5 h-5 text-neutral text-xs font-medium bg-customBlue flex items-center justify-center rounded-full absolute -top-2 -right-2">
          {counter}
        </p>
      )}

      <button
        onClick={() => setActiveTab(children)}
        className={`min-w-20 w-auto flex-shrink-0 text-neutral/80 font-medium rounded-md px-4 py-1 hover:text-neutral ${
          activeTab === children
            ? "bg-main/80 hover:bg-main"
            : "bg-gray/80 hover:bg-gray"
        } ${className}`}
      >
        {capitalize(children)}
      </button>
    </div>
  );
};

export default TabsWithCounter;
