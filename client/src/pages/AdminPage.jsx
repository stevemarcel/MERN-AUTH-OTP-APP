import { useSelector } from "react-redux";
import { FaShieldHalved } from "react-icons/fa6";
import { useGetUsersQuery } from "../slices/usersApiSlice";

import AdminDashboardOverview from "../components/Admin/AdminDashboardOverview";
import Hero from "../components/Hero";
import Loader from "../components/Loader";

const AdminPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: usersData, isLoading: isUsersLoading, isError: isUsersError } = useGetUsersQuery();

  const users = usersData?.users || [];

  const dashboardStats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((user) => user.emailVerified).length,
    unverifiedUsers: users.filter((user) => !user.emailVerified).length,
    adminUsers: users.filter((user) => user.isAdmin).length,
    nonAdminUsers: users.filter((user) => !user.isAdmin).length,
  };

  const adminPageDescription = [
    `Welcome to the administrator dashboard, ${userInfo.firstName}`,
    <FaShieldHalved key="admin-icon" className="inline-block" />,
    `. `,
    `Here you can manage users, products, and more.`,
  ];

  if (isUsersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
        <span className="ml-2 text-shark">Loading dashboard data...</span>
      </div>
    );
  }

  if (isUsersError) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading user data for dashboard. Please try again.
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-shark mb-6 md:mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <Hero description={adminPageDescription} inlineDescription={true} />
      </div>

      <AdminDashboardOverview stats={dashboardStats} />
    </>
  );
};

export default AdminPage;
