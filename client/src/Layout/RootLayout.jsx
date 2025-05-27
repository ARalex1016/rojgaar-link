import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Background from "../Components/Background";
import SideSpacing from "../Components/SideSpacing";
import { LoadingLinear } from "../Components/Loading";
import { ShareSocial } from "../Components/ShareSocial/ShareSocial";

// Store
import { useAuthStore } from "../Store/useAuthStore";

const RootLayout = () => {
  const { isLoading } = useAuthStore();

  const location = useLocation();
  const hideFooter = ["/signup", "/login", "/stripe"];

  const shouldHideFooter = hideFooter.includes(location.pathname);

  return (
    <>
      <Background>
        <Header />

        <LoadingLinear isVisible={isLoading} />

        <ShareSocial />

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
