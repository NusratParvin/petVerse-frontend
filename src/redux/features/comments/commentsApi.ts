import baseApi from "../../api/baseApi";

export type TTargetType = "Article" | "LostFound";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── create ──────────────────────────────────────────────────────
    addComment: builder.mutation({
      query: (commentData) => ({
        url: `/comments`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.targetId },
      ],
    }),

    // ── get by target (Article or LostFound) ────────────────────────
    // usage: useGetCommentsByTargetQuery({ targetType: "LostFound", targetId: id })
    getCommentsByTarget: builder.query({
      query: ({ targetType, targetId, page }) => ({
        url: `/comments/${targetType}/${targetId}/${page}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.targetId },
      ],
    }),

    getRepliesByParentId: builder.query({
      query: ({ parentId, page }) => {
        console.log(parentId, page);
        return {
          url: `/comments/replies/${parentId}/${page}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.parentId },
      ],
    }),

    // ── vote ────────────────────────────────────────────────────────
    voteComment: builder.mutation({
      query: ({ commentId, voteType }) => ({
        url: `/comments/${commentId}/vote`,
        method: "PATCH",
        body: { voteType },
      }),
    }),

    // ── update content ──────────────────────────────────────────────
    updateComment: builder.mutation({
      query: ({ commentId, ...data }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      // invalidatesTags: (_result, _error, arg) => [
      //   { type: "Comments", id: arg.targetId },
      // ],
    }),

    //   soft delete
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comments", id: arg.targetId },
      ],
    }),

    //   mark helpful lead (post owner only)
    markHelpfulLead: builder.mutation({
      query: ({ commentId, isHelpfulLead }) => ({
        url: `/comments/${commentId}/helpful-lead`,
        method: "PATCH",
        body: { isHelpfulLead },
      }),
      // invalidatesTags: (_result, _error, arg) => [
      //   { type: "Comments", id: arg.targetId },
      // ],
    }),

    //   admin: all comments with filters
    // usage: useGetAllCommentsForAdminQuery({ targetType: "LostFound", isSighting: true })

    getCommentStats: builder.query({
      query: () => ({ url: "/comments/stats", method: "GET" }),
      providesTags: [{ type: "Comments", id: "STATS" }],
    }),

    getAllCommentsForAdmin: builder.query({
      query: (params?: {
        targetType?: TTargetType;
        isSighting?: boolean;
        isHelpfulLead?: boolean;
        isDeleted?: boolean;
        page?: number;
        limit?: number;
      }) => ({ url: "/comments", method: "GET", params }),
      providesTags: [{ type: "Comments", id: "ADMIN_LIST" }],
    }),

    restoreComment: builder.mutation({
      query: (id: string) => ({
        url: `/comments/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Comments", id: "ADMIN_LIST" },
        { type: "Comments", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useGetCommentsByTargetQuery,
  useGetRepliesByParentIdQuery,
  useVoteCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useMarkHelpfulLeadMutation,
  useGetAllCommentsForAdminQuery,

  useGetCommentStatsQuery,

  useRestoreCommentMutation,
} = commentsApi;
