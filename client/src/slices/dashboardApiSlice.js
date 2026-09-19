import { apiSlice } from "./apiSlice";

const DASHBOARD_URL = "/api/dashboard";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET DASHBOARD OVERVIEW
    getDashboardOverview: builder.query({
      query: () => ({
        url: `${DASHBOARD_URL}/overview`,
        method: "GET",
      }),

      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApiSlice;
