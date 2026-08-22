import { useParams } from "react-router-dom";
import {
  useGetRecentUserActivitiesQuery,
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
} from "react-icons/fa";
import { MdVerified, MdEmail } from "react-icons/md";
// import { PiSealWarningFill } from "react-icons/pi";

// Components
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

const UserActivityPage = () => {
  const { userId } = useParams();

  const {
    data: recentActivitiesData,
    isLoading: isRecentLoading,
    isError: isRecentError,
  } = useGetRecentUserActivitiesQuery(undefined, {
    skip: !!userId,
  });

  const {
    data: userActivitiesData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserActivitiesQuery(userId, {
    skip: !userId,
  });

  const activities = userId
    ? userActivitiesData?.activities || []
    : recentActivitiesData?.activities || [];

  const isLoading = userId ? isUserLoading : isRecentLoading;
  const isError = userId ? isUserError : isRecentError;

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

      // 🔴 Deleted
      case "deleted":
        return {
          icon: <FaUserMinus />,
          color: "text-red-600",
          bg: "bg-red-100",
          label: "User Deleted",
        };

      // Default
      default:
        return {
          icon: <FaUserCog />,
          color: "text-shark",
          bg: "bg-sharkLight-100",
          label: action?.replaceAll("_", " ") || "Activity",
        };
    }
  };
  // ! --- DATE FORMATTER ---
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

  // ! --- RENDER ---
  return (
    <div className="p-6 mb-10 min-h-[80vh] w-[95%] mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <BackButton />

        <div className="w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold text-shark uppercase">
            {userId ? "User Activity" : "Recent User Activity"}
          </h1>

          {userId && activities[0]?.user && (
            <div className="flex items-center justify-center gap-3 mt-2">
              {/* User Profile Picture */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sharkLight-100 flex-shrink-0">
                <img
                  src={
                    activities[0].user.profile
                      ? `${BACKEND_BASE_URL}${activities[0].user.profile}`
                      : `${BACKEND_BASE_URL}/uploads/profiles/placeholder.png`
                  }
                  alt={`${activities[0].user.firstName} ${activities[0].user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Information */}
              <div className="text-left">
                <p className="text-sm font-semibold text-shark">
                  {activities[0].user.firstName} {activities[0].user.lastName}
                </p>

                {activities[0].user.username && (
                  <p className="text-xs text-sharkLight-300">@{activities[0].user.username}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
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
        /* Activity Log */
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-shark">Activity Log</h2>

                <p className="text-xs text-sharkLight-300 mt-1">
                  {activities.length} {activities.length === 1 ? "activity" : "activities"}
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
                  className="p-4 md:p-5 hover:bg-sharkLight-100/20 transition duration-200"
                >
                  <div className="flex gap-4">
                    {/* Activity Icon */}
                    <div
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} ${config.color}`}
                    >
                      {config.icon}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <p className="font-medium text-shark leading-relaxed">
                            {activity.description}
                          </p>

                          {/* Activity Type */}
                          <span
                            className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium ${config.bg} ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </div>

                        {/* Date */}
                        <p className="text-xs text-sharkLight-300 whitespace-nowrap">
                          {formatActivityDate(activity.createdAt)}
                        </p>
                      </div>

                      {/* Performed By */}
                      {activity.performedBy && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-sharkLight-300">
                          <FaUserCog />

                          <span>
                            Performed by{" "}
                            <span className="font-medium text-shark">
                              {activity.performedBy.firstName} {activity.performedBy.lastName}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Self-performed activity */}
                      {!activity.performedBy && activity.action === "registered" && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-sharkLight-300">
                          <FaUserPlus />

                          <span>Account created by the user</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityPage;
