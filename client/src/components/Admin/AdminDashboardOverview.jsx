import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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
} from "recharts";

import {
  FaUsers,
  FaCheckCircle,
  FaUserShield,
  FaUserPlus,
  FaBoxOpen,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBoxes,
} from "react-icons/fa";

import Loader from "../Loader";

import { useGetDashboardOverviewQuery } from "../../slices/dashboardApiSlice";

import { getProfileImageUrl } from "../../utils/profileImageUrl";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1942"];

const INVENTORY_STATUS_CONFIG = {
  in_stock: {
    name: "In Stock",
    color: "#16a34a",
  },

  low_stock: {
    name: "Low Stock",
    color: "#eab308",
  },

  out_of_stock: {
    name: "Out Of Stock",
    color: "#dc2626",
  },
};

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

const AdminDashboardOverview = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetDashboardOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />

        <span className="ml-2 text-shark">Loading dashboard data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 p-4">
        <p className="font-semibold">Error loading dashboard data.</p>

        <p className="text-sm mt-2">
          {error?.data?.message || error?.error || "Please try again."}
        </p>
      </div>
    );
  }

  const users = data?.users || {};
  const products = data?.products || {};
  const inventory = data?.inventory || {};

  const registrationTrend = data?.registrationTrend || [];

  const verificationStatus = data?.verificationStatus || [];

  const registrationSource = data?.registrationSource || [];

  const stockStatus = data?.stockStatus || [];

  const lowStockProducts = data?.lowStockProducts || [];

  const recentUserActivities = data?.recentUserActivities || [];

  const recentInventoryActivities = data?.recentInventoryActivities || [];

  const inventoryStatusChartData = Object.entries(INVENTORY_STATUS_CONFIG).map(([key, config]) => {
    const item = stockStatus.find((entry) => entry.status === key);

    return {
      key,
      name: config.name,
      count: item?.count || 0,
      fill: config.color,
    };
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const formatActivityDate = (date) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const getInventoryActivityLabel = (action) => {
    const labels = {
      stock_received: "Stock Received",
      stock_added: "Stock Added",
      stock_removed: "Stock Removed",
      stock_adjusted: "Stock Adjusted",
      stock_damaged: "Stock Damaged",
      stock_returned: "Stock Returned",
    };

    return labels[action] || action;
  };

  const getInventoryActivityClass = (action) => {
    if (action === "stock_added" || action === "stock_received" || action === "stock_returned") {
      return "text-green-700";
    }

    if (action === "stock_removed" || action === "stock_damaged") {
      return "text-red-700";
    }

    return "text-shark";
  };

  return (
    <div className="p-4 bg-white rounded shadow-md text-shark">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      </div>

      {/* ======================================================
          USER SUMMARY
      ======================================================= */}

      <h3 className="text-sm uppercase font-semibold text-sharkLight-300 mb-3">Users</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-blue-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Total Users</h4>

            <p className="text-3xl font-bold text-blue-900">{users.totalUsers || 0}</p>
          </div>

          <FaUsers className="text-blue-600 text-4xl" />
        </div>

        {/* New This Month */}
        <div className="bg-orange-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-orange-800">New This Month</h4>

            <p className="text-3xl font-bold text-orange-900">{users.newUsersThisMonth || 0}</p>
          </div>

          <FaUserPlus className="text-orange-600 text-4xl" />
        </div>

        {/* Verified */}
        <div className="bg-green-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-green-800">Verified Users</h4>

            <p className="text-3xl font-bold text-green-900">{users.verifiedUsers || 0}</p>
          </div>

          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>

        {/* Admin */}
        <div className="bg-purple-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-purple-800">Admin Users</h4>

            <p className="text-3xl font-bold text-purple-900">{users.adminUsers || 0}</p>
          </div>

          <FaUserShield className="text-purple-600 text-4xl" />
        </div>
      </div>

      {/* ======================================================
          PRODUCT / INVENTORY SUMMARY
      ======================================================= */}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold text-sharkLight-300">
          Products & Inventory
        </h3>

        <button
          type="button"
          onClick={() => navigate("/admin/inventory")}
          className="text-sm font-semibold text-shark hover:underline"
        >
          View Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Active Products */}
        <div className="bg-sharkLight-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Active Products</h4>

            <p className="text-3xl font-bold mt-1">{products.active || 0}</p>
          </div>

          <FaBoxOpen className="text-4xl" />
        </div>

        {/* Low Stock */}
        <div className="bg-orange-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-orange-800">Low Stock</h4>

            <p className="text-3xl font-bold text-orange-900">{products.lowStock || 0}</p>
          </div>

          <FaExclamationTriangle className="text-orange-600 text-4xl" />
        </div>

        {/* Out of Stock */}
        <div className="bg-red-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-red-800">Out of Stock</h4>

            <p className="text-3xl font-bold text-red-900">{products.outOfStock || 0}</p>
          </div>

          <FaTimesCircle className="text-red-600 text-4xl" />
        </div>

        {/* Inventory Value */}
        <div className="bg-green-100 p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-green-800">Inventory Value</h4>

            <p className="text-xl font-bold text-green-900 mt-1">
              {formatCurrency(inventory.totalInventoryValue)}
            </p>
          </div>

          <FaBoxes className="text-green-600 text-4xl" />
        </div>
      </div>

      {/* ======================================================
          REGISTRATION TREND
      ======================================================= */}

      <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">User Registration Trend</h3>

        <div className="w-full h-[280px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrend}>
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

      {/* ======================================================
          USER CHARTS
      ======================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {verificationStatus.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">User Verification Status</h3>

            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationStatus}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    dataKey="value"
                    labelLine={false}
                  >
                    {verificationStatus.map((entry, index) => (
                      <Cell key={`verification-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {registrationSource.length > 0 && (
          <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Registration Source</h3>

            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationSource}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    dataKey="value"
                  >
                    {registrationSource.map((entry, index) => (
                      <Cell key={`source-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
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

      {/* ======================================================
          INVENTORY STATUS + LOW STOCK
      ======================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stock Status */}
        <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Inventory Status</h3>

            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              className="text-sm font-semibold hover:underline"
            >
              Manage
            </button>
          </div>

          {stockStatus.length === 0 ? (
            <div className="text-center text-sharkLight-300 py-8">No inventory data available.</div>
          ) : (
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryStatusChartData}
                    cx="50%"
                    cy="45%"
                    outerRadius="65%"
                    dataKey="count"
                    nameKey="name"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                  >
                    {inventoryStatusChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value, name) => [value, name]} />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Low Stock Products</h3>

            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              className="text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FaCheckCircle className="text-4xl text-green-600 mb-3" />

              <p className="font-semibold">No low-stock products</p>

              <p className="text-sm text-sharkLight-300 mt-1">Inventory levels look good.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center min-w-0">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-sharkLight-100 flex items-center justify-center flex-shrink-0">
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaBoxOpen className="text-sharkLight-300" />
                      )}
                    </div>

                    <div className="ml-3 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>

                      <p className="text-xs text-sharkLight-300">{product.sku}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-orange-600">
                      {product.stockQuantity} {product.unit}
                    </p>

                    <p className="text-xs text-sharkLight-300">
                      Alert at {product.lowStockThreshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          RECENT INVENTORY ACTIVITY
      ======================================================= */}

      <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Inventory Activity</h3>

          <button
            type="button"
            onClick={() => navigate("/admin/inventory/activities")}
            className="text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {recentInventoryActivities.length === 0 ? (
          <div className="text-center text-sharkLight-300 py-6">No recent inventory activity.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentInventoryActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{activity.product?.name || "Product"}</p>

                  <p className="text-xs text-sharkLight-300 mt-1">
                    <span className={`font-semibold ${getInventoryActivityClass(activity.action)}`}>
                      {getInventoryActivityLabel(activity.action)}
                    </span>

                    {" • "}

                    {activity.reason || "No reason provided"}
                  </p>
                </div>

                <div className="text-sm sm:text-right flex-shrink-0">
                  <p className="font-semibold">
                    {activity.action === "stock_added" ||
                    activity.action === "stock_received" ||
                    activity.action === "stock_returned"
                      ? "+"
                      : activity.action === "stock_removed" || activity.action === "stock_damaged"
                        ? "-"
                        : "±"}
                    {activity.quantity}
                  </p>

                  <p className="text-xs text-sharkLight-300 mt-1">
                    {activity.performedBy
                      ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
                      : "Unknown user"}{" "}
                    • {formatActivityDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================
          RECENT USER ACTIVITY
      ======================================================= */}

      <div className="bg-gray-50 p-3 sm:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent User Activity</h3>

          <button
            type="button"
            onClick={() => navigate("/admin/users/activities")}
            className="text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {recentUserActivities.length === 0 ? (
          <div className="text-center text-sharkLight-300 py-6">No recent activity found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentUserActivities.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={getProfileImageUrl(activity.user?.profile, BACKEND_BASE_URL)}
                      alt={
                        activity.user
                          ? `${activity.user.firstName} ${activity.user.lastName}`
                          : "User"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>

                    <p className="text-xs text-sharkLight-300 mt-1">
                      {activity.action.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

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
