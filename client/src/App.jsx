import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { useGetUserProfileQuery } from "./slices/usersApiSlice";
import { setCredentials, setAuthChecked, deleteCredentials } from "./slices/authSlice";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: user,
    error,
    isSuccess,
    isError,
  } = useGetUserProfileQuery(undefined, {
    skip: !userInfo,
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials(user));
      dispatch(setAuthChecked());
    }

    if (isError) {
      if (error?.status === 401) {
        dispatch(deleteCredentials());
      }

      dispatch(setAuthChecked());
    }
  }, [user, error, isSuccess, isError, dispatch]);

  const shouldShowFooter =
    !location.pathname.includes("/login") && !location.pathname.includes("/register"); // Check for login and register paths

  return (
    <div className="bg-sharkLight-100/30">
      <ToastContainer />
      <ScrollToTop />
      <Navbar />

      {/* <Outlet /> */}
      <div className="pt-20">
        {/* Equivalent to 80px, matching Navbar's h-20 */}
        <Outlet />
      </div>

      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default App;
