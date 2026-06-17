"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardOverviewStatsQuery } from "@/services/api/dashboard/dashboard-api";

// Import split modular components
import { KpiCards } from "./_components/kpi-cards";
import { OrderTrendChart } from "./_components/charts/order-trend-chart";
import { RevenueGrowthChart } from "./_components/charts/revenue-growth-chart";
import { CategoryDistributionChart } from "./_components/charts/category-distribution-chart";
import { TopProductsList } from "./_components/top-products-list";
import { RecentOrdersList } from "./_components/recent-orders-list";

export default function DashboardOverviewPage() {
  const { data: response, isLoading, isFetching, error, refetch } = useGetDashboardOverviewStatsQuery();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh] text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Failed to load dashboard metrics</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            There was an error communicating with the stats server. Please check your network and try again.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const stats = response.data;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
            {isFetching && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Manage listing status, monitor active KPIs, and track sales revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5 h-9" disabled={isFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-sm font-semibold h-9">
            <Link href="/dashboard/products/create">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <KpiCards
        totalRevenue={stats.kpis.totalRevenue}
        totalProfit={stats.kpis.totalProfit}
        totalOrders={stats.kpis.totalOrders}
        totalCustomers={stats.kpis.totalCustomers}
        totalProducts={stats.kpis.totalProducts}
        inventoryValue={stats.kpis.inventoryValue}
        avgOrderValue={stats.kpis.avgOrderValue}
        profitMarginPercentage={stats.kpis.profitMarginPercentage}
      />

      {/* WIDE CHART FOR ORDERS */}
      <OrderTrendChart data={stats.orderTrendData} />

      {/* SECONDARY CHARTS ROW */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Revenue Performance Chart (2 cols) */}
        <RevenueGrowthChart data={stats.revenueTrendData} />

        {/* Category Sales Share Donut (1 col) */}
        <CategoryDistributionChart data={stats.categorySalesData} />
      </div>

      {/* LOWER SECTION: TOP SELLERS AND RECENT ORDERS */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Selling Products List */}
        <TopProductsList products={stats.topProducts} />

        {/* Recent Transactions List */}
        <RecentOrdersList orders={stats.recentOrders} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full animate-pulse">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border shadow-sm relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* WIDE CHART FOR ORDERS */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-80" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* SECONDARY CHARTS ROW */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Revenue Performance Chart (2 cols) */}
        <Card className="bg-card border-border shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Category Sales Share Donut (1 col) */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-56" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* LOWER SECTION: TOP SELLERS AND RECENT ORDERS */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-72" />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-60" />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
