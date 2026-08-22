import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo, authChecked } = useSelector((state) => state.auth);

  // Wait until authentication state has been checked
  if (!authChecked) {
    return null;
  }

  // Not logged in → redirect to Home
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
