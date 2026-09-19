import { apiSlice } from "./apiSlice";

const NOTIFICATIONS_URL = "/api/notifications";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET NOTIFICATIONS
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, unreadOnly = false } = {}) =>
        `${NOTIFICATIONS_URL}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,

      providesTags: ["Notification"],
    }),

    // * 2. GET UNREAD NOTIFICATION COUNT
    getUnreadNotificationCount: builder.query({
      query: () => `${NOTIFICATIONS_URL}/unread-count`,

      providesTags: ["Notification"],
      pollingInterval: 60000,
    }),

    // * 3. MARK NOTIFICATION AS READ
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}/read`,
        method: "PATCH",
      }),

      invalidatesTags: ["Notification"],
    }),

    // * 4. MARK ALL NOTIFICATIONS AS READ
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/read-all`,
        method: "PATCH",
      }),

      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApiSlice;
