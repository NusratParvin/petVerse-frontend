import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../store";

import envConfig from "@/src/config/envConfig";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: envConfig.baseApi,
    // baseUrl: "https://fish-cove-backend.vercel.app/api/v1",
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Articles",
    "Payments",
    "Auth",
    "Friends",
    "Pages",
    "Pets",
  ],
  endpoints: () => ({}),
});

export default baseApi;
