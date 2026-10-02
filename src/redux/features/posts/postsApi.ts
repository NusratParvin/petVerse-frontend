import baseApi from "../../api/baseApi";

type TShareArg = {
  refId: string;
  refType: "Article" | "Post";
  caption?: string;
};

type TFeedArg = {
  limit: number;
};

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<any, any>({
      query: (payload) => {
        // console.log(payload);
        return {
          url: "/posts",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Feed", "UserPosts"],
    }),

    sharePost: builder.mutation<any, TShareArg>({
      query: (payload) => ({
        url: "/posts/share",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Feed", "UserPosts"],
    }),

    getPostById: builder.query({
      query: (id: string) => `/posts/${id}`,
      providesTags: (_res, _err, id) => [{ type: "UserPosts", id }],
    }),

    getFeed: builder.infiniteQuery<any, TFeedArg, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,

        getNextPageParam: (
          lastPage,
          _allPages,
          lastPageParam,
          _allPageParams,
          queryArg,
        ) => {
          const posts = Array.isArray(lastPage)
            ? lastPage
            : (lastPage?.data ?? []);

          if (posts.length < queryArg.limit) {
            return undefined;
          }

          return lastPageParam + 1;
        },
      },

      query: ({ queryArg, pageParam }) => ({
        url: `/posts/feed?page=${pageParam}&limit=${queryArg.limit}`,
        method: "GET",
      }),

      providesTags: ["Feed"],
    }),

    getUserPosts: builder.query<any, string>({
      query: (userId) => `/posts/user/${userId}`,
      providesTags: ["UserPosts"],
    }),

    reactToPost: builder.mutation<
      any,
      { postId: string; reactionType: string }
    >({
      query: ({ postId, reactionType }) => ({
        url: `/posts/${postId}/react`,
        method: "POST",
        body: { reactionType },
      }),
    }),

    updatePost: builder.mutation<any, { id: string; caption?: string }>({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Feed", "UserPosts"],
    }),

    deletePost: builder.mutation<any, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feed", "UserPosts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useSharePostMutation,
  // useGetFeedQuery,

  useGetFeedInfiniteQuery,
  useGetUserPostsQuery,
  useReactToPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostByIdQuery,
} = postsApi;
