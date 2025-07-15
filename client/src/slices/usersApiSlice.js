//This slice deals with the actual requests to the API for Login, authentication, email verification, password reset, and every request that has to do with the user.

import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register request endpoint.
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    // Send verification email request endpoint.
    sendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendverificationemail`,
        method: "POST",
        body: data,
      }),
    }),

    // Verify email request endpoint.
    verifyUserEmail: builder.query({
      query: ({ id, token }) => ({ url: `${USERS_URL}/${id}/verifyemail/${token}` }),
    }),

    // Login request endpoint.
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Send reset password email request endpoint.
    sendResetPasswordEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendresetpasswordemail`,
        method: "POST",
        body: data,
      }),
    }),

    // Reset User password request endpoint.
    verifyResetPasswordOTP: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifyresetpasswordotp`,
        method: "POST",
        body: data,
      }),
    }),

    // Get User profile request endpoint.
    // getUserProfile: builder.query({
    //   query: () => ({
    //     url: `${USERS_URL}/profile`,
    //     method: "GET",
    //   }),
    // }),

    // Update User request endpoint.
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    // Logout request endpoint.
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    //* ADMIN ONLY
    // Get all Users request endpoint.
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/`,
        method: "GET",
      }),
    }),

    // Get a User profile by ID request endpoint.
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Update User request endpoint.
    updateUserByAdmin: builder.mutation({
      query: (data) => ({
        // url: `${USERS_URL}/profile`,
        url: `${USERS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete a User by ID request endpoint.
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useSendVerificationEmailMutation,
  useVerifyUserEmailQuery,
  useSendResetPasswordEmailMutation,
  useVerifyResetPasswordOTPMutation,
  useLoginMutation,
  // useGetUserProfileQuery,
  useUpdateUserMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserMutation,
} = usersApiSlice;
