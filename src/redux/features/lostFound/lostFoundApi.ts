import baseApi from "../../api/baseApi";

export const lostFoundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLostFoundPosts: builder.query({
      query: (params) => {
        return { url: "/lost-found", method: "GET", params };
      },
      providesTags: ["LostFound"],
    }),

    getLostFoundPostById: builder.query({
      query: (id) => `/lost-found/${id}`,
      providesTags: (_r, _e, id) => [{ type: "LostFound", id }],
    }),

    createLostFoundPost: builder.mutation({
      query: (payload) => {
        return {
          url: "/lost-found",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["LostFound"],
    }),

    updateLostFoundPost: builder.mutation({
      query: ({ id, payload }) => {
        return {
          url: `/lost-found/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["LostFound"],
    }),

    markLostFoundResolved: builder.mutation({
      query: (id) => {
        return { url: `/lost-found/${id}/resolve`, method: "PATCH" };
      },
      invalidatesTags: ["LostFound"],
    }),

    deleteLostFoundPost: builder.mutation({
      query: (id) => {
        return { url: `/lost-found/${id}`, method: "DELETE" };
      },
      invalidatesTags: ["LostFound"],
    }),

    //admin-get all lF data
    getAllLostFoundPostsForAdmin: builder.query({
      query: (params) => {
        console.log(params);
        return {
          url: "/lost-found/admin/all",
          method: "GET",
          params,
        };
      },
      providesTags: ["LostFound"],
    }),

    //  get stats for the summary cards
    getLostFoundStats: builder.query({
      query: () => ({
        url: "/lost-found/admin/stats",
        method: "GET",
      }),
      providesTags: ["LostFound"],
    }),

    // force delete any post
    adminDeleteLostFoundPost: builder.mutation({
      query: (id) => ({
        url: `/lost-found/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LostFound"],
    }),

    //   force resolve any post
    adminMarkLostFoundResolved: builder.mutation({
      query: (id) => ({
        url: `/lost-found/admin/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["LostFound"],
    }),

    // admin: get single post with full owner details
    getPostForAdmin: builder.query({
      query: (id) => ({
        url: `/lost-found/admin/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "LostFound", id }],
    }),

    // admin: contact owner by email
    contactOwnerByEmail: builder.mutation({
      query: ({ id, subject, message }) => ({
        url: `/lost-found/admin/${id}/contact-email`,
        method: "POST",
        body: { subject, message },
      }),
    }),

    // admin: contact owner by whatsapp
    contactOwnerByWhatsApp: builder.mutation({
      query: ({ id, message }) => ({
        url: `/lost-found/admin/${id}/contact-whatsapp`,
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const {
  useGetLostFoundPostsQuery,
  useGetLostFoundPostByIdQuery,
  useCreateLostFoundPostMutation,
  useUpdateLostFoundPostMutation,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,

  useGetAllLostFoundPostsForAdminQuery,
  useGetLostFoundStatsQuery,
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,

  useGetPostForAdminQuery,
  useContactOwnerByEmailMutation,
  useContactOwnerByWhatsAppMutation,
} = lostFoundApi;
