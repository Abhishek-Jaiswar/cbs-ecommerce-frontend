import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, CreditCard, Users, TrendingUp, Package, Archive, Percent } from "lucide-react";

interface KpiCardsProps {
  totalRevenue: string;
  totalProfit: string;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  inventoryValue: string;
  avgOrderValue: string;
  profitMarginPercentage: string;
}

export function KpiCards({
  totalRevenue,
  totalProfit,
  totalOrders,
  totalCustomers,
  totalProducts,
  inventoryValue,
  avgOrderValue,
  profitMarginPercentage
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

      {/* KPI 2: Total Profit */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-teal-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Profit</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{totalProfit}</div>
          <div className="flex items-center gap-1.5 text-xs text-teal-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+15.2%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Total Orders */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{totalOrders.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+12.2%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 4: Total Customers */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Customers</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{totalCustomers.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+14.8%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 5: Total Products */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Products</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Package className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{totalProducts.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+4.3%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 6: Inventory Value */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inventory Value</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Archive className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{inventoryValue}</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+2.1%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 7: Average Order Value */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Order Value</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{avgOrderValue}</div>
          <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+5.6%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI 8: Profit Margin % */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-pink-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profit Margin %</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
            <Percent className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight">{profitMarginPercentage}</div>
          <div className="flex items-center gap-1.5 text-xs text-pink-500 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+1.5%</span>
            <span className="text-muted-foreground font-normal">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
