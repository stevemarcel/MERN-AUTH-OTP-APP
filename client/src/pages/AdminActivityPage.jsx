import { useEffect, useState } from "react";

import { FaBoxes, FaCheckCircle, FaCube, FaUserShield } from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

import { useGetAdminActivitiesQuery } from "../slices/adminActivityApiSlice";

const EMPTY_ACTIVITIES = [];

const AdminActivityPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [action, setAction] = useState("all");

  const { data, isLoading, isError } = useGetAdminActivitiesQuery({
    page,
    limit: 20,
    type,
    action,
    search,
  });

  useEffect(() => {
    setPage(1);
  }, [search, type, action]);

  useEffect(() => {
    setAction("all");
  }, [type]);

  const activities = data?.activities ?? EMPTY_ACTIVITIES;

  const getTypeConfig = (type) => {
    switch (type) {
      case "user":
        return {
          icon: <FaUserShield />,
          label: "User",
          bg: "bg-indigo-100",
          color: "text-indigo-600",
        };

      case "product":
        return {
          icon: <FaCube />,
          label: "Product",
          bg: "bg-violet-100",
          color: "text-violet-600",
        };

      case "inventory":
        return {
          icon: <FaBoxes />,
          label: "Inventory",
          bg: "bg-emerald-100",
          color: "text-emerald-600",
        };

      default:
        return {
          icon: <FaCheckCircle />,
          label: "Activity",
          bg: "bg-sharkLight-100",
          color: "text-shark",
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

  const renderActor = (performedBy) => {
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
              md:text-[10px]
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
    <div className="w-[95%] max-w-6xl mx-auto mb-10 min-h-[80vh]">
      <div className="flex gap-0 md:gap-3 w-full mb-5">
        <BackButton />
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-shark uppercase">Admin Activity</h1>

          <p className="text-xs md:text-sm text-sharkLight-300 mt-1">
            History across users, products and inventory
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity..."
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

          <div className="flex gap-2">
            {[
              ["all", "All"],
              ["user", "Users"],
              ["product", "Products"],
              ["inventory", "Inventory"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`
                  px-3
                  py-2.5
                  rounded-md
                  text-xs
                  font-medium
                  transition-colors
                  ${
                    type === value
                      ? "bg-shark text-light"
                      : "bg-sharkLight-100 text-shark hover:bg-sharkLight-200"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 p-6">Error loading admin activity.</div>
      ) : activities.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sharkLight-300">
          No activity found.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-shark">Audit History</h2>

                  <p className="text-xs text-sharkLight-300 mt-1">
                    {data?.pagination?.total || activities.length} activities
                  </p>
                </div>

                <FaCheckCircle className="text-sharkLight-300" />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {activities.map((activity) => {
                const config = getTypeConfig(activity.type);

                return (
                  <div
                    key={`${activity.type}-${activity._id}`}
                    className="p-4 md:p-5 hover:bg-sharkLight-100/20 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div
                        className={`
                            w-10
                            h-10
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
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`
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

                              <span className="text-xs capitalize text-sharkLight-300">
                                {activity.action.replaceAll("_", " ")}
                              </span>
                            </div>

                            {activity.type === "user" ? (
                              <p className="mt-2 font-medium text-shark">
                                {activity.action === "registered" && activity.performedBy ? (
                                  <>
                                    {activity.description} {renderActor(activity.performedBy)}
                                  </>
                                ) : (
                                  activity.description
                                )}
                              </p>
                            ) : (
                              <>
                                <p className="mt-2 font-medium text-shark">
                                  {activity.description}
                                </p>

                                {activity.entityName && (
                                  <p className="text-sm text-sharkLight-500 mt-1">
                                    {activity.entityName}

                                    {activity.entitySku && ` • ${activity.entitySku}`}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <p className="text-xs text-sharkLight-300 mt-4 pt-3 border-t border-dashed border-sharkLight-100/50 md:mt-0 md:pt-0 md:border-none whitespace-nowrap">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>

                        {activity.metadata?.changedFields?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {activity.metadata.changedFields.map((field) => (
                              <span
                                key={field}
                                className="
                                      px-2
                                      py-1
                                      rounded-full
                                      bg-sharkLight-100
                                      text-shark
                                      text-[10px]
                                    "
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        )}

                        {activity.type === "inventory" && (
                          <p className="text-xs text-sharkLight-300 mt-3">
                            {activity.previousStock} → {activity.newStock} units
                          </p>
                        )}

                        <div className="flex flex-col md:flex-row items-center gap-2 mt-2 text-xs text-sharkLight-300">
                          <span className="flex items-center gap-2 w-full md:w-1/6">
                            <FaUserShield /> Performed by:{" "}
                          </span>
                          <span className="w-full">{renderActor(activity.performedBy)}</span>
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

export default AdminActivityPage;
