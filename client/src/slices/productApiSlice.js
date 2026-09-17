// This slice deals with all Product-related API requests:
// Product CRUD, product archiving, and product restoration.

import { apiSlice } from "./apiSlice";

const PRODUCTS_URL = "/api/products";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
        method: "GET",
      }),

      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map((product) => ({
                type: "Product",
                id: product._id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),

      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // ============================================================
    // CREATE PRODUCT
    // ============================================================
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: data,
      }),

      invalidatesTags: [{ type: "Product", id: "LIST" }, "Inventory"],
    }),

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
        "Inventory",
      ],
    }),

    // ============================================================
    // ARCHIVE PRODUCT
    // DELETE = ARCHIVE
    // ============================================================
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
        "Inventory",
      ],
    }),

    // ============================================================
    // BULK ARCHIVE PRODUCTS
    // ============================================================
    deleteProducts: builder.mutation({
      query: (productIds) => ({
        url: PRODUCTS_URL,
        method: "DELETE",
        body: {
          productIds,
        },
      }),

      invalidatesTags: [{ type: "Product", id: "LIST" }, "Inventory"],
    }),

    // ============================================================
    // RESTORE PRODUCT
    // ============================================================
    restoreProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/restore`,
        method: "PATCH",
      }),

      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
        "Inventory",
      ],
    }),
  }),

  // Protect against accidentally defining the same endpoints
  // elsewhere in the application.
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useRestoreProductMutation,
} = productApiSlice;
