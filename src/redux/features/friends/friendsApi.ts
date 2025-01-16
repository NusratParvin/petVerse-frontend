import baseApi from "../../api/baseApi";

export const friendsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send friend request
    sendFriendRequest: builder.mutation({
      query: (recipientId: string) => ({
        url: `/friends/request`,
        method: "POST",
        body: { recipientId },
      }),
      invalidatesTags: (result, error, recipientId) => [
        { type: "Friends", id: "FRIEND_LIST" },
        { type: "Friends", id: recipientId },
      ],
    }),

    // Accept friend request
    acceptFriendRequest: builder.mutation({
      query: (requestId: string) => ({
        url: `/friends/accept/${requestId}`,
        method: "PATCH",
        // body: { requestId },
      }),
      invalidatesTags: (result, error, requestId) => [
        { type: "Friends", id: "FRIEND_LIST" }, // Invalidate the entire list
        { type: "Friends", id: requestId }, // Invalidate the specific request tag
      ],
    }),

    // Reject friend request
    rejectFriendRequest: builder.mutation({
      query: (requestId: string) => ({
        url: `/friends/reject/${requestId}`,
        method: "PATCH",
        // body: { requestId },
      }),
      invalidatesTags: (result, error, requestId) => [
        { type: "Friends", id: "FRIEND_LIST" }, // Invalidate the entire list
        { type: "Friends", id: requestId }, // Invalidate the specific request tag
      ],
    }),
    // Cancel friend request
    cancelFriendRequest: builder.mutation({
      query: (requestId: string) => ({
        url: `/friends/cancel/${requestId}`,
        method: "PATCH",
        // body: { requestId },
      }),
      invalidatesTags: (result, error, requestId) => [
        { type: "Friends", id: "FRIEND_LIST" }, // Invalidate the entire list
        { type: "Friends", id: requestId }, // Invalidate the specific request tag
      ],
    }),

    // Get friend requests
    getFriendRequests: builder.query({
      query: () => ({
        url: `/friends/requests`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ _id }: { _id: string }) => ({
                type: "Friends" as const,
                id: _id,
              })),
              { type: "Friends", id: "FRIEND_REQUESTS" }, // General tag
            ]
          : [{ type: "Friends", id: "FRIEND_REQUESTS" }],
    }),

    getFriendsList: builder.query({
      query: () => ({
        url: `/friends`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.pendingRequestsSent.map(
                ({ _id }: { _id: string }) => ({
                  type: "Friends" as const,
                  id: _id,
                })
              ),
              ...result.data.pendingRequestsReceived.map(
                ({ _id }: { _id: string }) => ({
                  type: "Friends" as const,
                  id: _id,
                })
              ),
              ...result.data.friends.map(({ _id }: { _id: string }) => ({
                type: "Friends" as const,
                id: _id,
              })),
              { type: "Friends", id: "FRIEND_LIST" },
            ]
          : [{ type: "Friends", id: "FRIEND_LIST" }],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetFriendRequestsQuery,
  useGetFriendsListQuery,
} = friendsApi;
