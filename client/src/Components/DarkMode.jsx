import { useState, useEffect } from "react";

// React Icons
import { IoSunny } from "react-icons/io5";
import { BsMoonFill } from "react-icons/bs";

const DarkMode = ({ className }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("mode") === "dark" ? true : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("mode", "dark");

      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      localStorage.setItem("mode", "light");

      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <div
        className={`w-7 aspect-square bg-gray-500 rounded-full flex justify-center items-center ${className}`}
      >
        {darkMode ? (
          <IoSunny
            className="text-lg text-primary"
            onClick={() => setDarkMode(false)}
          />
        ) : (
          <BsMoonFill
            className="text-lg text-white/80"
            onClick={() => setDarkMode(true)}
          />
        )}
      </div>
    </>
  );
};

export default DarkMode;
