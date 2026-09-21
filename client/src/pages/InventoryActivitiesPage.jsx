import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBoxOpen,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaSearch,
  FaUndo,
} from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

import { useGetInventoryActivitiesQuery } from "../slices/inventoryApiSlice";

const ACTION_OPTIONS = [
  {
    value: "all",
    label: "All Activities",
  },
  {
    value: "stock_received",
    label: "Stock Received",
  },
  {
    value: "stock_added",
    label: "Stock Added",
  },
  {
    value: "stock_removed",
    label: "Stock Removed",
  },
  {
    value: "stock_adjusted",
    label: "Stock Adjusted",
  },
  {
    value: "stock_damaged",
    label: "Stock Damaged",
  },
  {
    value: "stock_returned",
    label: "Stock Returned",
  },
];

const InventoryActivitiesPage = () => {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 20;

  const { data, isLoading, isError, error } = useGetInventoryActivitiesQuery({
    page: currentPage,
    limit,
    action,
    search,
  });

  const activities = data?.activities || [];
  const pagination = data?.pagination || {};

  const getActionInfo = (activityAction) => {
    switch (activityAction) {
      case "stock_received":
        return {
          label: "Stock Received",
          icon: FaBoxOpen,
          className: "bg-green-100 text-green-700",
          sign: "+",
        };

      case "stock_added":
        return {
          label: "Stock Added",
          icon: FaArrowUp,
          className: "bg-green-100 text-green-700",
          sign: "+",
        };

      case "stock_removed":
        return {
          label: "Stock Removed",
          icon: FaArrowDown,
          className: "bg-red-100 text-red-700",
          sign: "-",
        };

      case "stock_adjusted":
        return {
          label: "Stock Adjusted",
          icon: FaExchangeAlt,
          className: "bg-sharkLight-100 text-shark",
          sign: "±",
        };

      case "stock_damaged":
        return {
          label: "Stock Damaged",
          icon: FaExclamationTriangle,
          className: "bg-orange-100 text-orange-700",
          sign: "-",
        };

      case "stock_returned":
        return {
          label: "Stock Returned",
          icon: FaUndo,
          className: "bg-blue-100 text-blue-700",
          sign: "+",
        };

      default:
        return {
          label: activityAction,
          icon: FaExchangeAlt,
          className: "bg-gray-100 text-gray-700",
          sign: "",
        };
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />

        <span className="ml-2">Loading inventory activities...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[80vh] text-center py-10">
        <p className="text-red-600 font-semibold">Error loading inventory activities.</p>

        <p className="text-sm text-sharkLight-300 mt-2">
          {error?.data?.message || error?.error || "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      {/* HEADER */}
      <div className="flex mb-6">
        <BackButton />

        <div className="flex flex-col items-center w-full">
          <h2 className="md:text-2xl font-bold uppercase">Inventory Activities</h2>
          <p className="text-xs md:text-sm text-sharkLight-300">History of inventory changes</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sharkLight-300" />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search product, SKU, reason or admin..."
              className="w-full pl-10 pr-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          <select
            value={action}
            onChange={handleActionChange}
            className="px-3 py-2 rounded border border-sharkLight-100 bg-white focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
          >
            {ACTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULTS */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Stock Movement History</h3>

          <p className="text-xs text-sharkLight-300 mt-1">
            {pagination.total || 0} {pagination.total === 1 ? "activity" : "activities"}
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <FaExchangeAlt className="mx-auto text-5xl text-sharkLight-300 mb-3" />

            <p className="font-semibold">No inventory activities found.</p>

            <p className="text-sm text-sharkLight-300 mt-1">Try changing your search or filter.</p>
          </div>
        ) : (
          <div className="divide-y">
            {activities.map((activity) => {
              const action = getActionInfo(activity.action);

              const ActionIcon = action.icon;

              return (
                <div key={activity._id} className="p-4 hover:bg-sharkLight-100/30 transition">
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${action.className}`}
                    >
                      <ActionIcon />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                        <div>
                          <p className="font-semibold">{action.label}</p>

                          <p className="text-sm mt-1">
                            <span className="font-medium">
                              {activity.product?.name || "Unknown product"}
                            </span>

                            {activity.product?.sku && (
                              <span className="ml-2 text-xs font-mono text-sharkLight-300">
                                {activity.product.sku}
                              </span>
                            )}
                          </p>
                        </div>

                        <p className="text-xs text-sharkLight-300 whitespace-nowrap">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-xs text-sharkLight-300">Previous</p>

                          <p className="font-semibold">{activity.previousStock}</p>
                        </div>

                        <div>
                          <p className="text-xs text-sharkLight-300">Change</p>

                          <p className="font-semibold">
                            {action.sign}
                            {activity.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-sharkLight-300">New Stock</p>

                          <p className="font-semibold">{activity.newStock}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-xs text-sharkLight-300">
                          Reason:{" "}
                          <span className="text-shark">
                            {activity.reason || "No reason provided"}
                          </span>
                        </p>

                        <p className="text-xs text-sharkLight-300">
                          Performed by:{" "}
                          <span className="font-semibold text-shark">
                            {activity.performedBy
                              ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
                              : "Unknown user"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center md:justify-end p-4 border-t">
            <UserTablePaginationControls
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryActivitiesPage;
