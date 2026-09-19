import { apiSlice } from "./apiSlice";

const PRODUCT_ACTIVITIES_URL = "/api/product-activities";

export const productActivityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET PRODUCT ACTIVITIES
    getProductActivities: builder.query({
      query: ({ page = 1, limit = 20, action = "all", search = "", productId = "" } = {}) =>
        `${PRODUCT_ACTIVITIES_URL}?page=${page}&limit=${limit}&action=${encodeURIComponent(
          action,
        )}&search=${encodeURIComponent(search)}&productId=${encodeURIComponent(productId)}`,

      providesTags: ["ProductActivity"],
    }),
  }),
});

export const { useGetProductActivitiesQuery } = productActivityApiSlice;
