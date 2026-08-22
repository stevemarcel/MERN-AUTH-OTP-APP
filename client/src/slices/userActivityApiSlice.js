import { apiSlice } from "./apiSlice";

const USER_ACTIVITIES_URL = "/api/user-activities";

export const userActivityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get recent user activities
    getRecentUserActivities: builder.query({
      query: () => ({
        url: USER_ACTIVITIES_URL,
        method: "GET",
      }),
      providesTags: ["UserActivity"],
    }),

    // Get all user activities
    getAllUserActivities: builder.query({
      query: () => ({
        url: `${USER_ACTIVITIES_URL}/all`,
        method: "GET",
      }),
      providesTags: ["UserActivity"],
    }),

    // Get activities for a specific user
    getUserActivities: builder.query({
      query: (userId) => ({
        url: `${USER_ACTIVITIES_URL}/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "UserActivity", id: userId }],
    }),
  }),
});

export const {
  useGetRecentUserActivitiesQuery,
  useGetAllUserActivitiesQuery,
  useGetUserActivitiesQuery,
} = userActivityApiSlice;
