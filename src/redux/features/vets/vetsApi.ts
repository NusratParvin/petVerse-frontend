import { ApiResponse, TVet } from "@/src/types";
import baseApi from "../../api/baseApi";

const vetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVets: builder.query<ApiResponse, Record<string, unknown>>({
      query: (filters) => ({
        url: "/vets",
        params: filters || {},
      }),
      providesTags: ["Vets"],
    }),

    getSingleVet: builder.query({
      query: (id) => `/vets/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Vets", id }],
      transformResponse: (res: { data: TVet }) => res.data,
    }),

    createVet: builder.mutation({
      query: (body) => ({
        url: "/vets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vets"],
    }),

    updateVet: builder.mutation({
      query: ({ id, body }) => ({
        url: `/vets/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vets"],
    }),

    deleteVet: builder.mutation({
      query: (id) => ({
        url: `/vets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vets"],
    }),
  }),
});

export const {
  useGetVetsQuery,
  useGetSingleVetQuery,
  useCreateVetMutation,
  useUpdateVetMutation,
  useDeleteVetMutation,
} = vetsApi;

export default vetsApi;
