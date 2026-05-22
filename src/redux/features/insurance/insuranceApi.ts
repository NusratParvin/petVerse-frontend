import baseApi from "../../api/baseApi";

const insuranceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /insurance/ratings — all provider avg ratings (Compare page)
    getInsuranceRatings: builder.query({
      query: () => "/insurance/ratings",
      providesTags: ["Insurance"],
    }),

    // GET /insurance/reviews/:providerId — reviews for one provider (Detail page)
    getProviderReviews: builder.query({
      query: (providerId: string) => `/insurance/reviews/${providerId}`,
      providesTags: (_result, _error, providerId) => [
        { type: "Insurance", id: providerId },
      ],
    }),

    // POST /insurance/reviews — submit a review
    submitInsuranceReview: builder.mutation({
      query: (body: {
        providerId: string;
        rating: number;
        text: string;
        planUsed?: string;
      }) => ({
        url: "/insurance/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Insurance", id: arg.providerId },
        "Insurance",
      ],
    }),
  }),
});

export const {
  useGetInsuranceRatingsQuery,
  useGetProviderReviewsQuery,
  useSubmitInsuranceReviewMutation,
} = insuranceApi;
