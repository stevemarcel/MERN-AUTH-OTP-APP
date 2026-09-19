import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useGetAllUserActivitiesQuery,
  useGetUserActivitiesQuery,
} from "../slices/userActivityApiSlice";

import {
  FaUserPlus,
  FaUserEdit,
  FaUserShield,
  FaUserMinus,
  FaCamera,
  FaLock,
  FaCheckCircle,
  FaUserCog,
  FaUndo,
} from "react-icons/fa";

import { MdVerified, MdEmail } from "react-icons/md";

// Components
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

import { getProfileImageUrl } from "../utils/profileImageUrl";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

const EMPTY_ACTIVITIES = [];

const UserActivityPage = () => {
  const { userId } = useParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  const {
    data: allUserActivitiesData,
    isLoading: isAllLoading,
    isError: isAllError,
  } = useGetAllUserActivitiesQuery(
    {
      page,
      limit: 20,
      action,
      search,
    },
    {
      skip: Boolean(userId),
    },
  );

  const {
    data: userActivitiesData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserActivitiesQuery(
    {
      userId,
      page,
      limit: 20,
      action,
      search,
    },
    {
      skip: !userId,
    },
  );

  useEffect(() => {
    setPage(1);
  }, [search, action, userId]);

  const data = userId ? userActivitiesData : allUserActivitiesData;

  const activities = data?.activities ?? EMPTY_ACTIVITIES;

  const pagination = data?.pagination;

  const currentUser = userId ? data?.user : null;

  const isLoading = userId ? isUserLoading : isAllLoading;

  const isError = userId ? isUserError : isAllError;

  // ! --- ACTIVITY CONFIGURATION ---
  const getActivityConfig = (action) => {
    switch (action) {
      // 🟢 Registered
      case "registered":
        return {
          icon: <FaUserPlus />,
          color: "text-green-600",
          bg: "bg-green-100",
          label: "Registered",
        };

      // 🟡 Profile Updated
      case "profile_updated":
        return {
          icon: <FaUserEdit />,
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          label: "Profile Updated",
        };

      // 🟠 Profile Picture Updated
      case "profile_picture_updated":
        return {
          icon: <FaCamera />,
          color: "text-orange-700",
          bg: "bg-orange-100",
          label: "Profile Picture Updated",
        };

      // 🟤 Email Verified
      case "email_verified":
        return {
          icon: <MdVerified />,
          color: "text-yellow-950",
          bg: "bg-yellow-200",
          label: "Email Verified",
        };

      // 🟣 Password Changed
      case "password_changed":
        return {
          icon: <FaLock />,
          color: "text-violet-600",
          bg: "bg-violet-100",
          label: "Password Changed",
        };

      // 🔵 Admin Updated
      case "admin_updated":
        return {
          icon: <FaUserShield />,
          color: "text-indigo-600",
          bg: "bg-indigo-100",
          label: "Admin Updated",
        };

      // 🔴 Removed/Deleted
      case "removed":
      case "deleted":
        return {
          icon: <FaUserMinus />,
          color: "text-red-600",
          bg: "bg-red-100",
          label: action === "removed" ? "Removed" : "Deleted",
        };

      // 🟢 Restored
      case "restored":
        return {
          icon: <FaUndo />,
          color: "text-emerald-600",
          bg: "bg-emerald-100",
          label: "Restored",
        };

      default:
        return {
          icon: <FaUserCog />,
          color: "text-shark",
          bg: "bg-sharkLight-100",
          label: action?.replaceAll("_", " ") || "Activity",
        };
    }
  };

  const formatActivityDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const renderAdminActor = (performedBy) => {
    if (!performedBy) {
      return null;
    }

    const actorName = `${performedBy.firstName || ""} ${performedBy.lastName || ""}`.trim();

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
              tracking-wide
            "
          >
            <FaUserShield />
            Admin
          </span>
        )}

        <span className="font-medium text-shark">{actorName || "Former User"}</span>
      </span>
    );
  };

  const renderDescription = (activity) => {
    // Special presentation requested for admin-created users.
    if (activity.action === "registered" && activity.performedBy) {
      return (
        <p className="font-medium text-shark leading-relaxed">
          {activity.description} {renderAdminActor(activity.performedBy)}
        </p>
      );
    }

    return <p className="font-medium text-shark leading-relaxed">{activity.description}</p>;
  };

  return (
    <div className="mb-10 min-h-[80vh] w-[95%] mx-auto">
      {/* Header */}
      <div className="flex items-center mb-5">
        <BackButton />

        <div className="w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold text-shark uppercase">
            {userId ? "User Activities" : "All Users Activities"}
          </h1>
        </div>
      </div>

      {userId && currentUser && (
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sharkLight-100 flex-shrink-0">
            <img
              src={getProfileImageUrl(currentUser.profile, BACKEND_BASE_URL)}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Information */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-shark">
                {currentUser.firstName} {currentUser.lastName}
              </p>

              {currentUser.isAdmin && (
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
            </div>

            {currentUser.username && (
              <p className="text-xs text-sharkLight-300">@{currentUser.username}</p>
            )}

            {currentUser.accountStatus === "removed" && (
              <span
                className="
                  inline-flex
                  mt-1
                  px-2
                  py-0.5
                  rounded-full
                  bg-red-100
                  text-red-700
                  text-[10px]
                  font-medium
                "
              >
                Removed
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="
              flex-1
              px-4
              py-2.5
              border
              border-sharkLight-200
              rounded-md
              text-sm
              outline-none
              focus:ring-2
              focus:ring-shark/20
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
              outline-none
            "
          >
            <option value="all">All Activities</option>

            <option value="registered">Registered</option>

            <option value="profile_updated">Profile Updated</option>

            <option value="profile_picture_updated">Profile Picture Updated</option>

            <option value="email_verified">Email Verified</option>

            <option value="password_changed">Password Changed</option>

            <option value="admin_updated">Admin Updated</option>

            <option value="removed">Removed</option>

            <option value="restored">Restored</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <Loader />
          <span className="ml-2 text-shark">Loading user activity...</span>
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 p-6">
          Error loading user activity. Please try again.
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-gray-50 rounded-lg shadow-sm p-10 text-center">
          <div className="flex justify-center text-4xl text-sharkLight-300 mb-3">
            <MdEmail />
          </div>

          <p className="text-sharkLight-300">No user activity found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-shark">Activity Log</h2>

                  <p className="text-xs text-sharkLight-300 mt-1">
                    {pagination?.total || activities.length}{" "}
                    {pagination?.total === 1 ? "activity" : "activities"}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-sharkLight-300">
                  <FaCheckCircle />
                  <span>Audit History</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {activities.map((activity) => {
                const config = getActivityConfig(activity.action);

                return (
                  <div
                    key={activity._id}
                    className="
                      p-4
                      md:p-5
                      hover:bg-sharkLight-100/20
                      transition
                      duration-200
                    "
                  >
                    <div className="flex gap-4">
                      <div
                        className={`
                          w-10
                          h-10
                          md:w-11
                          md:h-11
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
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <div>
                            {renderDescription(activity)}

                            <span
                              className={`
                                inline-flex
                                items-center
                                mt-2
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

                          <p className="text-xs text-sharkLight-300 whitespace-nowrap">
                            {formatActivityDate(activity.createdAt)}
                          </p>
                        </div>

                        {activity.performedBy && activity.action !== "registered" && (
                          <div className="flex items-center gap-2 mt-3 text-xs text-sharkLight-300">
                            <FaUserCog />

                            <span>Performed by {renderAdminActor(activity.performedBy)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {pagination?.totalPages > 1 && (
            <div className="mt-5">
              <UserTablePaginationControls
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserActivityPage;
