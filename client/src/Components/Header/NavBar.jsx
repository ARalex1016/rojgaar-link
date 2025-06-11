import { useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
            isActive ? "text-accent" : "text-neutral/70 hover:text-neutral"
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
  const { pathname } = useLocation();

  const { isAdmin, isCreator, isCandidate, isAuthenticated, logout } =
    useAuthStore();

  const handleLogout = async () => {
    navigate("login");

    try {
      await logout();

      closeNavBar();
    } catch (error) {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

      <Link to="/contact-us">Contact Us</Link>

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
    const handleOutsideInteraction = (event) => {
      if (
        mobileNavBar.current &&
        !mobileNavBar.current.contains(event.target)
      ) {
        closeNavBar();
      }
    };

    const handleScroll = () => {
      closeNavBar();
    };

    // Adding event listener on mount
    if (showMobileNav) {
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("keydown", handleOutsideInteraction);
      window.addEventListener("scroll", handleScroll);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("keydown", handleOutsideInteraction);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMobileNav, closeNavBar]);

  return (
    <>
      <AnimatePresence>
        {showMobileNav && (
          <motion.nav
            variants={{
              initial: {
                maxHeight: 0,
                paddingBlock: 0,
              },
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
              ease: "easeInOut",
            }}
            ref={mobileNavBar}
            className="w-1/2 text-white text-lg font-medium bg-primary/70 backdrop-blur-[6px] flex flex-col items-center gap-y-3 shadow-md shadow-main/80 rounded-md overflow-hidden absolute right-sideSpacing top-full sm:hidden z-50"
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
