"use client";

import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  Order,
} from "@/services/api/checkout-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Truck,
  Calendar,
  DollarSign,
  User,
  ShoppingBag,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const OrderTrackingTimeline = ({ status }: { status: string }) => {
  const steps = [
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
  ];

  const isCancelled = status === "CANCELLED";
  const isFailed = status === "FAILED";

  if (isCancelled || isFailed) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 mb-6">
        <AlertCircle size={16} />
        This order was {status === "CANCELLED" ? "Cancelled" : "Failed"}.
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.value === status);

  return (
    <div className="mb-6 pt-2 pb-4 border-b">
      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-4">
        Fulfillment Timeline
      </div>
      <div className="flex items-center justify-between relative w-full px-2">
        {/* Progress bar line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-stone-850 z-0" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#c29958] transition-all duration-300 z-0"
          style={{
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100 - 8)}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div
              key={step.value}
              className="flex flex-col items-center z-10 relative"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all border",
                  isCompleted
                    ? "bg-[#c29958] text-white border-[#c29958] shadow-[0_0_8px_rgba(194,153,88,0.4)]"
                    : "bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800",
                )}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 font-semibold transition-colors",
                  isActive
                    ? "text-[#c29958]"
                    : isCompleted
                      ? "text-stone-700 dark:text-stone-300"
                      : "text-stone-400",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch orders from API
  const {
    data: ordersRes,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetOrdersQuery({ page, limit });

  // Update status mutation
  const [updateOrderStatusMutation, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

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
    setUpdateStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setIsSheetOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatusMutation({
        orderId: selectedOrder.id,
        status: updateStatus,
        trackingNumber: updateStatus === "SHIPPED" ? trackingNumber : undefined,
      }).unwrap();
      setIsSheetOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (err) {
      console.error("Failed to update status", err);
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Orders
              </span>
              <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
                {items.length}
              </p>
            </div>
            <div className="h-10 w-10 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Pending Processing
              </span>
              <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
                {
                  items.filter(
                    (o) => o.status === "PENDING" || o.status === "PROCESSING",
                  ).length
                }
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-550/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Delivered Total
              </span>
              <p className="text-3xl text-emerald-600 dark:text-emerald-400 font-extrabold">
                {items.filter((o) => o.status === "DELIVERED").length}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
              <Truck size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Gross Revenue
              </span>
              <p className="text-3xl text-stone-955 dark:text-stone-50 font-extrabold">
                ₹
                {items
                  .filter((o) => o.paymentStatus === "PAID")
                  .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

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
                          className="h-8 rounded-md border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-950 dark:text-stone-50 text-xs font-medium"
                        >
                          Update Status
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto max-h-screen p-6 bg-white dark:bg-stone-950 font-[var(--font-corano)] border-stone-200 dark:border-stone-850 shadow-lg flex flex-col justify-between">
          <div>
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Order Details
              </SheetTitle>
              <SheetDescription className="text-xs text-stone-400 font-mono mt-1">
                Reference: {selectedOrder?.orderNumber} | Placed on{" "}
                {selectedOrder &&
                  new Date(selectedOrder.createdAt).toLocaleDateString()}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* 1. Product Identity (Items list at the top) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Order Items
                </span>
                {selectedOrder?.orderItems?.length ? (
                  selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border border-stone-100 dark:border-stone-800 rounded-md bg-stone-50/50 dark:bg-stone-900/10 items-center"
                    >
                      <div className="relative w-12 h-12 overflow-hidden bg-stone-100 dark:bg-stone-900 rounded shrink-0 border border-stone-200 dark:border-stone-800">
                        <img
                          src={
                            item.image || "/corano/banner/img1-static-menu.jpg"
                          }
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate">
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {item.sku ? `SKU: ${item.sku} | ` : ""}Qty:{" "}
                          {item.quantity}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[#c29958] shrink-0">
                        ₹{parseFloat(item.totalPrice).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-stone-500 italic">
                    No items available for this order.
                  </div>
                )}
              </div>

              {/* 2. Status Selector & Action */}
              <div className="bg-stone-50 dark:bg-stone-900/40 p-4 border border-stone-150 dark:border-stone-800 rounded-md space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-455 dark:text-stone-400 block">
                  Update Order Status
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={updateStatus} onValueChange={setUpdateStatus}>
                    <SelectTrigger className="w-full bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs rounded-none">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs">
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={isUpdating}
                    onClick={handleUpdateStatus}
                    className="bg-stone-950 hover:bg-[#c29958] text-white dark:bg-[#c29958] dark:text-stone-950 dark:hover:bg-[#b0884b] text-xs px-5 rounded-none font-bold shrink-0 transition-colors"
                  >
                    {isUpdating ? "Saving..." : "Update Status"}
                  </Button>
                </div>

                {updateStatus === "SHIPPED" && (
                  <div className="space-y-1.5 pt-3 border-t border-stone-200/60 dark:border-stone-800">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Truck size={12} className="text-stone-400" />
                      Carrier Tracking Number
                    </label>
                    <Input
                      placeholder="e.g. ZVFD-9854721"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-[#c29958] rounded-none"
                    />
                  </div>
                )}
              </div>

              {/* 3. Stepper timeline */}
              {selectedOrder && (
                <OrderTrackingTimeline status={selectedOrder.status} />
              )}

              {/* 4. Financial Summary */}
              <div className="space-y-2 border-b pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Billing Details
                </span>
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      ₹
                      {selectedOrder &&
                        parseFloat(selectedOrder.subtotalAmount).toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder &&
                    parseFloat(selectedOrder.discountAmount) > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>Discount</span>
                        <span>
                          -₹
                          {parseFloat(selectedOrder.discountAmount).toFixed(2)}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {selectedOrder &&
                      parseFloat(selectedOrder.shippingAmount) === 0
                        ? "Free"
                        : `₹${parseFloat(selectedOrder?.shippingAmount || "0").toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>
                      ₹
                      {selectedOrder &&
                        parseFloat(selectedOrder.taxAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 dark:text-stone-50 border-t pt-2 mt-1">
                    <span>Total Paid</span>
                    <span className="text-[#c29958]">
                      ₹
                      {selectedOrder &&
                        parseFloat(selectedOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Shipping Details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Shipping Information
                </span>
                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/10 text-xs space-y-2 leading-relaxed">
                  <div>
                    <span className="font-bold text-stone-500 dark:text-stone-400">
                      Recipient:
                    </span>{" "}
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {selectedOrder?.fullname}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 dark:text-stone-400">
                      Phone:
                    </span>{" "}
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {selectedOrder?.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 dark:text-stone-400">
                      Address:
                    </span>{" "}
                    <span className="text-stone-800 dark:text-stone-200">
                      {selectedOrder?.addressLine1}
                      {selectedOrder?.addressLine2
                        ? `, ${selectedOrder.addressLine2}`
                        : ""}
                      {selectedOrder?.landmark
                        ? ` (Landmark: ${selectedOrder.landmark})`
                        : ""}
                      <br />
                      {selectedOrder?.city}, {selectedOrder?.state} -{" "}
                      {selectedOrder?.postalCode}
                      <br />
                      {selectedOrder?.country}
                    </span>
                  </div>
                  {selectedOrder?.trackingNumber && (
                    <div className="pt-2 border-t mt-2 flex items-center gap-1.5">
                      <Truck size={12} className="text-stone-400" />
                      <span className="font-bold text-stone-500 dark:text-stone-400">
                        Tracking Number:
                      </span>{" "}
                      <span className="font-mono bg-stone-100 dark:bg-stone-850 px-1.5 py-0.5 rounded text-[10px] text-stone-700 dark:text-stone-300">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              className="w-full text-xs rounded-none"
            >
              Close Pane
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
