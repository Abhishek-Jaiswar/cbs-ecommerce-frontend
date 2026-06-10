import { baseApi } from "../base-api";
import type { IDashboardStatsResponse } from "./dashboard-api.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverviewStats: builder.query<IDashboardStatsResponse, void>({
      query: () => "/dashboard/overview",
    }),
  }),
});

export const { useGetDashboardOverviewStatsQuery } = dashboardApi;
