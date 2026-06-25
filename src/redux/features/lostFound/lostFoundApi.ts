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
} = lostFoundApi;
