import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

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
  // FaUserShield,
  FaUserPlus,
  FaBoxOpen,
  FaExclamationTriangle,
  // FaTimesCircle,
  FaBoxes,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaPlus,
  FaPencilAlt,
  FaArchive,
  FaUndo,
  FaUserCog,
  FaShieldAlt,
} from "react-icons/fa";

import Loader from "../Loader";

import { useGetDashboardOverviewQuery } from "../../slices/dashboardApiSlice";

import { getProfileImageUrl } from "../../utils/profileImageUrl";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

/* ================================================================
  CHART COLOURS
================================================================ */
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1942"];

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

/* ================================================================
  SHARED CHART TOOLTIP
================================================================ */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-semibold text-slate-800">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

/* ================================================================
  ACTIVITY CONFIGURATION
  Keeping the visual treatment in one place makes the activity
  sections easier to maintain and extend.
================================================================ */

/* ---------------------------
  USER ACTIVITY
---------------------------- */
const USER_ACTIVITY_CONFIG = {
  registered: {
    label: "Registered",
    icon: FaUserPlus,
    iconClass: "bg-blue-50 text-blue-600",
    badgeClass: "bg-blue-50 text-blue-700",
  },

  profile_updated: {
    label: "Profile Updated",
    icon: FaPencilAlt,
    iconClass: "bg-slate-100 text-slate-600",
    badgeClass: "bg-slate-100 text-slate-700",
  },

  profile_picture_updated: {
    label: "Photo Updated",
    icon: FaPencilAlt,
    iconClass: "bg-purple-50 text-purple-600",
    badgeClass: "bg-purple-50 text-purple-700",
  },

  email_verified: {
    label: "Email Verified",
    icon: FaCheckCircle,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
  },

  password_changed: {
    label: "Password Changed",
    icon: FaShieldAlt,
    iconClass: "bg-orange-50 text-orange-600",
    badgeClass: "bg-orange-50 text-orange-700",
  },

  admin_updated: {
    label: "Access Updated",
    icon: FaUserCog,
    iconClass: "bg-indigo-50 text-indigo-600",
    badgeClass: "bg-indigo-50 text-indigo-700",
  },

  removed: {
    label: "User Removed",
    icon: FaArchive,
    iconClass: "bg-red-50 text-red-600",
    badgeClass: "bg-red-50 text-red-700",
  },

  restored: {
    label: "User Restored",
    icon: FaUndo,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
  },

  deleted: {
    label: "User Deleted",
    icon: FaArchive,
    iconClass: "bg-red-50 text-red-600",
    badgeClass: "bg-red-50 text-red-700",
  },
};

/* ---------------------------
  PRODUCT ACTIVITY
---------------------------- */
const PRODUCT_ACTIVITY_CONFIG = {
  product_created: {
    label: "Product Created",
    icon: FaPlus,
    iconClass: "bg-blue-50 text-blue-600",
    badgeClass: "bg-blue-50 text-blue-700",
  },

  product_updated: {
    label: "Product Updated",
    icon: FaPencilAlt,
    iconClass: "bg-slate-100 text-slate-600",
    badgeClass: "bg-slate-100 text-slate-700",
  },

  product_archived: {
    label: "Product Archived",
    icon: FaArchive,
    iconClass: "bg-red-50 text-red-600",
    badgeClass: "bg-red-50 text-red-700",
  },

  product_restored: {
    label: "Product Restored",
    icon: FaUndo,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
  },
};

/* ---------------------------
  INVENTORY ACTIVITY
---------------------------- */
const INVENTORY_ACTIVITY_CONFIG = {
  stock_received: {
    label: "Stock Received",
    icon: FaArrowUp,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
    quantityPrefix: "+",
  },

  stock_added: {
    label: "Stock Added",
    icon: FaArrowUp,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
    quantityPrefix: "+",
  },

  stock_removed: {
    label: "Stock Removed",
    icon: FaArrowDown,
    iconClass: "bg-red-50 text-red-600",
    badgeClass: "bg-red-50 text-red-700",
    quantityPrefix: "-",
  },

  stock_adjusted: {
    label: "Stock Adjusted",
    icon: FaExchangeAlt,
    iconClass: "bg-orange-50 text-orange-600",
    badgeClass: "bg-orange-50 text-orange-700",
    quantityPrefix: "±",
  },

  stock_damaged: {
    label: "Stock Damaged",
    icon: FaArrowDown,
    iconClass: "bg-red-50 text-red-600",
    badgeClass: "bg-red-50 text-red-700",
    quantityPrefix: "-",
  },

  stock_returned: {
    label: "Stock Returned",
    icon: FaArrowUp,
    iconClass: "bg-green-50 text-green-600",
    badgeClass: "bg-green-50 text-green-700",
    quantityPrefix: "+",
  },
};

/* ================================================================
  HELPER COMPONENTS
================================================================ */

/* ---------------------------
  SECTION HEADER
---------------------------- */
const SectionHeader = ({ eyebrow, title, actionText, onAction }) => (
  <div className="flex items-end justify-between gap-4 mb-4">
    <div>
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
          {eyebrow}
        </p>
      )}

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{title}</h3>
    </div>

    {actionText && (
      <button
        type="button"
        onClick={onAction}
        className="text-xs sm:text-sm font-semibold text-shark hover:text-sharkDark-300 hover:underline whitespace-nowrap"
      >
        {actionText}
      </button>
    )}
  </div>
);

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

/* ---------------------------
  ACTIVITY EMPTY STATE
---------------------------- */
const ActivityEmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[250px] text-center px-4">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <FaBoxes className="text-slate-300 text-xl" />
    </div>

    <p className="text-sm font-medium text-slate-600">{message}</p>

    <p className="text-xs text-slate-400 mt-1">New activity will appear here.</p>
  </div>
);

ActivityEmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};

/* ---------------------------
  MOBILE DETECTION HOOK
---------------------------- */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
};

/* ================================================================
  MAIN DASHBOARD
================================================================ */
const AdminDashboardOverview = () => {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const { data, isLoading, isError, error } = useGetDashboardOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  /* ================================================================
    LOADING STATE
  ================================================================ */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />

        <span className="ml-2 text-shark">Loading dashboard data...</span>
      </div>
    );
  }

  /* ================================================================
    ERROR STATE
  ================================================================ */
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Error loading dashboard data.</p>

          <p className="text-sm text-red-600 mt-2">
            {error?.data?.message || error?.error || "Please try again."}
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================
    API DATA
  ================================================================ */
  const users = data?.users || {};
  const products = data?.products || {};
  const inventory = data?.inventory || {};

  const registrationTrend = data?.registrationTrend || [];
  // const verificationStatus = data?.verificationStatus || [];
  // const registrationSource = data?.registrationSource || [];
  const stockStatus = data?.stockStatus || [];

  const lowStockProducts = data?.lowStockProducts || [];

  const recentUserActivities = data?.recentUserActivities || [];

  // The dashboard API should expose this array for the new
  // Product Activity section.
  const recentProductActivities = data?.recentProductActivities || [];

  const recentInventoryActivities = data?.recentInventoryActivities || [];

  /* ================================================================
    INVENTORY CHART DATA
    Zero-value categories are removed from the actual pie so the
    chart doesn't render empty slices or labels.
  ================================================================ */
  const inventoryStatusChartData = Object.entries(INVENTORY_STATUS_CONFIG)
    .map(([key, config]) => {
      const item = stockStatus.find((entry) => entry.status === key);

      return {
        key,
        name: config.name,
        count: item?.count || 0,
        fill: config.color,
      };
    })
    .filter((entry) => entry.count > 0);

  /* ================================================================
    FORMATTERS
  ================================================================ */
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

  /* ================================================================
    ACTIVITY HELPERS
  ================================================================ */

  const getUserActivityConfig = (action) => {
    return (
      USER_ACTIVITY_CONFIG[action] || {
        label: action?.replaceAll("_", " ") || "Activity",
        icon: FaUsers,
        iconClass: "bg-slate-100 text-slate-600",
        badgeClass: "bg-slate-100 text-slate-700",
      }
    );
  };

  const getProductActivityConfig = (action) => {
    return (
      PRODUCT_ACTIVITY_CONFIG[action] || {
        label: action?.replaceAll("_", " ") || "Activity",
        icon: FaBoxOpen,
        iconClass: "bg-slate-100 text-slate-600",
        badgeClass: "bg-slate-100 text-slate-700",
      }
    );
  };

  const getInventoryActivityConfig = (action) => {
    return (
      INVENTORY_ACTIVITY_CONFIG[action] || {
        label: action?.replaceAll("_", " ") || "Activity",
        icon: FaBoxes,
        iconClass: "bg-slate-100 text-slate-600",
        badgeClass: "bg-slate-100 text-slate-700",
        quantityPrefix: "±",
      }
    );
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="p-4 sm:p-5 lg:p-6 max-w-[1600px] mx-auto">
        {/* ==========================================================
            PAGE HEADER
        =========================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
              Administration
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Dashboard Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Monitor your users, products and inventory from one place.
            </p>
          </div>
        </div>

        {/* ==========================================================
            KEY METRICS
        =========================================================== */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Users
                  </p>

                  <p className="text-3xl font-bold mt-2 text-slate-900">{users.totalUsers || 0}</p>

                  <p className="text-xs text-slate-500 mt-1">
                    {users.newUsersThisMonth || 0} new this month
                  </p>
                </div>

                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Active Products
                  </p>

                  <p className="text-3xl font-bold mt-2 text-slate-900">{products.active || 0}</p>

                  <p className="text-xs text-slate-500 mt-1">
                    {products.total || products.active || 0} total products
                  </p>
                </div>

                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FaBoxOpen className="text-slate-700 text-lg" />
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Low Stock
                  </p>

                  <p className="text-3xl font-bold mt-2 text-slate-900">{products.lowStock || 0}</p>

                  <p className="text-xs text-slate-500 mt-1">
                    {products.outOfStock || 0} currently out of stock
                  </p>
                </div>

                <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center">
                  <FaExclamationTriangle className="text-orange-600 text-lg" />
                </div>
              </div>
            </div>

            {/* Inventory Value */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Inventory Value
                  </p>

                  <p className="text-2xl font-bold mt-2 text-slate-900 truncate">
                    {formatCurrency(inventory.totalInventoryValue)}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {inventory.totalUnits || 0} units in inventory
                  </p>
                </div>

                <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <FaBoxes className="text-green-600 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            ANALYTICS
        =========================================================== */}
        <section className="mb-8">
          <SectionHeader eyebrow="Analytics" title="Business Overview" />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Registration Trend */}
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-semibold text-slate-900">User Registration Trend</h4>

                  <p className="text-xs text-slate-400 mt-1">Monthly user registrations</p>
                </div>

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-sm" />
                </div>
              </div>

              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={registrationTrend}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "#94a3b8",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#94a3b8",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

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

            {/* Inventory Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-semibold text-slate-900">Inventory Status</h4>

                  <p className="text-xs text-slate-400 mt-1">Current stock distribution</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/inventory")}
                  className="text-xs font-semibold text-shark hover:underline"
                >
                  View
                </button>
              </div>

              {inventoryStatusChartData.length === 0 ? (
                <div className="flex items-center justify-center h-[280px] text-center">
                  <div>
                    <FaBoxes className="text-3xl text-slate-200 mx-auto mb-3" />

                    <p className="text-sm font-medium text-slate-500">No inventory data</p>
                  </div>
                </div>
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
                        label={({ name, percent }) =>
                          isMobile
                            ? `${Math.round(percent * 100)}%`
                            : `${name} ${Math.round(percent * 100)}%`
                        }
                      >
                        {inventoryStatusChartData.map((entry) => (
                          <Cell key={entry.key} fill={entry.fill} />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================================
            INVENTORY FOCUS
        =========================================================== */}
        <section className="mb-8">
          <SectionHeader
            eyebrow="Inventory"
            title="Stock Attention"
            actionText="Manage Inventory"
            onAction={() => navigate("/admin/inventory")}
          />

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>

                <p className="font-semibold text-slate-700">Inventory levels look good</p>

                <p className="text-sm text-slate-400 mt-1">
                  There are currently no low-stock products.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaBoxOpen className="text-slate-300" />
                        )}
                      </div>

                      <div className="ml-3 min-w-0">
                        <p className="font-medium text-sm text-slate-800 truncate">
                          {product.name}
                        </p>

                        <p className="text-xs text-slate-400 truncate">{product.sku}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-orange-600">
                        {product.stockQuantity} {product.unit}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Alert at {product.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lowStockProducts.length > 6 && (
              <div className="px-5 py-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/inventory")}
                  className="text-xs font-semibold text-shark hover:underline"
                >
                  View all {lowStockProducts.length} low-stock products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ==========================================================
            ACTIVITY HUB
            Three dedicated activity streams make it immediately
            clear whether an event concerns users, products or stock.
        =========================================================== */}
        <section>
          <SectionHeader eyebrow="Activity" title="Recent Activity" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ======================================================
                USER ACTIVITY
            ======================================================= */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-sm" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Users</h4>

                    <p className="text-[11px] text-slate-400">Account activity</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users/activities")}
                  className="text-xs font-semibold text-shark hover:underline"
                >
                  View all
                </button>
              </div>

              {recentUserActivities.length === 0 ? (
                <ActivityEmptyState message="No user activity yet" />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentUserActivities.slice(0, 6).map((activity) => {
                    const config = getUserActivityConfig(activity.action);

                    const Icon = config.icon;

                    return (
                      <div key={activity._id} className="px-4 sm:px-5 py-4">
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
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

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-slate-800 leading-5">
                                {activity.description}
                              </p>

                              <div
                                className={`w-7 h-7 rounded-full ${config.iconClass} flex items-center justify-center shrink-0`}
                              >
                                <Icon className="text-[11px]" />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${config.badgeClass}`}
                              >
                                {config.label}
                              </span>

                              <span className="text-[10px] text-slate-400">
                                {formatActivityDate(activity.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ======================================================
                PRODUCT ACTIVITY
            ======================================================= */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <FaBoxOpen className="text-purple-600 text-sm" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Products</h4>

                    <p className="text-[11px] text-slate-400">Catalogue activity</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products/activities")}
                  className="text-xs font-semibold text-shark hover:underline"
                >
                  View all
                </button>
              </div>

              {recentProductActivities.length === 0 ? (
                <ActivityEmptyState message="No product activity yet" />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentProductActivities.slice(0, 6).map((activity) => {
                    const config = getProductActivityConfig(activity.action);

                    const Icon = config.icon;

                    return (
                      <div key={activity._id} className="px-4 sm:px-5 py-4">
                        <div className="flex gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${config.iconClass} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="text-sm" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {activity.product?.name || "Product"}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                  {activity.product?.sku || "No SKU"}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeClass}`}
                              >
                                {config.label}
                              </span>

                              {activity.changedFields?.length > 0 && (
                                <span className="text-[10px] text-slate-400 uppercase truncate">
                                  {activity.changedFields.slice(0, 2).join(", ")}
                                  {activity.changedFields.length > 2 ? "..." : ""}
                                </span>
                              )}
                            </div>

                            <p className="text-[10px] text-slate-400 mt-2">
                              {activity.performedBy
                                ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
                                : "Unknown user"}{" "}
                              • {formatActivityDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ======================================================
                INVENTORY ACTIVITY
            ======================================================= */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                    <FaBoxes className="text-green-600 text-sm" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Inventory</h4>

                    <p className="text-[11px] text-slate-400">Stock activity</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/inventory/activities")}
                  className="text-xs font-semibold text-shark hover:underline"
                >
                  View all
                </button>
              </div>

              {recentInventoryActivities.length === 0 ? (
                <ActivityEmptyState message="No inventory activity yet" />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentInventoryActivities.slice(0, 6).map((activity) => {
                    const config = getInventoryActivityConfig(activity.action);

                    const Icon = config.icon;

                    return (
                      <div key={activity._id} className="px-4 sm:px-5 py-4">
                        <div className="flex gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${config.iconClass} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="text-sm" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {activity.product?.name || "Product"}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                  {activity.reason || "No reason provided"}
                                </p>
                              </div>

                              <p
                                className={`text-sm font-bold shrink-0 ${
                                  config.quantityPrefix === "-"
                                    ? "text-red-600"
                                    : config.quantityPrefix === "+"
                                      ? "text-green-600"
                                      : "text-orange-600"
                                }`}
                              >
                                {config.quantityPrefix}
                                {activity.quantity}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeClass}`}
                              >
                                {config.label}
                              </span>

                              <span className="text-[10px] text-slate-400">
                                {activity.product?.sku || "No SKU"}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-2">
                              {activity.performedBy
                                ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
                                : "Unknown user"}{" "}
                              • {formatActivityDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
