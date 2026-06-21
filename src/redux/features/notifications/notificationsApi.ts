import baseApi from "../../api/baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //every 30 s polling
    getMyNotifications: builder.query({
      query: () => ({
        url: "/notifications/my",
        method: "GET",
      }),
      providesTags: [{ type: "Notifications", id: "MY" }],
    }),

    markAsRead: builder.mutation({
      query: (notificationId: string) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notifications", id: "MY" }],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notifications", id: "MY" }],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
