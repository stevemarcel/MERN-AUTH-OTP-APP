// This slice deals with current inventory, stock operations,
// and inventory activity/history.

import { apiSlice } from "./apiSlice";

const INVENTORY_URL = "/api/inventory";

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * 1. GET INVENTORY OVERVIEW
    getInventory: builder.query({
      query: () => ({
        url: INVENTORY_URL,
        method: "GET",
      }),

      providesTags: [{ type: "Inventory", id: "LIST" }, "Product"],
    }),

    // * 2. GET INVENTORY ACTIVITY FOR ONE PRODUCT
    getInventoryActivity: builder.query({
      query: (productId) => ({
        url: `${INVENTORY_URL}/${productId}`,
        method: "GET",
      }),

      providesTags: (result, error, productId) => [
        {
          type: "InventoryActivity",
          id: productId,
        },
      ],
    }),

    // * 3. GET INVENTORY ACTIVITIES FOR ALL PRODUCTS
    getInventoryActivities: builder.query({
      query: ({ page = 1, limit = 20, action = "all", search = "" } = {}) => ({
        url: `${INVENTORY_URL}/activities`,
        method: "GET",
        params: {
          page,
          limit,
          action,
          search,
        },
      }),

      providesTags: [
        {
          type: "InventoryActivity",
          id: "LIST",
        },
      ],
    }),

    // * 4. GET RECENT INVENTORY ACTIVITY
    getRecentInventoryActivity: builder.query({
      query: () => ({
        url: `${INVENTORY_URL}/activity/recent`,
        method: "GET",
      }),

      providesTags: [{ type: "InventoryActivity", id: "RECENT" }],
    }),

    // * 5. ADD STOCK
    addStock: builder.mutation({
      query: ({ productId, quantity, reason }) => ({
        url: `${INVENTORY_URL}/${productId}/add`,
        method: "POST",
        body: {
          quantity,
          reason,
        },
      }),

      invalidatesTags: (result, error, { productId }) => [
        "Inventory",
        "Product",
        "Dashboard",
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // * 6. REMOVE STOCK
    removeStock: builder.mutation({
      query: ({ productId, quantity, reason }) => ({
        url: `${INVENTORY_URL}/${productId}/remove`,
        method: "POST",
        body: {
          quantity,
          reason,
        },
      }),

      invalidatesTags: (result, error, { productId }) => [
        "Inventory",
        "Product",
        "Dashboard",
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // * 7. ADJUST STOCK
    adjustStock: builder.mutation({
      query: ({ productId, newQuantity, reason }) => ({
        url: `${INVENTORY_URL}/${productId}/adjust`,
        method: "POST",
        body: {
          newQuantity,
          reason,
        },
      }),

      invalidatesTags: (result, error, { productId }) => [
        "Inventory",
        "Product",
        "Dashboard",
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // * 8. RECORD DAMAGED STOCK
    damageStock: builder.mutation({
      query: ({ productId, quantity, reason }) => ({
        url: `${INVENTORY_URL}/${productId}/damage`,
        method: "POST",
        body: {
          quantity,
          reason,
        },
      }),

      invalidatesTags: (result, error, { productId }) => [
        "Inventory",
        "Product",
        "Dashboard",
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // * 9. RECORD RETURNED STOCK
    returnStock: builder.mutation({
      query: ({ productId, quantity, reason }) => ({
        url: `${INVENTORY_URL}/${productId}/return`,
        method: "POST",
        body: {
          quantity,
          reason,
        },
      }),

      invalidatesTags: (result, error, { productId }) => [
        "Inventory",
        "Product",
        "Dashboard",
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetInventoryQuery,
  useGetInventoryActivityQuery,
  useGetInventoryActivitiesQuery,
  useGetRecentInventoryActivityQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
  useDamageStockMutation,
  useReturnStockMutation,
} = inventoryApiSlice;
