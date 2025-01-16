import baseApi from "../../api/baseApi";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: (commentData) => ({
        url: `/comments`,
        method: "POST",
        body: commentData,
      }),
    }),

    voteComment: builder.mutation({
      query: ({ commentId, voteType }) => ({
        url: `/comments/${commentId}/vote`,
        method: "PATCH",
        body: { voteType },
      }),
    }),

    updateComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ commentId, articleId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
        body: articleId,
      }),
    }),

    getAllCommentsForAdmin: builder.query({
      query: () => ({
        url: "/comments",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddCommentMutation,
  useVoteCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetAllCommentsForAdminQuery,
} = commentsApi;
