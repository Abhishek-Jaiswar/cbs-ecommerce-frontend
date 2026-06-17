"use client";

import React, { useState } from "react";
import {
  useGetReportPreviewQuery,
} from "@/services/api/reports/reports-api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Archive,
  Users,
  Eye,
  FileText,
  Calendar,
  RefreshCw,
  ArrowRight,
  Package,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const REPORT_TYPES = [
  { value: "SALES", label: "Sales Report" },
  { value: "PROFIT", label: "Profit Report" },
  { value: "DISCOUNT", label: "Discount Report" },
  { value: "INVENTORY", label: "Inventory Report" },
  { value: "PERFORMANCE", label: "Product Performance" },
  { value: "CUSTOMER", label: "Customer Analytics" },
  { value: "ORDER", label: "Order & Status Report" },
];

const DATE_FILTERS = [
  { value: "TODAY", label: "Today" },
  { value: "YESTERDAY", label: "Yesterday" },
  { value: "LAST_7_DAYS", label: "Last 7 Days" },
  { value: "LAST_30_DAYS", label: "Last 30 Days" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "CUSTOM", label: "Custom Date Range" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function ReportsDashboardPage() {
  const [reportType, setReportType] = useState("SALES");
  const [dateFilter, setDateFilter] = useState("LAST_30_DAYS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: response, isLoading, isFetching, refetch } = useGetReportPreviewQuery({
    reportType,
    filter: dateFilter,
    startDate: dateFilter === "CUSTOM" ? startDate : undefined,
    endDate: dateFilter === "CUSTOM" ? endDate : undefined,
  });

  const preview = response?.data;

  // Render KPIs dynamically depending on Report Type
  const renderKPIs = () => {
    if (!preview?.kpis) return null;

    const items = [];
    if (reportType === "SALES") {
      items.push(
        { label: "Total Revenue", val: `₹${(preview.kpis.totalRevenue || 0).toLocaleString("en-IN")}`, desc: "From paid orders", icon: <DollarSign className="h-4 w-4 text-emerald-500" /> },
        { label: "Total Orders", val: (preview.kpis.totalOrders || 0).toLocaleString(), desc: "Placed non-cancelled", icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
        { label: "Units Sold", val: (preview.kpis.totalUnitsSold || 0).toLocaleString(), desc: "Total quantities", icon: <Package className="h-4 w-4 text-indigo-500" /> },
        { label: "Avg Order Value (AOV)", val: `₹${Math.round(preview.kpis.avgOrderValue || 0).toLocaleString("en-IN")}`, desc: "Revenue per order", icon: <TrendingUp className="h-4 w-4 text-amber-500" /> }
      );
    } else if (reportType === "PROFIT") {
      items.push(
        { label: "Gross Revenue", val: `₹${(preview.kpis.grossRevenue || 0).toLocaleString("en-IN")}`, desc: "Sales value", icon: <DollarSign className="h-4 w-4 text-emerald-500" /> },
        { label: "Total Product Cost", val: `₹${(preview.kpis.totalProductCost || 0).toLocaleString("en-IN")}`, desc: "Asset value sold", icon: <Archive className="h-4 w-4 text-red-500" /> },
        { label: "Total Net Profit", val: `₹${(preview.kpis.totalProfit || 0).toLocaleString("en-IN")}`, desc: "Revenue minus cost", icon: <TrendingUp className="h-4 w-4 text-teal-500" /> },
        { label: "Profit Margin %", val: `${(preview.kpis.profitMargin || 0).toFixed(1)}%`, desc: "Average percentage", icon: <Percent className="h-4 w-4 text-pink-500" /> }
      );
    } else if (reportType === "DISCOUNT") {
      items.push(
        { label: "Total Discount Given", val: `₹${(preview.kpis.totalDiscountGiven || 0).toLocaleString("en-IN")}`, desc: "From products & coupons", icon: <Percent className="h-4 w-4 text-amber-500" /> },
        { label: "Avg Discount %", val: `${(preview.kpis.avgDiscountPercentage || 0).toFixed(1)}%`, desc: "Of total MRP value", icon: <TrendingUp className="h-4 w-4 text-blue-500" /> }
      );
    } else if (reportType === "INVENTORY") {
      items.push(
        { label: "Distinct Products", val: (preview.kpis.totalProducts || 0).toLocaleString(), desc: "Catalog items count", icon: <Package className="h-4 w-4 text-blue-500" /> },
        { label: "Out of Stock", val: (preview.kpis.outOfStock || 0).toLocaleString(), desc: "Variants with stock = 0", icon: <Archive className="h-4 w-4 text-red-500" /> },
        { label: "Low Stock Items", val: (preview.kpis.lowStock || 0).toLocaleString(), desc: "Stock below 10 units", icon: <Percent className="h-4 w-4 text-amber-500" /> },
        { label: "Inventory Value (Asset)", val: `₹${(preview.kpis.totalInventoryValue || 0).toLocaleString("en-IN")}`, desc: "Cost value in stock", icon: <DollarSign className="h-4 w-4 text-emerald-500" /> }
      );
    } else if (reportType === "PERFORMANCE") {
      items.push(
        { label: "Total Page Views", val: (preview.kpis.totalViews || 0).toLocaleString(), desc: "View product events", icon: <Eye className="h-4 w-4 text-blue-500" /> },
        { label: "Total Checkout Purchases", val: (preview.kpis.totalPurchases || 0).toLocaleString(), desc: "Conversion events", icon: <ShoppingCart className="h-4 w-4 text-emerald-500" /> },
        { label: "Avg Conversion Rate", val: `${(preview.kpis.avgConversionRate || 0).toFixed(2)}%`, desc: "Purchases / Views", icon: <TrendingUp className="h-4 w-4 text-purple-500" /> }
      );
    } else if (reportType === "CUSTOMER") {
      items.push(
        { label: "Total Customers", val: (preview.kpis.totalCustomers || 0).toLocaleString(), desc: "Registered accounts", icon: <Users className="h-4 w-4 text-blue-500" /> },
        { label: "New Customers", val: (preview.kpis.newCustomers || 0).toLocaleString(), desc: "Registered in range", icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
        { label: "Repeat Customers", val: (preview.kpis.repeatCustomers || 0).toLocaleString(), desc: "Users with >1 orders", icon: <RefreshCw className="h-4 w-4 text-amber-500" /> }
      );
    } else if (reportType === "ORDER") {
      items.push(
        { label: "Total Orders", val: (preview.kpis.totalOrders || 0).toLocaleString(), desc: "All statuses", icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
        { label: "Average Order Value", val: `₹${Math.round(preview.kpis.avgOrderValue || 0).toLocaleString("en-IN")}`, desc: "Total sum / count", icon: <DollarSign className="h-4 w-4 text-emerald-500" /> }
      );
    }

    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <Card key={idx} className="bg-card border-border shadow-sm relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold tracking-tight">{item.val}</div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render Charts depending on Report Type
  const renderCharts = () => {
    if (!preview) return null;

    if (reportType === "SALES") {
      return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Top Selling Products</CardTitle>
              <CardDescription>Top 10 items sorted by units sold</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preview.topSellingProducts || []} margin={{ left: 10, right: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, "Units Sold"]} />
                  <Bar dataKey="quantity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Revenue by Category</CardTitle>
              <CardDescription>Revenue share per catalog category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preview.revenueByCategory || []}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {(preview.revenueByCategory || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else if (reportType === "PROFIT") {
      const topProfits = (preview.profitByProduct || []).slice(0, 5);
      return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Revenue vs Cost vs Profit</CardTitle>
              <CardDescription>Profit analysis for top 5 products</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProfits}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Profit by Category</CardTitle>
              <CardDescription>Profit margin distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preview.profitByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else if (reportType === "DISCOUNT") {
      return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Highest Discounted Products</CardTitle>
              <CardDescription>Top products receiving price discounts</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preview.highestDiscountedProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Bar dataKey="discountAmount" name="Discount Given" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Discount by Category</CardTitle>
              <CardDescription>Attributed discounts per category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preview.discountByCategory || []}
                    dataKey="discountAmount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {(preview.discountByCategory || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else if (reportType === "INVENTORY") {
      return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Asset Value by Category</CardTitle>
              <CardDescription>Financial value of current stock</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preview.inventoryByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Bar dataKey="value" name="Inventory Value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Stock Distribution</CardTitle>
              <CardDescription>Total quantities in stock per category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preview.inventoryByCategory || []}
                    dataKey="stock"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {(preview.inventoryByCategory || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, "Stock Quantity"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    } else if (reportType === "PERFORMANCE") {
      const topPerformance = (preview.productPerformance || []).slice(0, 8);
      return (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Product Conversion Rates</CardTitle>
            <CardDescription>Total views, total purchases, and conversion rate (%) for top 8 products</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" unit="%" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="views" name="Page Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="purchases" name="Purchases" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="conversionRate" name="Conversion Rate (%)" stroke="#8b5cf6" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    } else if (reportType === "CUSTOMER") {
      const topCustomers = (preview.customerRanking || []).slice(0, 10);
      return (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top Customers by Lifetime Spend (CLV)</CardTitle>
            <CardDescription>Top 10 customer values in INR</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                <Bar dataKey="clv" name="CLV" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    } else if (reportType === "ORDER") {
      const statusData = Object.entries(preview.kpis?.statusCounts || {}).map(([name, value]) => ({
        name,
        value,
      }));
      return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Orders by Fulfillment Status</CardTitle>
              <CardDescription>Volume distribution by status</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Sales Timeline (Daily)</CardTitle>
              <CardDescription>Volume and order counts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={preview.orderTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" name="Revenue Amount (₹)" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="count" name="Order Count" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null;
  };

  // Render Table depending on Report Type
  const renderTable = () => {
    if (!preview) return null;

    let headers: string[] = [];
    let rows: any[] = [];

    if (reportType === "SALES") {
      headers = ["Product / Entity", "SKU / Category", "Units Sold", "Attributed Revenue"];
      rows = (preview.topSellingProducts || []).map((p: any) => [
        p.name,
        p.sku || "N/A",
        (p.quantity || 0).toLocaleString(),
        `₹${(p.revenue || 0).toLocaleString("en-IN")}`,
      ]);
    } else if (reportType === "PROFIT") {
      headers = ["Product Name", "SKU", "Revenue", "Cost Price", "Profit Amount", "Margin %"];
      rows = (preview.profitByProduct || []).slice(0, 15).map((p: any) => [
        p.name,
        p.sku || "N/A",
        `₹${(p.revenue || 0).toLocaleString("en-IN")}`,
        `₹${(p.cost || 0).toLocaleString("en-IN")}`,
        `₹${(p.profit || 0).toLocaleString("en-IN")}`,
        `${(p.marginPercentage || 0).toFixed(1)}%`,
      ]);
    } else if (reportType === "DISCOUNT") {
      headers = ["Product Name", "SKU", "Total Discount Applied", "Avg Discount %"];
      rows = (preview.discountByProduct || []).slice(0, 15).map((p: any) => [
        p.name,
        p.sku || "N/A",
        `₹${(p.discountAmount || 0).toLocaleString("en-IN")}`,
        `${(p.avgDiscountPercentage || 0).toFixed(1)}%`,
      ]);
    } else if (reportType === "INVENTORY") {
      headers = ["Product / Variant", "SKU", "Color / Size", "Units in Stock", "Cost Price", "Asset Value"];
      rows = (preview.stockDetails || []).slice(0, 25).map((s: any) => [
        s.name,
        s.sku || "N/A",
        `${s.color || "None"} / ${s.size || "None"}`,
        s.stock === 0 ? "OUT OF STOCK" : (s.stock || 0).toLocaleString(),
        `₹${(s.costPrice || 0).toLocaleString("en-IN")}`,
        `₹${(s.value || 0).toLocaleString("en-IN")}`,
      ]);
    } else if (reportType === "PERFORMANCE") {
      headers = ["Product Name", "Product ID", "Page Views", "Purchases Count", "Conversion Rate %"];
      rows = (preview.productPerformance || []).slice(0, 15).map((p: any) => [
        p.name,
        p.id,
        (p.views || 0).toLocaleString(),
        (p.purchases || 0).toLocaleString(),
        `${(p.conversionRate || 0).toFixed(2)}%`,
      ]);
    } else if (reportType === "CUSTOMER") {
      headers = ["Customer Name", "Customer Email", "Total Orders", "Lifetime Spend (CLV)"];
      rows = (preview.customerRanking || []).slice(0, 15).map((c: any) => [
        c.name,
        c.email,
        (c.ordersCount || 0).toLocaleString(),
        `₹${(c.clv || 0).toLocaleString("en-IN")}`,
      ]);
    } else if (reportType === "ORDER") {
      headers = ["Order Number", "Customer", "Date", "Status", "Payment", "Total Paid"];
      rows = (preview.ordersDetails || []).slice(0, 20).map((o: any) => [
        o.orderNumber,
        o.customer,
        o.date,
        o.status,
        o.paymentStatus,
        `₹${(o.total || 0).toLocaleString("en-IN")}`,
      ]);
    }

    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-sm font-semibold">Detailed Preview Breakdowns</CardTitle>
            <CardDescription>Top records for the current report type</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
            <Link href="/dashboard/reports/download-center">
              Go to Download Center <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {headers.map((h, i) => (
                  <th key={i} className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-8 text-muted-foreground text-xs">
                    No data points found for this report and filters.
                  </td>
                </tr>
              ) : (
                rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-border/60 hover:bg-secondary/10 transition-colors">
                    {row.map((cell: any, cIdx: number) => {
                      const isOutOfStock = cell === "OUT OF STOCK";
                      return (
                        <td key={cIdx} className="px-6 py-3.5 text-xs">
                          {isOutOfStock ? (
                            <span className="inline-flex px-1.5 py-0.5 rounded-md text-[10px] bg-red-100 text-red-700 font-bold">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics Engine</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access deep insights into store sales, profits, inventory valuations, discounts, and customer values.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="gap-1.5 h-9 font-semibold">
            <Link href="/dashboard/reports/download-center">
              <FileText className="h-4 w-4" /> Download Center
            </Link>
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card border border-border p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Report Type Selector */}
          <div className="space-y-1 w-full sm:w-[200px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Report Category</span>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter Selector */}
          <div className="space-y-1 w-full sm:w-[160px]">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Date Range Filter</span>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Picker Inputs */}
          {dateFilter === "CUSTOM" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="space-y-1 w-full sm:w-[130px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Start Date</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1 w-full sm:w-[130px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">End Date</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button onClick={() => refetch()} variant="outline" size="sm" className="h-9" disabled={isFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-[320px] w-full rounded-lg" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          {renderKPIs()}

          {/* Visualization Charts */}
          {renderCharts()}

          {/* Detailed Data Breakdowns */}
          {renderTable()}
        </div>
      )}
    </div>
  );
}
