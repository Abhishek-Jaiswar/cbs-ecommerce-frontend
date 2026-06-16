"use client";

import React, { useState, useMemo } from "react";
import {
  useGetUtmReportsQuery,
  useUpsertCampaignBudgetMutation,
} from "@/services/api/dashboard/dashboard-api";
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
} from "recharts";
import {
  ArrowDownToLine,
  TrendingUp,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  Search,
  Plus,
  Activity,
  Edit2,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SalesReportsPage() {
  const { data: reportsRes, isLoading, refetch } = useGetUtmReportsQuery();
  const [upsertCampaignBudget, { isLoading: isSavingBudget }] = useUpsertCampaignBudgetMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [spendAmount, setSpendAmount] = useState("");

  const utmReports = useMemo(() => reportsRes?.data ?? [], [reportsRes?.data]);

  // Filter campaigns by search term
  const filteredReports = useMemo(() => {
    return utmReports.filter((c: any) =>
      c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.source && c.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.medium && c.medium.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [utmReports, searchTerm]);

  // General KPIs based on filtered campaigns
  const kpis = useMemo(() => {
    let totalRevenue = 0;
    let totalSpend = 0;
    let totalOrders = 0;
    let totalClicks = 0;
    let topCampaign = "N/A";
    let maxRevenue = 0;

    utmReports.forEach((c: any) => {
      totalRevenue += c.revenue;
      totalSpend += c.spend;
      totalOrders += c.paidOrders;
      totalClicks += c.clicks;

      if (c.revenue > maxRevenue) {
        maxRevenue = c.revenue;
        topCampaign = c.campaignName;
      }
    });

    const netProfit = totalRevenue - totalSpend;
    const roi = totalSpend > 0 ? (netProfit / totalSpend) * 100 : 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    return {
      totalRevenue,
      totalSpend,
      totalOrders,
      totalClicks,
      netProfit,
      roi,
      roas,
      topCampaign,
    };
  }, [utmReports]);

  // Chart Data: Revenue vs Spend
  const chartData = useMemo(() => {
    return filteredReports.map((c: any) => ({
      name: c.campaignName.length > 15 ? c.campaignName.substring(0, 15) + "..." : c.campaignName,
      Revenue: c.revenue,
      Spend: c.spend,
    })).slice(0, 8); // Top 8 campaigns for readability
  }, [filteredReports]);

  // Funnel Data: Aggregate Event Funnel
  const funnelData = useMemo(() => {
    let totalClicks = 0;
    let totalCarts = 0;
    let totalOrders = 0;

    utmReports.forEach((c: any) => {
      totalClicks += c.clicks;
      totalCarts += c.addToCarts;
      totalOrders += c.paidOrders;
    });

    // Avoid 0 division issues in chart drawing
    return [
      { name: "Clicks / Clicks", count: totalClicks || 50 },
      { name: "Add To Carts", count: totalCarts || 15 },
      { name: "Paid Orders", count: totalOrders || 4 },
    ];
  }, [utmReports]);

  const handleOpenSpendModal = (campaign: any) => {
    setEditingCampaign(campaign);
    setSpendAmount(String(campaign.spend || ""));
    setIsSpendModalOpen(true);
  };

  const handleSaveSpend = async () => {
    if (!editingCampaign || !editingCampaign.campaignName) return;

    try {
      await upsertCampaignBudget({
        campaignName: editingCampaign.campaignName,
        budget: Number(spendAmount) || 0,
        source: editingCampaign.source,
        medium: editingCampaign.medium,
      }).unwrap();
      
      setIsSpendModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save campaign budget:", error);
    }
  };

  // CSV Exporter
  const downloadCsv = () => {
    if (!utmReports || utmReports.length === 0) return;

    const headers = [
      "Campaign Name",
      "Source",
      "Medium",
      "Clicks (Visits)",
      "Add to Carts",
      "Paid Orders",
      "Conversion Rate (%)",
      "Revenue (INR)",
      "Ad Spend (INR)",
      "Net Profit (INR)",
      "ROI (%)",
    ];

    const rows = utmReports.map((c: any) => [
      c.campaignName,
      c.source || "N/A",
      c.medium || "N/A",
      c.clicks,
      c.addToCarts,
      c.paidOrders,
      c.conversionRate.toFixed(2),
      c.revenue.toFixed(2),
      c.spend.toFixed(2),
      c.netProfit.toFixed(2),
      c.spend > 0 ? `${c.roi.toFixed(2)}%` : (c.revenue > 0 ? "Infinite" : "0.00%"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ROI_Report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-stone-50/50 p-8 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Loading Sales Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-[#FAF9F6] text-stone-900 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl font-serif font-medium text-stone-950">Sales & Campaign ROI</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track user landing campaigns, monitor funnel conversions, and calculate marketing return on ad spend (ROAS).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={downloadCsv}
            disabled={utmReports.length === 0}
            className="bg-stone-900 text-white rounded-none hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-9 px-4 flex items-center gap-1.5"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Download ROI Report
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Marketing Sales */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">Marketing Revenue</CardTitle>
            <div className="h-7 w-7 bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold tracking-tight">
              ₹{kpis.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
              <span>Attributed from UTM tags</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Ad Spend */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-stone-700" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ad Spend / Budget</CardTitle>
            <div className="h-7 w-7 bg-stone-100 text-stone-700 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold tracking-tight">
              ₹{kpis.totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
              <span>Logged ad expenses</span>
            </div>
          </CardContent>
        </Card>

        {/* Net ROI */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">Marketing ROI / ROAS</CardTitle>
            <div className="h-7 w-7 bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold tracking-tight text-emerald-600">
              {kpis.roi.toFixed(1)}% <span className="text-xs text-stone-500 font-normal">({kpis.roas.toFixed(2)}x ROAS)</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
              <span>Net Profit: ₹{kpis.netProfit.toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Campaign */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c29958]" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">Top Campaign</CardTitle>
            <div className="h-7 w-7 bg-amber-50/50 text-[#c29958] flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold tracking-tight truncate pr-2" title={kpis.topCampaign}>
              {kpis.topCampaign}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
              <span>Highest revenue yield</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Campaign Revenue vs Spend Bar Chart */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs lg:col-span-2">
          <CardHeader className="border-b border-stone-100 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-800">Revenue vs Spend (Top Campaigns)</CardTitle>
            <CardDescription className="text-xs text-stone-400">Comparing capital investments with attributed conversion values.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1eeeb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#777" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#777" }} />
                    <Tooltip contentStyle={{ fontSize: 12, backgroundColor: "#fff", border: "1px solid #e4dfd7" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Revenue" fill="#c29958" name="Revenue (₹)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Spend" fill="#292524" name="Ad Spend (₹)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-stone-400 italic">
                  No campaign statistics to display yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Funnel Conversions */}
        <Card className="bg-white border-stone-200 rounded-none shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-800">E-Commerce Funnel</CardTitle>
            <CardDescription className="text-xs text-stone-400">Combined traffic conversion steps for all UTM links.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-between h-[300px]">
            <div className="h-[180px] w-full">
              {funnelData[0].count > 50 || utmReports.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={funnelData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1eeeb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#777" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#777" }} />
                    <Tooltip contentStyle={{ fontSize: 12, backgroundColor: "#fff", border: "1px solid #e4dfd7" }} />
                    <Line type="monotone" dataKey="count" stroke="#c29958" strokeWidth={3} activeDot={{ r: 6 }} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-stone-400 italic">
                  No funnel event logs recorded.
                </div>
              )}
            </div>
            {/* Funnel metrics details */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-100">
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Clicks</p>
                <p className="text-sm font-bold text-stone-800">{kpis.totalClicks}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Carts</p>
                <p className="text-sm font-bold text-stone-800">
                  {utmReports.reduce((sum: number, c: any) => sum + c.addToCarts, 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-semibold">Orders</p>
                <p className="text-sm font-bold text-emerald-600">{kpis.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH AND DETAILED CAMPAIGN TABLE */}
      <Card className="bg-white border-stone-200 rounded-none shadow-xs">
        <CardHeader className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-800">Campaign Performances</CardTitle>
            <CardDescription className="text-xs text-stone-400">Detailed overview of UTM campaigns, parameters, and return yields.</CardDescription>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs border-stone-200 focus:border-[#c29958] focus:ring-1 focus:ring-[#c29958] rounded-none bg-stone-50/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse text-left">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Campaign</th>
                    <th className="p-4">Source / Medium</th>
                    <th className="p-4 text-center">Clicks</th>
                    <th className="p-4 text-center">Add to Carts</th>
                    <th className="p-4 text-center">Orders</th>
                    <th className="p-4 text-center">Conv. Rate</th>
                    <th className="p-4 text-right">Revenue</th>
                    <th className="p-4 text-right">Ad Spend</th>
                    <th className="p-4 text-center">ROI</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((c: any) => {
                    const hasSpend = c.spend > 0;
                    const roiText = hasSpend
                      ? `${c.roi.toFixed(1)}%`
                      : c.revenue > 0
                      ? "Infinite"
                      : "0.00%";
                    const isPositive = c.netProfit >= 0;

                    return (
                      <tr key={c.campaignName} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                        <td className="p-4 font-bold text-stone-900 flex items-center gap-1.5">
                          <Badge variant="outline" className="border-stone-300 rounded-none bg-stone-50 text-stone-800 text-[10px] px-1.5 py-0.5">
                            {c.campaignName}
                          </Badge>
                        </td>
                        <td className="p-4 text-stone-500">
                          {c.source || "organic"} / {c.medium || "organic"}
                        </td>
                        <td className="p-4 text-center font-mono font-medium">{c.clicks}</td>
                        <td className="p-4 text-center font-mono font-medium text-stone-500">{c.addToCarts}</td>
                        <td className="p-4 text-center font-mono font-bold text-stone-950">{c.paidOrders}</td>
                        <td className="p-4 text-center font-mono font-medium text-stone-500">{c.conversionRate.toFixed(1)}%</td>
                        <td className="p-4 text-right font-bold text-stone-900">
                          ₹{c.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-medium text-stone-600">
                          ₹{c.spend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`p-4 text-center font-bold font-mono ${isPositive ? "text-emerald-600" : "text-rose-500"}`}>
                          {roiText}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            onClick={() => handleOpenSpendModal(c)}
                            variant="outline"
                            className="h-7 w-7 p-0 border-stone-200 hover:border-stone-800 rounded-none"
                            title="Edit Ad Spend"
                          >
                            <Edit2 className="h-3 w-3 text-stone-600" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-400 italic">
              No campaign stats matching search query.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AD SPEND DIALOG */}
      <Dialog open={isSpendModalOpen} onOpenChange={setIsSpendModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none border border-stone-200 bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif font-medium text-stone-950">Update Campaign Budget</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Input the advertising spend (cost) for the campaign <span className="font-bold">&ldquo;{editingCampaign?.campaignName}&rdquo;</span> to recalculate ROI.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="spend" className="text-right text-xs font-bold uppercase tracking-wider text-stone-500">
                Ad Spend (₹)
              </label>
              <Input
                id="spend"
                type="number"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder="0.00"
                className="col-span-3 h-9 text-xs border-stone-200 focus:border-[#c29958] focus:ring-1 focus:ring-[#c29958] rounded-none bg-stone-50/50"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              onClick={() => setIsSpendModalOpen(false)}
              variant="outline"
              className="rounded-none border-stone-200 text-xs font-bold uppercase tracking-wider h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSpend}
              disabled={isSavingBudget}
              className="bg-stone-900 text-white rounded-none hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-9 px-4"
            >
              {isSavingBudget ? "Saving..." : "Save Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
