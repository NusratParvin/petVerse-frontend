import {
  TApiResponse,
  TLostFoundPost,
  TCreateLostFoundPayload,
} from "@/src/types";
import baseApi from "../../api/baseApi";

type TLFFilters = {
  type?: string;
  emirate?: string;
  species?: string;
  status?: string;
  search?: string;
};

export const lostFoundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLostFoundPosts: builder.query<
      TApiResponse<TLostFoundPost[]>,
      TLFFilters
    >({
      query: (params) => ({ url: "/lost-found", params }),
      providesTags: ["LostFound"],
    }),

    getLostFoundPostById: builder.query<TApiResponse<TLostFoundPost>, string>({
      query: (id) => `/lost-found/${id}`,
      providesTags: (_r, _e, id) => [{ type: "LostFound", id }],
    }),

    createLostFoundPost: builder.mutation<
      TApiResponse<TLostFoundPost>,
      TCreateLostFoundPayload
    >({
      query: (body) => ({ url: "/lost-found", method: "POST", body }),
      invalidatesTags: ["LostFound"],
    }),

    updateLostFoundPost: builder.mutation<
      TApiResponse<TLostFoundPost>,
      { id: string; body: Partial<TCreateLostFoundPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/lost-found/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LostFound"],
    }),

    markLostFoundResolved: builder.mutation<
      TApiResponse<TLostFoundPost>,
      string
    >({
      query: (id) => ({ url: `/lost-found/${id}/resolve`, method: "PATCH" }),
      invalidatesTags: ["LostFound"],
    }),

    deleteLostFoundPost: builder.mutation<TApiResponse<null>, string>({
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
