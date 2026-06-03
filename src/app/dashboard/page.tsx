"use client";

import * as React from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  Users,
  ArrowUpRight,
  TrendingUp,
  Package,
  Activity,
  Plus,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// 1. Mock Data for Charts
const orderTrendData = [
  { date: "Jan", orders: 120, target: 100 },
  { date: "Feb", orders: 145, target: 110 },
  { date: "Mar", orders: 152, target: 120 },
  { date: "Apr", orders: 180, target: 130 },
  { date: "May", orders: 210, target: 150 },
  { date: "Jun", orders: 245, target: 180 },
  { date: "Jul", orders: 260, target: 200 },
  { date: "Aug", orders: 235, target: 210 },
  { date: "Sep", orders: 285, target: 220 },
  { date: "Oct", orders: 310, target: 240 },
  { date: "Nov", orders: 380, target: 280 },
  { date: "Dec", orders: 495, target: 350 },
];

const revenueTrendData = [
  { month: "Jan", revenue: 145000, target: 120000 },
  { month: "Feb", revenue: 182000, target: 140000 },
  { month: "Mar", revenue: 195000, target: 150000 },
  { month: "Apr", revenue: 220000, target: 180000 },
  { month: "May", revenue: 290000, target: 220000 },
  { month: "Jun", revenue: 310000, target: 250000 },
  { month: "Jul", revenue: 340000, target: 280000 },
  { month: "Aug", revenue: 320000, target: 280000 },
  { month: "Sep", revenue: 380000, target: 300000 },
  { month: "Oct", revenue: 410000, target: 320000 },
  { month: "Nov", revenue: 490000, target: 380000 },
  { month: "Dec", revenue: 620000, target: 450000 },
];

const categorySalesData = [
  { name: "Rings", value: 450, color: "#eab308" },      // Gold/Amber
  { name: "Necklaces", value: 320, color: "#f97316" },  // Orange
  { name: "Earrings", value: 280, color: "#3b82f6" },   // Blue
  { name: "Bracelets", value: 195, color: "#10b981" },  // Emerald
];

const topProducts = [
  {
    id: "1",
    name: "Diamond Solitaire Halo Ring",
    category: "Rings",
    sales: 142,
    revenue: "₹1,27,79,858",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&q=80",
    initials: "DR",
  },
  {
    id: "2",
    name: "Classic Cultured Pearl Necklace",
    category: "Necklaces",
    sales: 98,
    revenue: "₹58,80,000",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=80&q=80",
    initials: "PN",
  },
  {
    id: "3",
    name: "Sparkling Diamond Tennis Bracelet",
    category: "Bracelets",
    sales: 76,
    revenue: "₹1,89,99,240",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=80&q=80",
    initials: "TB",
  },
  {
    id: "4",
    name: "Classic Diamond Stud Earrings",
    category: "Earrings",
    sales: 64,
    revenue: "₹38,40,000",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=80&q=80",
    initials: "DE",
  },
];

const recentOrders = [
  {
    id: "ORD-9482",
    customer: "Aishwarya Rai",
    email: "aishwarya@example.com",
    status: "DELIVERED",
    total: "₹89,999",
    date: "10 mins ago",
  },
  {
    id: "ORD-9481",
    customer: "Ranbir Kapoor",
    email: "ranbir@example.com",
    status: "PROCESSING",
    total: "₹1,49,999",
    date: "42 mins ago",
  },
  {
    id: "ORD-9480",
    customer: "Priyanka Chopra",
    email: "priyanka@example.com",
    status: "PENDING",
    total: "₹59,999",
    date: "2 hours ago",
  },
  {
    id: "ORD-9479",
    customer: "Virat Kohli",
    email: "virat@example.com",
    status: "DELIVERED",
    total: "₹2,49,000",
    date: "Yesterday",
  },
  {
    id: "ORD-9478",
    customer: "Deepika Padukone",
    email: "deepika@example.com",
    status: "CANCELLED",
    total: "₹1,20,000",
    date: "Yesterday",
  },
];

// Recharts colors config mappings
const orderChartConfig = {
  orders: { label: "Completed Orders", color: "hsl(var(--primary))" },
  target: { label: "Target Orders", color: "hsl(var(--muted-foreground)/0.3)" },
};

const revenueChartConfig = {
  revenue: { label: "Revenue Actual", color: "#10b981" },
  target: { label: "Revenue Target", color: "rgba(16,185,129,0.2)" },
};

const categoryChartConfig = {
  rings: { label: "Rings", color: "#eab308" },
  necklaces: { label: "Necklaces", color: "#f97316" },
  earrings: { label: "Earrings", color: "#3b82f6" },
  bracelets: { label: "Bracelets", color: "#10b981" },
};

export default function DashboardOverviewPage() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage listing status, monitor active KPIs, and track sales revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="gap-1.5 shadow-sm font-semibold">
            <Link href="/dashboard/products/create">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI CARDS GRID */}
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
            <div className="text-2xl font-bold tracking-tight">₹37,85,200</div>
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
            <div className="text-2xl font-bold tracking-tight">1,245</div>
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
            <div className="text-2xl font-bold tracking-tight">₹3,040</div>
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
            <div className="text-2xl font-bold tracking-tight">3,842</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+14.8%</span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WIDE CHART FOR ORDERS */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold">Order Trends & Performance</CardTitle>
              <CardDescription className="text-xs">Wide interactive log tracking order fulfillment rates vs monthly targets.</CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-xs font-semibold">
              <span className="px-2 py-0.5 rounded bg-background shadow-xs text-foreground">12 Months</span>
              <span className="px-2 py-0.5 text-muted-foreground">30 Days</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <ChartContainer config={orderChartConfig} className="h-[280px] w-full">
            <AreaChart data={orderTrendData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="orders"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--muted-foreground)/0.4)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
                name="target"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t border-border/60 p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Target fulfillment rate: <strong className="text-foreground">141%</strong> overall</span>
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> High volume holiday season
          </span>
        </CardFooter>
      </Card>

      {/* SECONDARY CHARTS ROW */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Revenue Performance Chart (2 cols) */}
        <Card className="bg-card border-border shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Revenue Growth</CardTitle>
            <CardDescription className="text-xs">Compare monthly target goals with actual sales revenue.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <ChartContainer config={revenueChartConfig} className="h-[220px] w-full">
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={60}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="revenue" />
                <Bar dataKey="target" fill="rgba(16,185,129,0.15)" radius={[4, 4, 0, 0]} name="target" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Sales Share Donut (1 col) */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Category Distribution</CardTitle>
            <CardDescription className="text-xs">Distribution of sales volume by sub-categories.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-center min-h-[220px]">
            <div className="h-[160px] w-full relative flex items-center justify-center">
              <ChartContainer config={categoryChartConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={categorySalesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-mono">1,245</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Sales</span>
              </div>
            </div>
            {/* Visual Legends */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {categorySalesData.map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}:</span>
                  <span className="text-foreground">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LOWER SECTION: TOP SELLERS AND RECENT ORDERS */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Selling Products List */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-bold">Top Selling Products</CardTitle>
                <CardDescription className="text-xs">Highest generating jewelry listings by sales quantity.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs hover:bg-accent">
                <Link href="/dashboard/products">Manage Inventory</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-muted/15 transition-colors border border-transparent hover:border-border/30">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-semibold text-xs text-muted-foreground">{p.initials}</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-foreground block max-w-[180px] sm:max-w-[280px] truncate">{p.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase font-mono tracking-wider bg-background border-border/80">
                      {p.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground block">{p.revenue}</span>
                  <span className="text-[11px] text-muted-foreground block">{p.sales} sales</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
                <CardDescription className="text-xs">Most recent transaction checkout activity.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs hover:bg-accent">
                <Link href="/dashboard/orders">View All Orders</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-muted/15 transition-colors border border-transparent hover:border-border/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                      {ord.customer.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{ord.customer}</span>
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-1 rounded">{ord.id}</span>
                    </div>
                    <span className="text-xs text-muted-foreground block truncate max-w-[180px]">{ord.email}</span>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-sm font-bold text-foreground block font-mono">{ord.total}</span>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[9px] text-muted-foreground">{ord.date}</span>
                    <Badge
                      variant="outline"
                      className={`text-[8px] tracking-wide py-0 px-1.5 uppercase font-mono ${
                        ord.status === "DELIVERED"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : ord.status === "PROCESSING"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : ord.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}
                    >
                      {ord.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Inline replacement for CheckCircle2 (as import was crashing or missing in lucide-react definition)
function CheckCircle2(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
