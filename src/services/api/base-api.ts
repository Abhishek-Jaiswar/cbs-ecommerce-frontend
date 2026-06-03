import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1",
  credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: rawBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
