import { apiSlice } from "./apiSlice";

const USER_ACTIVITIES_URL = "/api/user-activities";

export const userActivityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET RECENT USER ACTIVITIES
    getRecentUserActivities: builder.query({
      query: () => ({
        url: USER_ACTIVITIES_URL,
        method: "GET",
      }),
      providesTags: ["UserActivity"],
    }),

    // * 2. GET ALL USER ACTIVITIES
    getAllUserActivities: builder.query({
      query: () => ({
        url: `${USER_ACTIVITIES_URL}/all`,
        method: "GET",
      }),
      providesTags: ["UserActivity"],
    }),

    // * 3. GET USER ACTIVITIES FOR A SPECIFIC USER
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
