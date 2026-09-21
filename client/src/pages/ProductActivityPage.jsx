import { useEffect, useState } from "react";
import { FaBoxOpen, FaPencilAlt, FaArchive, FaUndo, FaUserShield } from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

import { useGetProductActivitiesQuery } from "../slices/productActivityApiSlice";

const EMPTY_ACTIVITIES = [];

const FIELD_LABELS = {
  name: "Name",
  sku: "SKU",
  barcode: "Barcode",
  category: "Category",
  brand: "Brand",
  description: "Description",
  costPrice: "Cost Price",
  price: "Selling Price",
  lowStockThreshold: "Low Stock Threshold",
  unit: "Unit",
  productImage: "Product Image",
};

const ProductActivityPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  const { data, isLoading, isError } = useGetProductActivitiesQuery({
    page,
    limit: 20,
    action,
    search,
  });

  useEffect(() => {
    setPage(1);
  }, [search, action]);

  const activities = data?.activities ?? EMPTY_ACTIVITIES;

  const getConfig = (action) => {
    switch (action) {
      case "product_created":
        return {
          icon: <FaBoxOpen />,
          bg: "bg-green-100",
          color: "text-green-600",
          label: "Product Created",
        };

      case "product_updated":
        return {
          icon: <FaPencilAlt />,
          bg: "bg-yellow-100",
          color: "text-yellow-700",
          label: "Product Updated",
        };

      case "product_archived":
        return {
          icon: <FaArchive />,
          bg: "bg-red-100",
          color: "text-red-600",
          label: "Product Archived",
        };

      case "product_restored":
        return {
          icon: <FaUndo />,
          bg: "bg-emerald-100",
          color: "text-emerald-600",
          label: "Product Restored",
        };

      default:
        return {
          icon: <FaBoxOpen />,
          bg: "bg-sharkLight-100",
          color: "text-shark",
          label: action?.replaceAll("_", " ") || "Activity",
        };
    }
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const actor = (performedBy) => {
    if (!performedBy) {
      return "Former User";
    }

    return (
      <span className="inline-flex items-center gap-1.5">
        {performedBy.isAdmin && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              px-1.5
              py-0.5
              rounded
              bg-indigo-100
              text-indigo-700
              text-[9px]
              font-semibold
              uppercase
            "
          >
            <FaUserShield />
            Admin
          </span>
        )}

        <span className="font-medium text-shark">
          {performedBy.firstName} {performedBy.lastName}
        </span>
      </span>
    );
  };

  return (
    <div className="w-[95%] max-w-5xl mx-auto mb-10 min-h-[80vh]">
      <div className="flex mb-6">
        <BackButton />

        <div className="flex flex-col items-center w-full">
          <h1 className="md:text-2xl font-bold text-shark uppercase">Product Activities</h1>
          <p className="text-xs md:text-sm text-sharkLight-300">
            History of product catalogue changes
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product activities..."
            className="
              flex-1
              px-4
              py-2.5
              border
              border-sharkLight-200
              rounded-md
              text-sm
            "
          />

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="
              md:w-56
              px-4
              py-2.5
              border
              border-sharkLight-200
              rounded-md
              text-sm
              bg-white
            "
          >
            <option value="all">All Activities</option>

            <option value="product_created">Product Created</option>

            <option value="product_updated">Product Updated</option>

            <option value="product_archived">Product Archived</option>

            <option value="product_restored">Product Restored</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 p-6">Error loading product activities.</div>
      ) : activities.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sharkLight-300">
          No product activities found.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              {activities.map((activity) => {
                const config = getConfig(activity.action);

                return (
                  <div key={activity._id} className="p-4 md:p-5">
                    <div className="flex gap-4">
                      <div
                        className={`
                            w-10 h-10
                            rounded-full
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            ${config.bg}
                            ${config.color}
                          `}
                      >
                        {config.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                          <div>
                            <h2 className="font-semibold text-shark">
                              {activity.product?.name || "Unknown Product"}
                            </h2>

                            <p className="text-xs text-sharkLight-300 mt-1">
                              SKU: {activity.product?.sku || "—"}
                            </p>
                          </div>

                          <p className="text-xs text-sharkLight-300">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>

                        <div className="mt-3">
                          <span
                            className={`
                                inline-flex
                                px-2
                                py-1
                                rounded-full
                                text-[10px]
                                md:text-xs
                                font-medium
                                ${config.bg}
                                ${config.color}
                              `}
                          >
                            {config.label}
                          </span>
                        </div>

                        {activity.changedFields?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-sharkLight-300 mb-2">Changed fields</p>

                            <div className="flex flex-wrap gap-2">
                              {activity.changedFields.map((field) => (
                                <span
                                  key={field}
                                  className="
                                        px-2
                                        py-1
                                        rounded-full
                                        bg-sharkLight-100
                                        text-shark
                                        text-[10px]
                                        md:text-xs
                                      "
                                >
                                  {FIELD_LABELS[field] || field}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3 text-xs text-sharkLight-300">
                          <FaUserShield />

                          <span>Performed by {actor(activity.performedBy)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {data?.pagination?.totalPages > 1 && (
            <div className="mt-5">
              <UserTablePaginationControls
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductActivityPage;
