import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages
import RootLayout from "./Layout/RootLayout";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/NotFound";
import Jobs from "./Pages/Jobs/Jobs";
import JobDetails from "./Pages/Jobs/JobDetails";
import MyJobs from "./Pages/MyJobs/MyJobs";

// Store
import { useAuthStore } from "./Store/useAuthStore";
import { useJobStore } from "./Store/useJobStore";

const RedirectAuthenticateUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

const ProtectRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { isAdmin, isAuthenticated, isCheckingAuth, checkAuth } =
    useAuthStore();
  const { getCategories, getAllActiveJobs } = useJobStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    getCategories();
    getAllActiveJobs();
  }, [getCategories, getAllActiveJobs]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "signup",
          element: (
            <RedirectAuthenticateUser>
              <Signup />
            </RedirectAuthenticateUser>
          ),
        },
        {
          path: "login",
          element: (
            <RedirectAuthenticateUser>
              <Login />
            </RedirectAuthenticateUser>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "jobs",
          element: <Jobs />,
        },
        {
          path: "jobs/:jobId",
          element: <JobDetails />,
        },
        {
          path: "myjobs",
          element: isAuthenticated && !isAdmin ? <MyJobs /> : <NotFound />,
        },
        {
          path: "myjobs/:jobId",
          element: isAuthenticated && !isAdmin ? <JobDetails /> : <NotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
