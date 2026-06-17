import { baseApi } from "../base-api";
import type { IDashboardStatsResponse } from "./dashboard-api.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverviewStats: builder.query<IDashboardStatsResponse, void>({
      query: () => "/dashboard/overview",
    }),
    getUtmReports: builder.query<any, void>({
      query: () => "/dashboard/utm-reports",
      providesTags: ["Orders"],
    }),
    getCampaignBudgets: builder.query<any, void>({
      query: () => "/dashboard/campaign-budgets",
    }),
    upsertCampaignBudget: builder.mutation<any, { campaignName: string; budget: number; source?: string | null; medium?: string | null }>({
      query: (body) => ({
        url: "/dashboard/campaign-budgets",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDashboardOverviewStatsQuery,
  useGetUtmReportsQuery,
  useGetCampaignBudgetsQuery,
  useUpsertCampaignBudgetMutation,
} = dashboardApi;
