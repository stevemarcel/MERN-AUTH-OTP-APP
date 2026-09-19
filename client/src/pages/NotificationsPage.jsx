import { useEffect, useState } from "react";

import { FaBell, FaCheck, FaShieldAlt, FaUserShield } from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../slices/notificationApiSlice";

const EMPTY_NOTIFICATIONS = [];

const NotificationsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetNotificationsQuery({
    page,
    limit: 20,
  });

  const [markNotificationRead] = useMarkNotificationReadMutation();

  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

  const notifications = data?.notifications ?? EMPTY_NOTIFICATIONS;

  useEffect(() => {
    setPage(1);
  }, []);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case "security":
        return <FaShieldAlt />;

      case "admin":
        return <FaUserShield />;

      default:
        return <FaBell />;
    }
  };

  return (
    <div className="min-h-[80vh] w-[95%] max-w-4xl mx-auto mb-10 p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3 w-full md:mb-0">
          <BackButton />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-shark uppercase">Notifications</h1>

            <p className="text-sm text-sharkLight-300 mt-1">Account and security notifications</p>
          </div>
        </div>

        {(data?.unreadCount ?? 0) > 0 && (
          <div className="flex flex-col sm:flex-row md:w-full gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => markAllNotificationsRead()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-shark text-light text-xs font-medium hover:bg-sharkDark-100 transition-colors"
            >
              <FaCheck />
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <Loader />
          <span className="ml-2 text-shark">Loading notifications...</span>
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 p-6">
          Error loading notifications. Please try again.
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <div className="flex justify-center text-4xl text-sharkLight-300 mb-3">
            <FaBell />
          </div>

          <p className="text-sharkLight-300">No notifications yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-100">
            {notifications.map((notification) => {
              const isUnread = !notification.readAt;

              return (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => {
                    if (isUnread) {
                      markNotificationRead(notification._id);
                    }
                  }}
                  className={`w-full text-left p-4 md:p-5 transition-colors
                      ${isUnread ? "bg-sharkLight-100/40" : "bg-white"}
                      hover:bg-sharkLight-100/50
                    `}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${isUnread ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}
                        `}
                    >
                      {getNotificationIcon(notification)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-semibold text-sm md:text-base text-shark">
                          {notification.title}
                        </h2>

                        {isUnread && (
                          <span
                            className="
                                w-2
                                h-2
                                rounded-full
                                bg-red-500
                                flex-shrink-0
                                mt-1.5
                              "
                          />
                        )}
                      </div>

                      <p className="text-sm text-sharkLight-500 mt-1">{notification.message}</p>

                      <p className="text-xs text-sharkLight-300 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
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

export default NotificationsPage;
