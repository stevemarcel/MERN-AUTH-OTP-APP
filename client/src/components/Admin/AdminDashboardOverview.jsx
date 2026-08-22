import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"; // For charts
import { FaUsers, FaCheckCircle, FaTimesCircle, FaUserShield } from "react-icons/fa"; // Icons for cards

import { useGetUsersQuery } from "../../slices/usersApiSlice"; // Redux Toolkit Query for fetching users

import Loader from "../Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1942"]; // Chart colors

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded shadow-md text-shark text-sm">
        <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

// const AdminDashboardOverview = ({ stats }) => {
const AdminDashboardOverview = () => {
  const { data: usersData, isLoading: isUsersLoading, isError: isUsersError } = useGetUsersQuery();

  const users = usersData?.users || [];

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((user) => user.emailVerified).length,
    unverifiedUsers: users.filter((user) => !user.emailVerified).length,
    adminUsers: users.filter((user) => user.isAdmin).length,
    nonAdminUsers: users.filter((user) => !user.isAdmin).length,
  };

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

  // Data for Verified vs. Unverified Users Pie Chart
  const verificationData = [
    { name: "Verified Users", value: stats.verifiedUsers },
    { name: "Unverified Users", value: stats.unverifiedUsers },
  ].filter((item) => item.value > 0); // Only include if value > 0

  // Data for Admin vs. Non-Admin Users Pie Chart
  const adminStatusData = [
    { name: "Admin Users", value: stats.adminUsers },
    { name: "Regular Users", value: stats.nonAdminUsers },
  ].filter((item) => item.value > 0); // Only include if value > 0

  return (
    <div className="p-4 bg-white rounded shadow-md text-shark">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
            <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
          </div>
          <FaUsers className="text-blue-600 text-4xl" />
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800">Verified Users</h3>
            <p className="text-3xl font-bold text-green-900">{stats.verifiedUsers}</p>
          </div>
          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">Unverified Users</h3>
            <p className="text-3xl font-bold text-red-900">{stats.unverifiedUsers}</p>
          </div>
          <FaTimesCircle className="text-red-600 text-4xl" />
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-purple-800">Admin Users</h3>
            <p className="text-3xl font-bold text-purple-900">{stats.adminUsers}</p>
          </div>
          <FaUserShield className="text-purple-600 text-4xl" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {verificationData.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">User Verification Status</h3>

            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationData}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                  >
                    {verificationData.map((entry, index) => (
                      <Cell key={`cell-ver-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {adminStatusData.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Admin vs. Regular Users</h3>

            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adminStatusData}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    fill="#82ca9d"
                    dataKey="value"
                    labelLine={false}
                  >
                    {adminStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-admin-${index}`}
                        fill={COLORS[(index + 2) % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Add more dashboard elements here as needed */}
    </div>
  );
};

// AdminDashboardOverview.propTypes = {
//   stats: PropTypes.shape({
//     totalUsers: PropTypes.number.isRequired,
//     verifiedUsers: PropTypes.number.isRequired,
//     unverifiedUsers: PropTypes.number.isRequired,
//     adminUsers: PropTypes.number.isRequired,
//     nonAdminUsers: PropTypes.number.isRequired,
//   }).isRequired,
// };

export default AdminDashboardOverview;
