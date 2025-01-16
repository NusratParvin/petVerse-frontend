import baseApi from "../../api/baseApi";

export const reactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReactionForAdmin: builder.query({
      query: () => ({
        url: "/reactions",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllReactionForAdminQuery } = reactionsApi;
