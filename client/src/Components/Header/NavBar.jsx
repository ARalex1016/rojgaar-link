import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

const Link = ({ to, children }) => {
  return (
    <>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-24 text-lg font-medium ${
            isActive
              ? "text-accent"
              : "text-neutral opacity-60 hover:opacity-100"
          }`
        }
      >
        {children}
      </NavLink>
    </>
  );
};

/* ALl Nav Links */
const NavBar = ({ closeNavBar }) => {
  const navigate = useNavigate();

  const { isAdmin, isCreator, isCandidate, isAuthenticated, logout } =
    useAuthStore();

  const handleLogout = async () => {
    navigate("login");

    try {
      await logout();

      closeNavBar();
    } catch (error) {}
  };

  return (
    <>
      <Link to="/">Home</Link>

      {isAuthenticated && (isCandidate || isCreator) && (
        <Link to="/profile">Profile</Link>
      )}
      <Link to="/jobs">Jobs</Link>

      {isAuthenticated && !isAdmin && <Link to="/myjobs">My Jobs</Link>}

      <Link to="/user">User</Link>

      <Link to="/support-us">Support Us</Link>

      {isAuthenticated ? (
        <p
          onClick={handleLogout}
          className="w-24 text-neutral/80 bg-red/80 text-center rounded-md px-2 cursor-pointer hover:neutral hover:bg-red hover:shadow-sm hover:shadow-red/60"
        >
          Logout
        </p>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </>
  );
};

export const MobileNavBar = ({ showMobileNav, closeNavBar }) => {
  const mobileNavBar = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileNavBar.current &&
        !mobileNavBar.current.contains(event.target)
      ) {
        closeNavBar();
      }
    };

    // Adding event listener on mount
    if (showMobileNav) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMobileNav, closeNavBar]);

  return (
    <>
      <AnimatePresence>
        {showMobileNav && (
          <motion.nav
            variants={{
              initial: { maxHeight: 0, paddingBlock: 0 },
              final: {
                maxHeight: "80vh",
                paddingBlock: "16px",
              },
            }}
            initial="initial"
            animate="final"
            exit="initial"
            transition={{
              duration: 0.3,
              ease: "anticipate",
            }}
            ref={mobileNavBar}
            className="w-1/2 text-white text-lg font-medium bg-primary/50 backdrop-blur-[6px] flex flex-col items-center gap-y-3 shadow-md shadow-main/80 rounded-md overflow-hidden absolute right-sideSpacing top-full sm:hidden z-50"
          >
            <NavBar closeNavBar={closeNavBar} />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export const DesktopNavBar = () => {
  return (
    <>
      <nav className="hidden sm:flex gap-x-8">
        <NavBar />
      </nav>
    </>
  );
};
