"use client";

import React, { useState } from "react";
import {
  useGetPaymentsQuery,
  Payment,
} from "@/services/api/checkout-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Custom Tooltip component for Recharts that supports dark mode beautifully
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg shadow-md text-xs font-mono">
        <p className="text-stone-500 dark:text-stone-400 mb-1">{label}</p>
        <p className="font-bold text-stone-900 dark:text-stone-50">
          Amount: <span className="text-amber-600 dark:text-amber-500">₹{payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch payments list
  const {
    data: paymentsRes,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetPaymentsQuery({ page, limit });

  const paymentsData = paymentsRes?.data;
  const items = paymentsData?.items ?? [];
  const totalPages = paymentsData?.totalPages ?? 1;

  // Aggregate stats
  const totalCount = items.length;
  const paidPayments = items.filter((p) => p.status === "PAID");
  const failedCount = items.filter((p) => p.status === "FAILED").length;
  const capturedAmountSum = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Recharts aggregation by date
  const chartDataMap = items.reduce((acc: Record<string, number>, payment) => {
    if (payment.status === "PAID") {
      const dateStr = new Date(payment.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      acc[dateStr] = (acc[dateStr] || 0) + parseFloat(payment.amount);
    }
    return acc;
  }, {});

  const chartData = Object.entries(chartDataMap)
    .map(([date, amount]) => ({
      date,
      amount: parseFloat(amount.toFixed(2)),
    }))
    .reverse(); // chronological ordering

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "PAID":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 rounded-md">Paid</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-850 rounded-md">Pending</Badge>;
      case "FAILED":
        return <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800 rounded-md">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-stone-50 text-stone-500 border-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800 rounded-md">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toUpperCase()) {
      case "CARD":
        return <CreditCard size={12} className="text-stone-400 dark:text-stone-500 mr-1.5 inline" />;
      case "COD":
        return <DollarSign size={12} className="text-stone-400 dark:text-stone-500 mr-1.5 inline" />;
      default:
        return <ShieldCheck size={12} className="text-stone-400 dark:text-stone-500 mr-1.5 inline" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-955 dark:text-stone-50">
            Payment Transactions
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Audit payment gateway logs, reconcile sales receipts, and review captured funds.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-auto shadow-md gap-2 border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-950 dark:text-stone-50 text-xs font-bold uppercase tracking-wider h-10 px-4 flex items-center justify-center bg-white dark:bg-stone-950 transition-colors"
        >
          <RefreshCw size={14} className={`${isFetching ? "animate-spin" : ""}`} />
          Refresh Audit
        </Button>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Captured Revenue</span>
              <p className="text-3xl text-stone-955 dark:text-stone-50 font-extrabold">₹{capturedAmountSum.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Attempts</span>
              <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">{totalCount}</p>
            </div>
            <div className="h-10 w-10 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Failed Attempts</span>
              <p className="text-3xl text-rose-600 dark:text-rose-450 font-extrabold">{failedCount}</p>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Conversion Rate</span>
              <p className="text-3xl text-emerald-600 dark:text-emerald-400 font-extrabold">
                {totalCount > 0 ? `${Math.round((paidPayments.length / totalCount) * 100)}%` : "0%"}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recharts chart */}
      <Card className="border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-stone-950 rounded-lg overflow-hidden">
        <CardHeader className="border-b border-stone-100 dark:border-stone-900 pb-4">
          <CardTitle className="text-base font-bold text-stone-950 dark:text-stone-50">Transaction Volume Trends</CardTitle>
          <CardDescription className="text-xs text-stone-500 dark:text-stone-400">Daily captured values of processed payments logs.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-80">
          {isLoading ? (
            <div className="h-full flex justify-center items-center">
              <RefreshCw size={24} className="animate-spin text-stone-400 dark:text-stone-600" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex justify-center items-center italic text-stone-400 text-xs">
              No captured payments history to display chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-800" strokeOpacity={0.5} />
                <XAxis dataKey="date" stroke="#78716c" fontSize={10} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#d97706" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Payments log table */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-stone-950 dark:text-stone-50">Audit Logs</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Historical details of payment transactions.
          </p>
        </div>

        <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="h-64 flex justify-center items-center">
              <RefreshCw size={24} className="animate-spin text-stone-400 dark:text-stone-600" />
            </div>
          ) : isError ? (
            <div className="h-64 flex justify-center items-center flex-col gap-2 p-6 text-center">
              <p className="text-sm font-medium text-rose-600">Failed to load payment logs from server.</p>
              <Button onClick={() => refetch()} variant="outline" className="border-stone-300">Retry Connection</Button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
              No payments recorded in the audit log.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                    <TableRow className="border-b border-stone-200 dark:border-stone-800">
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Transaction ID</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Order Number</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Customer</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Gateway</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Method</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Gateway Ref ID</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Status</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4 text-right">Captured</TableHead>
                      <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                    {items.map((payment) => (
                      <TableRow key={payment.id} className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                        <TableCell className="font-mono text-[10px] text-stone-500 dark:text-stone-400 py-4 max-w-[120px] truncate" title={payment.id}>
                          {payment.id}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-xs text-stone-900 dark:text-stone-50 py-4">
                          {payment.order?.orderNumber || "Unknown"}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <User size={12} className="text-stone-400 dark:text-stone-500" />
                            {payment.order?.fullname || "Unknown Customer"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="rounded-md border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900">
                            {payment.provider}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-300">
                          {getMethodIcon(payment.method)}
                          {payment.method}
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-stone-400 dark:text-stone-500 py-4">
                          <span className="block truncate max-w-[120px]" title={payment.razorpayPaymentId || undefined}>
                            P: {payment.razorpayPaymentId || "-"}
                          </span>
                          <span className="block truncate max-w-[120px]" title={payment.razorpayOrderId || undefined}>
                            O: {payment.razorpayOrderId || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-stone-950 dark:text-stone-50 py-4 text-xs">
                          ₹{parseFloat(payment.amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-stone-400 dark:text-stone-500" />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination controls inside the card */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                  <span className="text-xs text-stone-400 font-mono">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="h-8 w-8 rounded-md border-stone-200 dark:border-stone-800 disabled:opacity-35"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="h-8 w-8 rounded-md border-stone-200 dark:border-stone-800 disabled:opacity-35"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
