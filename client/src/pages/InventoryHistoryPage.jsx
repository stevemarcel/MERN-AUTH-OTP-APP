import { useParams } from "react-router-dom";
import {
  FaArrowDown,
  FaArrowUp,
  FaBoxOpen,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaUndo,
} from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

import { useGetInventoryActivityQuery } from "../slices/inventoryApiSlice";

const InventoryHistoryPage = () => {
  const { productId } = useParams();

  const { data, isLoading, isError, error } = useGetInventoryActivityQuery(productId);

  const product = data?.product;
  const activities = data?.activities || [];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const getActionInfo = (action) => {
    switch (action) {
      case "stock_added":
        return {
          label: "Stock Added",
          icon: FaArrowUp,
          className: "bg-green-100 text-green-700",
        };

      case "stock_removed":
        return {
          label: "Stock Removed",
          icon: FaArrowDown,
          className: "bg-red-100 text-red-700",
        };

      case "stock_adjusted":
        return {
          label: "Stock Adjusted",
          icon: FaExchangeAlt,
          className: "bg-sharkLight-100 text-shark",
        };

      case "stock_damaged":
        return {
          label: "Stock Damaged",
          icon: FaExclamationTriangle,
          className: "bg-orange-100 text-orange-700",
        };

      case "stock_returned":
        return {
          label: "Stock Returned",
          icon: FaUndo,
          className: "bg-blue-100 text-blue-700",
        };

      case "stock_received":
        return {
          label: "Stock Received",
          icon: FaBoxOpen,
          className: "bg-green-100 text-green-700",
        };

      default:
        return {
          label: action,
          icon: FaExchangeAlt,
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />

        <span className="ml-2 text-shark">Loading inventory history...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[80vh] text-center py-10">
        <p className="font-semibold text-red-600">Unable to load inventory history.</p>

        <p className="text-sm text-sharkLight-300 mt-2">
          {error?.data?.message || error?.error || "Product not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      {/* Header */}
      <div className="flex mb-6">
        <BackButton />
        <div className="flex flex-col items-center w-full">
          <h1 className="md:text-2xl font-bold uppercase text-center text-wrap">{product.name}</h1>
          <p className="text-xs md:text-sm text-sharkLight-300 uppercase">Inventory History</p>
        </div>
      </div>

      {/* Product Summary */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs uppercase text-sharkLight-300">SKU</p>

            <p className="font-mono font-bold mt-1">{product.sku}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-sharkLight-300">Current Stock</p>

            <p className="text-xl font-bold mt-1">
              {product.stockQuantity} {product.unit}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-sharkLight-300">Low Stock At</p>

            <p className="font-semibold mt-1">{product.lowStockThreshold}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-sharkLight-300">Activities</p>

            <p className="font-semibold mt-1">{activities.length}</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Stock Movement History</h3>
        </div>

        {activities.length === 0 ? (
          <div className="p-10 text-center text-sharkLight-300">
            No inventory activity found for this product.
          </div>
        ) : (
          <div className="divide-y">
            {activities.map((activity) => {
              const action = getActionInfo(activity.action);

              const ActionIcon = action.icon;

              return (
                <div key={activity._id} className="p-4">
                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${action.className}`}
                    >
                      <ActionIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-semibold">{action.label}</p>

                          <p className="text-sm text-sharkLight-300 mt-1">
                            {activity.reason || "No reason provided"}
                          </p>
                        </div>

                        <p className="text-xs text-sharkLight-300 whitespace-nowrap">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                        <div>
                          <p className="text-xs text-sharkLight-300">Previous</p>

                          <p className="font-semibold">{activity.previousStock}</p>
                        </div>

                        <div>
                          <p className="text-xs text-sharkLight-300">Change</p>

                          <p className="font-semibold">
                            {activity.action === "stock_added" ||
                            activity.action === "stock_returned" ||
                            activity.action === "stock_received"
                              ? "+"
                              : activity.action === "stock_removed" ||
                                  activity.action === "stock_damaged"
                                ? "-"
                                : "±"}
                            {activity.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-sharkLight-300">New Stock</p>

                          <p className="font-semibold">{activity.newStock}</p>
                        </div>
                      </div>

                      <p className="text-xs text-sharkLight-300 mt-3">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHistoryPage;
