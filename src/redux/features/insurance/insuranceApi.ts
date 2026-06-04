import baseApi from "../../api/baseApi";

import {
  TApiResponse,
  TAIRecommendationForm,
  TAIRecommendationResult,
  TInsuranceProvider,
  TInsuranceReview,
  TInsuranceReviewResponse,
} from "@/src/types";

export const insuranceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─────────────────────────────────────────
    // Providers
    // ─────────────────────────────────────────
    getAllInsuranceProviders: builder.query<TInsuranceProvider[], void>({
      query: () => "/insurance",
      providesTags: ["Insurance"],
      transformResponse: (response: TApiResponse<TInsuranceProvider[]>) =>
        response.data,
    }),

    getInsuranceProviderById: builder.query<TInsuranceProvider, string>({
      query: (id) => `/insurance/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Insurance", id }],
      transformResponse: (response: TApiResponse<TInsuranceProvider>) =>
        response.data,
    }),

    createInsuranceProvider: builder.mutation<
      TInsuranceProvider,
      Partial<TInsuranceProvider>
    >({
      query: (body) => ({
        url: "/insurance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Insurance"],
      transformResponse: (response: TApiResponse<TInsuranceProvider>) =>
        response.data,
    }),

    updateInsuranceProvider: builder.mutation<
      TInsuranceProvider,
      { id: string; body: Partial<TInsuranceProvider> }
    >({
      query: ({ id, body }) => ({
        url: `/insurance/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Insurance", id },
        "Insurance",
      ],
      transformResponse: (response: TApiResponse<TInsuranceProvider>) =>
        response.data,
    }),

    deleteInsuranceProvider: builder.mutation<null, string>({
      query: (id) => ({
        url: `/insurance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Insurance"],
    }),

    // AI Recommendation

    getInsuranceRecommendation: builder.mutation<
      TAIRecommendationResult,
      TAIRecommendationForm
    >({
      query: (body) => ({
        url: "/insurance/ai/recommendation",
        method: "POST",
        body,
      }),
      transformResponse: (response: TApiResponse<TAIRecommendationResult>) =>
        response.data,
    }),
  }),
});

export const {
  useGetAllInsuranceProvidersQuery,
  useGetInsuranceProviderByIdQuery,
  useCreateInsuranceProviderMutation,
  useUpdateInsuranceProviderMutation,
  useDeleteInsuranceProviderMutation,

  useGetInsuranceRecommendationMutation,
} = insuranceApi;
