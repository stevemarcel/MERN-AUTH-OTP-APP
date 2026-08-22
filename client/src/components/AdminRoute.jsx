import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo, authChecked } = useSelector((state) => state.auth);

  // Wait until authentication state has been checked
  if (!authChecked) {
    return null;
  }

  // Authenticated but not an admin → Home
  if (!userInfo?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
