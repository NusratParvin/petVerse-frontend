// import baseApi from "../../api/baseApi";

// export const articlesApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllArticles: builder.query({
//       query: () => ({
//         url: "/articles",
//         method: "GET",
//       }),
//       providesTags: ["Articles"],
//     }),

//     getArticleById: builder.query({
//       query: (id) => ({
//         url: `/articles/${id}`,
//         method: "GET",
//       }),
//     }),

//     getMyArticles: builder.query({
//       query: () => ({
//         url: "/articles/me",
//         method: "GET",
//       }),
//     }),

//     getFollowingArticles: builder.query({
//       query: () => ({
//         url: "/articles/following",
//         method: "GET",
//       }),
//     }),

//     createArticle: builder.mutation({
//       query: (article) => ({
//         url: "/articles",
//         method: "POST",
//         body: article,
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     updateArticle: builder.mutation({
//       query: ({ id, updatedFields }) => ({
//         url: `/articles/${id}`,
//         method: "PATCH",
//         body: updatedFields,
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     publishArticle: builder.mutation({
//       query: ({ articleId, publishData }) => ({
//         url: `/articles/${articleId}/publish`,
//         method: "PATCH",
//         body: publishData,
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     deleteArticle: builder.mutation({
//       query: (id) => ({
//         url: `/articles/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     getDashboardFeed: builder.query({
//       query: () => "/articles/dashboard-feed",
//       providesTags: ["Articles"],
//     }),

//     voteArticle: builder.mutation({
//       query: ({ articleId, voteType }) => ({
//         url: `/articles/${articleId}/vote`,
//         method: "PATCH",
//         body: { action: voteType },
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     shareArticle: builder.mutation({
//       query: ({ articleId }) => ({
//         url: "/share",
//         method: "POST",
//         body: { articleId },
//       }),
//       invalidatesTags: ["Articles"],
//     }),

//     reactToArticle: builder.mutation({
//       query: ({ articleId, reaction }) => ({
//         url: `/articles/${articleId}/react`,
//         method: "POST",
//         body: { reaction },
//       }),
//       invalidatesTags: ["Articles"],
//     }),
//   }),
// });

// export const {
//   useGetAllArticlesQuery,
//   useGetArticleByIdQuery,
//   useGetMyArticlesQuery,
//   useGetFollowingArticlesQuery,
//   useCreateArticleMutation,
//   useUpdateArticleMutation,
//   usePublishArticleMutation,
//   useShareArticleMutation,
//   useDeleteArticleMutation,
//   useGetDashboardFeedQuery,
//   useVoteArticleMutation,
//   useReactToArticleMutation,
// } = articlesApi;

import baseApi from "../../api/baseApi";

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticles: builder.query({
      query: (filters) => ({
        url: "/articles",
        method: "GET",
        params: filters || {},
      }),
      providesTags: ["Articles"],
    }),

    getArticleById: builder.query({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "GET",
      }),
      providesTags: ["Articles"],
    }),

    getMyArticles: builder.query({
      query: () => ({
        url: "/articles/me",
        method: "GET",
      }),
      providesTags: ["Articles"],
    }),

    getFollowingArticles: builder.query({
      query: () => ({
        url: "/articles/following",
        method: "GET",
      }),
      providesTags: ["Articles"],
    }),

    createArticle: builder.mutation({
      query: (article) => ({
        url: "/articles",
        method: "POST",
        body: article,
      }),
      invalidatesTags: ["Articles"],
    }),

    updateArticle: builder.mutation({
      query: ({ id, updatedFields }) => ({
        url: `/articles/${id}`,
        method: "PATCH",
        body: updatedFields,
      }),
      invalidatesTags: ["Articles"],
    }),

    publishArticle: builder.mutation({
      query: ({ articleId, publishData }) => ({
        url: `/articles/${articleId}/publish`,
        method: "PATCH",
        body: publishData,
      }),
      invalidatesTags: ["Articles"],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),

    getDashboardFeed: builder.query({
      query: () => "/articles/dashboard-feed",
      providesTags: ["Articles"],
    }),

    // No invalidatesTags: the card updates itself from the returned article
    voteArticle: builder.mutation({
      query: ({ articleId, voteType }) => ({
        url: `/articles/${articleId}/vote`,
        method: "PATCH",
        body: { action: voteType },
      }),
    }),

    shareArticle: builder.mutation({
      query: ({ articleId }) => ({
        url: "/share",
        method: "POST",
        body: { articleId },
      }),
      invalidatesTags: ["Articles"],
    }),

    // No invalidatesTags, same reason as voting
    reactToArticle: builder.mutation({
      query: ({ articleId, reaction }) => ({
        url: `/articles/${articleId}/react`,
        method: "POST",
        body: { reaction },
      }),
    }),
  }),
});

export const {
  useGetAllArticlesQuery,
  useGetArticleByIdQuery,
  useGetMyArticlesQuery,
  useGetFollowingArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  usePublishArticleMutation,
  useShareArticleMutation,
  useDeleteArticleMutation,
  useGetDashboardFeedQuery,
  useVoteArticleMutation,
  useReactToArticleMutation,
} = articlesApi;
