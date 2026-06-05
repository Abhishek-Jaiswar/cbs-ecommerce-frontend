"use client";

import * as React from "react";
import { useGetCouponRedemptionsQuery } from "@/services/api/promotions/promotions-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// Lightweight helper utilities for date formatting
const formatRedeemedDate = (dateString: string | Date) => {
  const d = new Date(dateString);
  const pad = (num: number) => num.toString().padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = pad(d.getDate());
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
};

export default function CouponRedemptionsPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  // Query
  const { data, isLoading, isError, refetch } = useGetCouponRedemptionsQuery({ page, limit });
  const redemptions = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Coupon Redemptions Log
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Track user conversion rates and review snapshots of all promotional codes used during store checkout sessions.
          </p>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Redemptions</span>
            <h3 className="text-2xl font-bold font-mono">{total}</h3>
          </div>
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-300">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching redemptions database...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve redemptions list. Verify the server is running.
            </p>
            <Button onClick={refetch} variant="outline" className="mt-4 gap-2">
              Try Reconnecting
            </Button>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                <TableRow className="border-b border-stone-200 dark:border-stone-800">
                  <TableHead>Customer</TableHead>
                  <TableHead>Promo Code Used</TableHead>
                  <TableHead>Discount Value</TableHead>
                  <TableHead>Discount Amount</TableHead>
                  <TableHead>Order Number</TableHead>
                  <TableHead className="w-[180px]">Redeemed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-stone-400">
                      No coupon redemptions logged yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  redemptions.map((r) => {
                    const redeemedDate = formatRedeemedDate(r.createdAt);
                    return (
                      <TableRow
                        key={r.id}
                        className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell>
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {r.user?.name || "Unknown User"}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {r.user?.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 px-2 py-0.5 rounded text-xs">
                            {r.codeSnapshot}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {r.discountType === "PERCENTAGE"
                            ? `${r.discountValue}%`
                            : `₹${r.discountValue}`}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          -₹{Number(r.discountAmount).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-stone-600 dark:text-stone-400">
                          {r.order?.orderNumber || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400">
                          {redeemedDate}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400 font-mono">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
