import { apiSlice } from "./apiSlice";

const ADMIN_ACTIVITIES_URL = "/api/admin-activities";

export const adminActivityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET ADMIN ACTIVITIES
    getAdminActivities: builder.query({
      query: ({ page = 1, limit = 20, type = "all", action = "all", search = "" } = {}) =>
        `${ADMIN_ACTIVITIES_URL}?page=${page}&limit=${limit}&type=${encodeURIComponent(
          type,
        )}&action=${encodeURIComponent(action)}&search=${encodeURIComponent(search)}`,

      providesTags: ["AdminActivity"],
    }),
  }),
});

export const { useGetAdminActivitiesQuery } = adminActivityApiSlice;
