export interface IDashboardOverviewData {
  kpis: {
    totalRevenue: string;
    completedOrders: number;
    avgOrderValue: string;
    activeCustomers: number;
  };
  orderTrendData: Array<{
    date: string;
    orders: number;
    target: number;
  }>;
  revenueTrendData: Array<{
    month: string;
    revenue: number;
    target: number;
  }>;
  categorySalesData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    sales: number;
    revenue: string;
    image: string;
    initials: string;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    email: string;
    status: string;
    total: string;
    date: string;
  }>;
}

export interface IDashboardStatsResponse {
  success: boolean;
  message: string;
  data: IDashboardOverviewData;
}
