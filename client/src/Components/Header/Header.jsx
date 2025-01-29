import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Components
import SideSpacing from "../SideSpacing";

// Components/Header
import { MobileNavBar, DesktopNavBar } from "./NavBar";

// React-icons
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Header = () => {
  const location = useLocation();

  const [showMobileNav, setShowMobileNav] = useState(false);

  const closeNavBar = () => {
    setShowMobileNav(false);
  };

  // Close Navbar on route change
  useEffect(() => {
    closeNavBar();
  }, [location]);

  return (
    <>
      <header className="w-[100vw] sticky top-0 z-50">
        <SideSpacing className="w-full h-16 bg-primary/40 backdrop-blur-[5px] shadow-sm shadow-main/50 flex justify-between items-center ">
          <h2 className="text-xl font-medium text-accent">Rojgaar Link</h2>

          {/*  Menu bar & Cross Icon  */}
          {showMobileNav ? (
            <RxCross2
              className="text-neutral text-2xl opacity-75 hover:opacity-100 cursor-pointer sm:hidden"
              onClick={() => setShowMobileNav(false)}
            />
          ) : (
            <IoMenu
              className="text-neutral text-2xl opacity-75 hover:opacity-100 cursor-pointer sm:hidden"
              onClick={() => setShowMobileNav(true)}
            />
          )}

          {/* Desktop Navbar */}
          <DesktopNavBar />
        </SideSpacing>

        {/* Mobile Navbar */}
        <MobileNavBar showMobileNav={showMobileNav} closeNavBar={closeNavBar} />
      </header>
    </>
  );
};

export default Header;
