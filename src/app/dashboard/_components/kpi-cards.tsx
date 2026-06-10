import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, CreditCard, Users, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  totalRevenue: string;
  completedOrders: number;
  avgOrderValue: string;
  activeCustomers: number;
}

export function KpiCards({ totalRevenue, completedOrders, avgOrderValue, activeCustomers }: KpiCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Total Revenue */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{totalRevenue}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 2: Total Orders */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed Orders</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{completedOrders.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+12.2%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Average Order Value */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Order Value</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{avgOrderValue}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+5.6%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 4: Active Customers */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Customers</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{activeCustomers.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+14.8%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
