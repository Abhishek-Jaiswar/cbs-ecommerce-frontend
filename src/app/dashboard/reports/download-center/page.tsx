"use client";

import React, { useState } from "react";
import {
  useGetReportsHistoryQuery,
  useGenerateReportMutation,
} from "@/services/api/reports/reports-api";
import {
  ArrowDownToLine,
  FileSpreadsheet,
  FileText,
  History,
  Plus,
  Loader2,
  Calendar,
  Settings,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const REPORT_TYPES = [
  { value: "SALES", label: "Sales Report" },
  { value: "PROFIT", label: "Profit Report" },
  { value: "DISCOUNT", label: "Discount Report" },
  { value: "INVENTORY", label: "Inventory Valuation" },
  { value: "PERFORMANCE", label: "Product Performance" },
  { value: "CUSTOMER", label: "Customer List" },
  { value: "ORDER", label: "Order List" },
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

const FORMATS = [
  { value: "XLSX", label: "Excel Spreadsheet (.xlsx)" },
  { value: "CSV", label: "Comma Separated Values (.csv)" },
];

export default function DownloadCenterPage() {
  const { data: historyRes, isLoading: isHistoryLoading } = useGetReportsHistoryQuery();
  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();

  const [reportType, setReportType] = useState("SALES");
  const [dateFilter, setDateFilter] = useState("LAST_30_DAYS");
  const [format, setFormat] = useState("XLSX");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const history = historyRes?.data ?? [];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (dateFilter === "CUSTOM" && (!startDate || !endDate)) {
      setErrorMsg("Please specify start and end dates for custom range.");
      return;
    }

    try {
      const result = await generateReport({
        reportType,
        filter: dateFilter,
        format,
        startDate: dateFilter === "CUSTOM" ? startDate : undefined,
        endDate: dateFilter === "CUSTOM" ? endDate : undefined,
      }).unwrap();

      if (result.success) {
        setSuccessMsg(`Report generated successfully!`);
      } else {
        setErrorMsg(result.message || "Failed to generate report.");
      }
    } catch (err: any) {
      setErrorMsg(err.data?.message || err.message || "Error generating report.");
    }
  };

  const getDownloadLink = (url: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const path = url.startsWith("/") ? url : "/" + url;
    return base + path;
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Download Center</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate customized spreadsheet exports in CSV or Excel format to track store performance offline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5 h-9 font-semibold">
            <Link href="/dashboard/reports">
              Back to Preview Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Generation Form */}
        <Card className="bg-card border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Create Report Export</CardTitle>
            <CardDescription>Select filters and generate a download link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 text-xs bg-emerald-500/10 text-emerald-600 rounded-md font-medium">
                  {successMsg}
                </div>
              )}

              {/* Report Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-10">
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

              {/* Date Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Scope</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-10" disabled={reportType === "INVENTORY"}>
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
                {reportType === "INVENTORY" && (
                  <p className="text-[10px] text-amber-500">Inventory valuation is always a current snapshot.</p>
                )}
              </div>

              {/* Custom Range Picker */}
              {dateFilter === "CUSTOM" && reportType !== "INVENTORY" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-10 font-bold uppercase tracking-wider text-xs gap-1.5"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Queue & Generate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="bg-card border-border shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <History className="h-4 w-4 text-muted-foreground" />
                Report Generation History
              </CardTitle>
              <CardDescription>Retrieve past generated files</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isHistoryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-2">
                <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-xs">No reports generated yet. Use the creation form to generate one.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Report</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Date Scope</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Format</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Generated At</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h: any) => {
                    const isXlsx = h.format === "XLSX";
                    const formattedDate = new Date(h.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={h.id} className="border-b border-border/60 hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          {h.reportType} Report
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{h.dateRange}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={isXlsx ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-blue-500/10 text-blue-600 border-blue-500/30"}>
                            {h.format}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formattedDate}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-[11px] font-bold text-stone-700 hover:text-stone-900"
                          >
                            <a href={getDownloadLink(h.downloadUrl)} download>
                              <ArrowDownToLine className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
