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
      query: ({ id, body }) => ({
        url: `/lost-found/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LostFound"],
    }),

    markLostFoundResolved: builder.mutation({
      query: (id) => ({ url: `/lost-found/${id}/resolve`, method: "PATCH" }),
      invalidatesTags: ["LostFound"],
    }),

    deleteLostFoundPost: builder.mutation({
      query: (id) => ({ url: `/lost-found/${id}`, method: "DELETE" }),
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
} = lostFoundApi;
