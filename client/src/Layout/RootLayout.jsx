import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Background from "../Components/Background";
import SideSpacing from "../Components/SideSpacing";

const RootLayout = () => {
  const location = useLocation();
  const hideFooter = ["/signup", "/login"];

  const shouldHideFooter = hideFooter.includes(location.pathname);

  return (
    <>
      <Background>
        <Header />
        <SideSpacing className="flex-1">
          <Outlet />
        </SideSpacing>
        {!shouldHideFooter && <Footer />}
      </Background>

      <Toaster />
    </>
  );
};

export default RootLayout;
