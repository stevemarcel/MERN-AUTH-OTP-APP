import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo, authChecked } = useSelector((state) => state.auth);

  // Wait until authentication has been checked
  if (!authChecked) {
    return null;
  }

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin
  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Authenticated admin
  return <Outlet />;
};

export default AdminRoute;
