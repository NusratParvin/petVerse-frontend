import baseApi from "../../api/baseApi";

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new page
    createPage: builder.mutation({
      query: (data: { name: string; description: string }) => ({
        url: `/pages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { name }) => [
        { type: "Pages", id: name },
      ],
    }),

    // Invite a user to a page
    inviteToPage: builder.mutation({
      query: (data: { pageId: string; userId: string }) => ({
        url: `/pages/${data.pageId}/invite`,
        method: "POST",
        body: { userId: data.userId },
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: "Pages", id: pageId },
      ],
    }),

    // Accept an invitation to a page
    acceptPageInvitation: builder.mutation({
      query: (pageId: string) => ({
        url: `/pages/${pageId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, pageId) => [
        { type: "Pages", id: pageId },
      ],
    }),

    // Reject an invitation to a page
    rejectPageInvitation: builder.mutation({
      query: (pageId: string) => ({
        url: `/pages/${pageId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, pageId) => [
        { type: "Pages", id: pageId },
      ],
    }),

    // Fetch all pages created by or relevant to the user
    getPages: builder.query({
      query: () => ({
        url: `/pages`,
        method: "GET",
      }),
      providesTags: ["Pages"],
    }),

    // Get page details (user-specific)
    getPageDetails: builder.query({
      query: (pageId: string) => ({
        url: `/pages/${pageId}`,
        method: "GET",
      }),
      providesTags: (result, error, pageId) => [{ type: "Pages", id: pageId }],
    }),
  }),
});

export const {
  useCreatePageMutation,
  useInviteToPageMutation,
  useAcceptPageInvitationMutation,
  useRejectPageInvitationMutation,
  useGetPageDetailsQuery,
  useGetPagesQuery,
} = pagesApi;
