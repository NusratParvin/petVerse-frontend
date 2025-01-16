import baseApi from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getFriendInfo: builder.query({
      query: (id) => ({
        url: `/users/friend/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (updatedUserInfo) => ({
        url: "/users/me",
        method: "PUT",
        body: updatedUserInfo,
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    promoteUserToAdmin: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    followUser: builder.mutation({
      query: ({ followUserId }) => ({
        url: `/users/${followUserId}/follow`,
        method: "PATCH",
      }),
      invalidatesTags: ["User", "Articles"],
    }),

    getMostFollowedAuthors: builder.query({
      query: () => "/users/most-followed",
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetFriendInfoQuery,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  usePromoteUserToAdminMutation,
  useFollowUserMutation,
  useGetMostFollowedAuthorsQuery,
} = userApi;
