// This slice deals with current inventory, stock operations,
// and inventory activity/history.

import { apiSlice } from "./apiSlice";

const INVENTORY_URL = "/api/inventory";

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET INVENTORY OVERVIEW
    // ============================================================
    getInventory: builder.query({
      query: () => ({
        url: INVENTORY_URL,
        method: "GET",
      }),

      providesTags: [{ type: "Inventory", id: "LIST" }, "Product"],
    }),

    // ============================================================
    // GET INVENTORY ACTIVITY FOR ONE PRODUCT
    // ============================================================
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

    // ============================================================
    // GET RECENT INVENTORY ACTIVITY
    // ============================================================
    getRecentInventoryActivity: builder.query({
      query: () => ({
        url: `${INVENTORY_URL}/activity/recent`,
        method: "GET",
      }),

      providesTags: [{ type: "InventoryActivity", id: "RECENT" }],
    }),

    // ============================================================
    // ADD STOCK
    // ============================================================
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
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // ============================================================
    // REMOVE STOCK
    // ============================================================
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
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // ============================================================
    // ADJUST STOCK
    // ============================================================
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
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // ============================================================
    // RECORD DAMAGED STOCK
    // ============================================================
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
        { type: "InventoryActivity", id: productId },
        { type: "InventoryActivity", id: "RECENT" },
      ],
    }),

    // ============================================================
    // RECORD RETURNED STOCK
    // ============================================================
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
  useGetRecentInventoryActivityQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
  useDamageStockMutation,
  useReturnStockMutation,
} = inventoryApiSlice;
