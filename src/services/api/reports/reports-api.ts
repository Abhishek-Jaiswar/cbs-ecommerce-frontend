import { baseApi } from "../base-api";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportsHistory: builder.query<any, void>({
      query: () => "/reports/history",
      providesTags: ["Reports"],
    }),
    generateReport: builder.mutation<any, { reportType: string; filter: string; format: string; startDate?: string; endDate?: string }>({
      query: (body) => ({
        url: "/reports/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
    getReportPreview: builder.query<any, { reportType: string; filter: string; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: "/reports/preview",
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReportsHistoryQuery,
  useGenerateReportMutation,
  useGetReportPreviewQuery,
} = reportsApi;
