import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"; // For charts
import { FaUsers, FaCheckCircle, FaUserShield, FaUserPlus } from "react-icons/fa";

import Loader from "../Loader";

import { useGetUsersQuery } from "../../slices/usersApiSlice"; // Redux Toolkit Query for fetching users
import { useGetRecentUserActivitiesQuery } from "../../slices/userActivityApiSlice";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

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

  const {
    data: activityData,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
  } = useGetRecentUserActivitiesQuery();

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

  const users = usersData?.users || [];
  const activities = activityData?.activities || [];

  console.log("Recent Activities:", activities);

  const now = new Date();

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((user) => user.emailVerified).length,
    unverifiedUsers: users.filter((user) => !user.emailVerified).length,
    adminUsers: users.filter((user) => user.isAdmin).length,
    nonAdminUsers: users.filter((user) => !user.isAdmin).length,
    adminCreatedUsers: users.filter((user) => user.isAdminCreatingUser).length,
    selfRegisteredUsers: users.filter((user) => !user.isAdminCreatingUser).length,

    newUsersThisMonth: users.filter((user) => {
      const date = new Date(user.createdAt);

      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

  // Data for Registration Trend Line Chart
  const registrationTrendData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const year = date.getFullYear();
    const monthNumber = date.getMonth();

    const count = users.filter((user) => {
      const createdAt = new Date(user.createdAt);

      return createdAt.getMonth() === monthNumber && createdAt.getFullYear() === year;
    }).length;

    return {
      month,
      users: count,
    };
  });

  // Data for Verified vs. Unverified Users Pie Chart
  const verificationData = [
    { name: "Verified Users", value: stats.verifiedUsers },
    { name: "Unverified Users", value: stats.unverifiedUsers },
  ].filter((item) => item.value > 0); // Only include if value > 0

  // Data for Admin vs. Non-Admin Users Pie Chart
  const registrationSourceData = [
    {
      name: "Self Registered",
      value: stats.selfRegisteredUsers,
    },
    {
      name: "Admin Created",
      value: stats.adminCreatedUsers,
    },
  ].filter((item) => item.value > 0);

  const formatActivityDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <div className="p-4 bg-white rounded shadow-md text-shark">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
            <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
          </div>

          <FaUsers className="text-blue-600 text-4xl" />
        </div>

        {/* New This Month Card */}
        <div className="bg-orange-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-orange-800">New This Month</h3>
            <p className="text-3xl font-bold text-orange-900">{stats.newUsersThisMonth}</p>
          </div>

          <FaUserPlus className="text-orange-600 text-4xl" />
        </div>

        {/* Verified Users Card */}
        <div className="bg-green-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800">Verified Users</h3>
            <p className="text-3xl font-bold text-green-900">{stats.verifiedUsers}</p>
          </div>

          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>

        {/* Admin Users Card */}
        <div className="bg-purple-100 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-purple-800">Admin Users</h3>
            <p className="text-3xl font-bold text-purple-900">{stats.adminUsers}</p>
          </div>

          <FaUserShield className="text-purple-600 text-4xl" />
        </div>
      </div>

      {/* User Registration Trend Chart */}
      <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">User Registration Trend</h3>

        <div className="w-full h-[280px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#0088FE"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        {registrationSourceData.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Registration Source</h3>

            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationSourceData}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    dataKey="value"
                  >
                    {registrationSourceData.map((entry, index) => (
                      <Cell
                        key={`cell-source-${index}`}
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

      {/* Recent User Activity */}
      <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>

          <button type="button" className="text-sm font-semibold text-shark hover:underline">
            View All
          </button>
        </div>

        {isActivitiesLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader />
            <span className="ml-2 text-shark">Loading recent activity...</span>
          </div>
        ) : isActivitiesError ? (
          <div className="text-center text-red-600 py-6">
            Error loading recent activity. Please try again.
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-sharkLight-300 py-6">No recent activity found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center min-w-0">
                  {/* User Profile */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        activity.user?.profile
                          ? `${BACKEND_BASE_URL}${activity.user.profile}`
                          : `${BACKEND_BASE_URL}/uploads/profiles/placeholder.png`
                      }
                      alt={
                        activity.user
                          ? `${activity.user.firstName} ${activity.user.lastName}`
                          : "User"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Activity Description */}
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-shark">{activity.description}</p>

                    <p className="text-xs text-sharkLight-300 mt-1">
                      {activity.action.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Activity Date */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-sharkLight-300">
                    {formatActivityDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
