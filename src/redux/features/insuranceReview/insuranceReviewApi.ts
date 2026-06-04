import baseApi from "../../api/baseApi";

import {
  TApiResponse,
  TInsuranceReview,
  TInsuranceReviewResponse,
} from "@/src/types";

export const insuranceReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderReviews: builder.query<TInsuranceReviewResponse, string>({
      query: (providerId) => `/insurance-review/${providerId}/reviews`,
      providesTags: (_result, _error, providerId) => [
        { type: "InsuranceReviews", id: providerId },
      ],
      transformResponse: (response: TApiResponse<TInsuranceReviewResponse>) =>
        response.data,
    }),

    submitInsuranceReview: builder.mutation<
      TInsuranceReview,
      { providerId: string; rating: number; text: string; planUsed?: string }
    >({
      query: ({ providerId, ...body }) => ({
        url: `/insurance-review/${providerId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { providerId }) => [
        { type: "InsuranceReviews", id: providerId },
        { type: "Insurance", id: providerId },
        "Insurance",
      ],
      transformResponse: (response: TApiResponse<TInsuranceReview>) =>
        response.data,
    }),
  }),
});

export const { useGetProviderReviewsQuery, useSubmitInsuranceReviewMutation } =
  insuranceReviewApi;
