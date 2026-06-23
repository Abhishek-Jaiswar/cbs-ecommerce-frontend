import { baseApi } from "../base-api";
import type { IDashboardStatsResponse } from "./dashboard-api.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverviewStats: builder.query<IDashboardStatsResponse, void>({
      query: () => "/dashboard/overview",
      providesTags: ["Orders", "Products", "Users"],
    }),
    getUtmReports: builder.query<any, void>({
      query: () => "/dashboard/utm-reports",
      providesTags: ["Orders"],
    }),
    getCampaignBudgets: builder.query<any, void>({
      query: () => "/dashboard/campaign-budgets",
      providesTags: ["Orders"],
    }),
    upsertCampaignBudget: builder.mutation<any, { campaignName: string; budget: number; source?: string | null; medium?: string | null }>({
      query: (body) => ({
        url: "/dashboard/campaign-budgets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
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
