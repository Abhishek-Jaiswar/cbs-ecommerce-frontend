"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useGetOrdersQuery, Order } from "@/services/api/checkout-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

import { OrderAnalytics } from "./_components/OrderAnalytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lazy load order details sheet to split client JS bundle sizes
const OrderDetailsSheet = dynamic(
  () => import("./_components/OrderDetailsSheet").then((mod) => mod.OrderDetailsSheet),
  { ssr: false }
);

export default function AdminOrdersPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Fetch orders from API
  const {
    data: ordersRes,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetOrdersQuery({ page, limit });

  const ordersData = ordersRes?.data;
  const items = ordersData?.items ?? [];
  const totalPages = ordersData?.totalPages ?? 1;

  // Filter items client-side for search term and order status
  const filteredItems = items.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fullname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  // Status badge style mapping
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-850 rounded-md"
          >
            Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900 rounded-md"
          >
            Processing
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900 rounded-md"
          >
            Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 rounded-md"
          >
            Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-stone-50 text-stone-500 border-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800 rounded-md"
          >
            Cancelled
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800 rounded-md"
          >
            Failed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 rounded-md"
          >
            {status}
          </Badge>
        );
    }
  };

  // Payment status badge mapping
  const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-600 dark:bg-emerald-500 text-white dark:text-stone-950 rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-400">
            Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500 dark:bg-amber-500 text-white dark:text-stone-950 rounded-md hover:bg-amber-600 dark:hover:bg-amber-400">
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-600 dark:bg-rose-500 text-white dark:text-stone-950 rounded-md hover:bg-rose-700 dark:hover:bg-rose-400">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-stone-500 dark:bg-stone-500 text-white dark:text-stone-950 rounded-md">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Orders Management
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Track sales, update fulfillment status, and input shipping detail
            logs.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-auto shadow-md gap-2 border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-950 dark:text-stone-50 text-xs font-bold uppercase tracking-wider h-10 px-4 flex items-center justify-center bg-white dark:bg-stone-950 transition-colors"
        >
          <RefreshCw
            size={14}
            className={`${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Lists
        </Button>
      </div>

      {/* Analytics stats */}
      <OrderAnalytics items={items} />

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 rounded-lg shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-450 dark:text-stone-500"
          />
          <Input
            placeholder="Search by order ID, number, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-stone-450 dark:text-stone-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw
              size={24}
              className="animate-spin text-stone-400 dark:text-stone-600"
            />
          </div>
        ) : isError ? (
          <div className="h-64 flex justify-center items-center flex-col gap-2 p-6 text-center">
            <p className="text-sm font-medium text-rose-600">
              Failed to load orders list from server.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-stone-300"
            >
              Retry Connection
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No matching orders found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b border-stone-200 dark:border-stone-800">
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">
                      Order Number
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">
                      Date
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">
                      Customer
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">
                      Payment Status
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">
                      Fulfillment
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {filteredItems.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                    >
                      <TableCell className="font-mono font-bold text-xs text-stone-900 dark:text-stone-50 py-4">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-xs text-stone-500 dark:text-stone-400 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={12}
                            className="text-stone-400 dark:text-stone-500"
                          />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <User
                              size={12}
                              className="text-stone-400 dark:text-stone-500"
                            />
                            {order.fullname}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-light">
                            {order.phoneNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-stone-950 dark:text-stone-50 py-4 text-xs">
                        ₹{parseFloat(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenUpdateDialog(order)}
                          className="h-8 rounded-md border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#c29958] border-[#c29958]/20 hover:border-[#c29958] dark:text-[#c29958] text-xs font-semibold"
                        >
                          View Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls inside the Card */}
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

      {/* Update order status sheet */}
      <OrderDetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        order={selectedOrder}
        refetchOrders={refetch}
      />
    </div>
  );
}
