"use client";

import * as React from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  Percent,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MousePointerClick,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// 1. Mock Data for Analytics
const visitorTrendData = [
  { day: "01 Jun", visitors: 3100, pageViews: 7200 },
  { day: "02 Jun", visitors: 3400, pageViews: 8100 },
  { day: "03 Jun", visitors: 3200, pageViews: 7900 },
  { day: "04 Jun", visitors: 4100, pageViews: 9800 },
  { day: "05 Jun", visitors: 4500, pageViews: 11000 },
  { day: "06 Jun", visitors: 3800, pageViews: 8600 },
  { day: "07 Jun", visitors: 4200, pageViews: 9200 },
  { day: "08 Jun", visitors: 4900, pageViews: 12200 },
  { day: "09 Jun", visitors: 5300, pageViews: 13500 },
  { day: "10 Jun", visitors: 5100, pageViews: 12800 },
  { day: "11 Jun", visitors: 5800, pageViews: 14900 },
  { day: "12 Jun", visitors: 6200, pageViews: 16200 },
];

const conversionFunnelData = [
  { name: "Product Views", count: 12000, percentage: 100, fill: "hsl(var(--primary))" },
  { name: "Add to Cart", count: 3200, percentage: 26.6, fill: "#3b82f6" },
  { name: "Checkout Initiated", count: 1800, percentage: 15.0, fill: "#eab308" },
  { name: "Purchased", count: 1245, percentage: 10.3, fill: "#10b981" },
];

const deviceShareData = [
  { name: "Desktop", value: 55, fill: "#3b82f6" },
  { name: "Mobile", value: 38, fill: "#10b981" },
  { name: "Tablet", value: 7, fill: "#eab308" },
];

const trafficSources = [
  { source: "Google (Organic)", visitors: "18,450", bounceRate: "42.1%", conversion: "3.2%" },
  { source: "Direct Traffic", visitors: "12,900", bounceRate: "35.4%", conversion: "4.8%" },
  { source: "Instagram (Social)", visitors: "9,820", bounceRate: "58.2%", conversion: "2.1%" },
  { source: "Newsletter (Email)", visitors: "4,200", bounceRate: "28.1%", conversion: "6.5%" },
  { source: "Google Ads (Paid)", visitors: "3,100", bounceRate: "46.3%", conversion: "3.9%" },
];

const visitorChartConfig = {
  visitors: { label: "Unique Visitors", color: "hsl(var(--primary))" },
  pageViews: { label: "Page Views", color: "#3b82f6" },
};

const funnelChartConfig = {
  count: { label: "Users", color: "hsl(var(--primary))" },
};

const deviceChartConfig = {
  value: { label: "Share %", color: "#3b82f6" },
};

export default function AnalyticsDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section with time filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">
            Monitor real-time visitor traffic, device analytics, and shopping cart conversions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg text-xs font-semibold self-start sm:self-auto shadow-inner">
          <span className="px-2.5 py-1 rounded bg-background shadow-xs text-foreground cursor-pointer">Last 30 Days</span>
          <span className="px-2.5 py-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Quarterly</span>
          <span className="px-2.5 py-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Yearly</span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Unique Visitors */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unique Visitors</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">54,342</div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+21.4%</span>
              <span className="text-muted-foreground font-normal">vs last 30 days</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Total Page Views */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page Views</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">1,38,320</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+18.1%</span>
              <span className="text-muted-foreground font-normal">vs last 30 days</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Store Conversion Rate */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversion Rate</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">3.12%</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+0.42%</span>
              <span className="text-muted-foreground font-normal">vs last 30 days</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Avg Session Time */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Session Time</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">4m 32s</div>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
              <span className="text-muted-foreground font-normal">vs last 30 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WIDE VISITOR TRAFFIC LINE CHART */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold">Visitor Traffic & Engagement</CardTitle>
              <CardDescription className="text-xs">Compare monthly unique visitors alongside total visual page views.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1 text-[10px]">
              <Activity className="h-3 w-3 animate-pulse" /> Live visitor tracker
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <ChartContainer config={visitorChartConfig} className="h-[260px] w-full">
            <LineChart data={visitorTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
                name="visitors"
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="pageViews"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* SECONDARY ANALYTICS ROW */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Shopping Cart Conversion Funnel Bar (2 cols) */}
        <Card className="bg-card border-border shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Shopping Cart Funnel</CardTitle>
            <CardDescription className="text-xs">Cart dropoff and conversion rates across the customer checkout journey.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <ChartContainer config={funnelChartConfig} className="h-[220px] w-full">
              <BarChart data={conversionFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="count" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Traffic Share Radial Bar Chart (1 col) */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Device Breakdown</CardTitle>
            <CardDescription className="text-xs">Share of sessions by device platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-center min-h-[220px]">
            <div className="h-[140px] w-full relative flex items-center justify-center">
              <ChartContainer config={deviceChartConfig} className="h-full w-full">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={10}
                  data={deviceShareData}
                >
                  <RadialBar
                    background
                    dataKey="value"
                  />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-bold font-mono">55%</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Desktop Dominant</span>
              </div>
            </div>
            {/* Device detail legends */}
            <div className="space-y-2 mt-4 text-xs font-semibold">
              <div className="flex items-center justify-between text-blue-500 border-b border-border/50 pb-1.5">
                <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> Desktop</span>
                <span>55%</span>
              </div>
              <div className="flex items-center justify-between text-emerald-500 border-b border-border/50 pb-1.5">
                <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Mobile</span>
                <span>38%</span>
              </div>
              <div className="flex items-center justify-between text-amber-500">
                <span className="flex items-center gap-1.5"><Tablet className="h-3.5 w-3.5" /> Tablet</span>
                <span>7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LOWER SECTION: TRAFFIC SOURCES TABLE */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-bold">Top Traffic Referrals</CardTitle>
          <CardDescription className="text-xs">Performances and conversion yields of primary incoming marketing channels.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                  <th className="p-4">Traffic Referral Source</th>
                  <th className="p-4">Uniques Visitors</th>
                  <th className="p-4">Bounce Rate</th>
                  <th className="p-4 text-right">Conversion Ratio</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((source, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                      <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {source.source}
                    </td>
                    <td className="p-4 font-mono font-medium">{source.visitors}</td>
                    <td className="p-4 font-mono text-muted-foreground">{source.bounceRate}</td>
                    <td className="p-4 font-mono text-right text-emerald-500 font-semibold">{source.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline replacement helper for Live/Activity icon
function Activity(props: React.ComponentProps<"svg">) {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
