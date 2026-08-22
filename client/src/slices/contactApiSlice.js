import { apiSlice } from "./apiSlice";

const CONTACT_URL = "/api/contact";

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApiSlice;
