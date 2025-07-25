// This slice deals with the actual requests to the API for Login,
// authentication, email verification, password reset, and every request
// that has to do with the user.

import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users"; // Base URL for user-related API endpoints

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register User Mutation
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // POST /api/users
        method: "POST",
        body: data,
      }),
      // When a new user is registered, it might affect the list of users,
      // so we can invalidate the 'User' tag to trigger a re-fetch of getUsers.
      invalidatesTags: ["User"],
    }),

    // Send Verification Email Mutation
    sendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendverificationemail`, // POST /api/users/sendverificationemail
        method: "POST",
        body: data,
      }),
    }),

    // Verify User Email Query
    verifyUserEmail: builder.query({
      query: ({ id, token }) => ({
        url: `${USERS_URL}/${id}/verifyemail/${token}`, // GET /api/users/:id/verifyemail/:token
      }),
    }),

    // Login User Mutation
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`, // POST /api/users/login
        method: "POST",
        body: data,
      }),
    }),

    // Send Reset Password Email Mutation
    sendResetPasswordEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendresetpasswordemail`, // POST /api/users/sendresetpasswordemail
        method: "POST",
        body: data,
      }),
    }),

    // Verify Reset Password OTP Mutation
    verifyResetPasswordOTP: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifyresetpasswordotp`, // POST /api/users/verifyresetpasswordotp
        method: "POST",
        body: data,
      }),
    }),

    // Get User Profile Query (commented out as per your original code)
    // getUserProfile: builder.query({
    //   query: () => ({
    //     url: `${USERS_URL}/profile`, // GET /api/users/profile
    //     method: "GET",
    //   }),
    // }),

    // Update User Profile Mutation
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // PUT /api/users/profile
        method: "PUT",
        body: data,
      }),
      // This is for specific user invalidation
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg._id }],
    }),

    // Logout User Mutation
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`, // POST /api/users/logout
        method: "POST",
      }),
    }),

    //! --- ADMIN ONLY ENDPOINTS ---
    // Get All Users Query
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/`, // GET /api/users/
        method: "GET",
      }),
      // Tag the data provided by this query as 'User'.
      // This allows mutations to invalidate this cached data.
      providesTags: ["User"],
    }),

    // Get a User Profile by ID Query
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`, // GET /api/users/:id
        method: "GET",
      }),
      // Optionally provide a specific tag for this single user
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update User by Admin Mutation
    updateUserByAdmin: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `${USERS_URL}/${userId}`, // PUT /api/users/:id
        method: "PUT",
        body: formData,
      }),
      // Invalidate the 'User' tag, specifically for the updated user and the general list.
      invalidatesTags: (result, error, { userId }) => ["User", { type: "User", id: userId }],
    }),

    // Delete a Single User by ID Mutation
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`, // DELETE /api/users/:id
        method: "DELETE",
      }),
      // Invalidate the 'User' tag. This will trigger a re-fetch of 'getUsers'.
      invalidatesTags: (result, error, id) => ["User", { type: "User", id }],
    }),

    // Delete Multiple Users by Admin Mutation
    deleteUsersByAdmin: builder.mutation({
      query: (userIds) => ({
        // userIds should be an array of strings
        url: `${USERS_URL}`, // DELETE /api/users/ (base URL for bulk delete)
        method: "DELETE",
        body: { userIds }, // Send the array of IDs in the request body
      }),
      // Invalidate the 'User' tag. This will trigger a re-fetch of 'getUsers'
      // to update the list of users after a bulk delete.
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useSendVerificationEmailMutation,
  useVerifyUserEmailQuery,
  useLoginMutation,
  useSendResetPasswordEmailMutation,
  useVerifyResetPasswordOTPMutation,
  // useGetUserProfileQuery,
  useUpdateUserMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserMutation,
  useDeleteUsersByAdminMutation,
} = usersApiSlice;
