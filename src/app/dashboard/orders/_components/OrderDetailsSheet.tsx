"use client";

import * as React from "react";
import {
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  Order,
} from "@/services/api/checkout-api";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
  ExternalLink,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";
import { toast } from "sonner";

interface OrderDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  refetchOrders: () => void;
}

export const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  isOpen,
  onOpenChange,
  order,
  refetchOrders,
}) => {
  const [updateStatus, setUpdateStatus] = React.useState<string>("");
  const [trackingNumber, setTrackingNumber] = React.useState<string>("");

  // Fetch complete detailed order object
  const {
    data: orderDetailsRes,
    isLoading: isDetailsLoading,
    refetch: refetchDetails,
  } = useGetOrderByIdQuery(order?.id || "", { skip: !order?.id });

  const [updateOrderStatusMutation, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const [cancelOrderMutation, { isLoading: isCancelling }] =
    useCancelOrderMutation();

  const activeOrder = orderDetailsRes?.data || order;

  // Reset local state when active order changes
  React.useEffect(() => {
    if (activeOrder) {
      setUpdateStatus(activeOrder.status);
      setTrackingNumber(activeOrder.trackingNumber || "");
    }
  }, [activeOrder]);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = React.useState(false);
  const [isDownloadingLabel, setIsDownloadingLabel] = React.useState(false);

  const handleDownloadInvoice = async () => {
    if (!activeOrder) return;
    setIsDownloadingInvoice(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${activeOrder.id}/invoice`;
      const response = await fetch(url, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `invoice-${activeOrder.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Invoice PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice PDF");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const handleDownloadShippingLabel = async () => {
    if (!activeOrder) return;
    setIsDownloadingLabel(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${activeOrder.id}/shipping-label`;
      const response = await fetch(url, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to download shipping label");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `shipping-label-${activeOrder.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Shipping label PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download shipping label PDF");
    } finally {
      setIsDownloadingLabel(false);
    }
  };
  const handleUpdateStatus = async () => {
    if (!activeOrder) return;
    try {
      await updateOrderStatusMutation({
        orderId: activeOrder.id,
        status: updateStatus,
        trackingNumber: updateStatus === "SHIPPED" ? trackingNumber : undefined,
      }).unwrap();
      toast.success("Order status updated successfully");
      refetchOrders();
      refetchDetails();
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  const handleCancelOrder = async () => {
    if (!activeOrder) return;
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      try {
        await cancelOrderMutation(activeOrder.id).unwrap();
        toast.success("Order cancelled successfully");
        refetchOrders();
        refetchDetails();
      } catch (err) {
        console.error("Failed to cancel order", err);
        toast.error("Failed to cancel order");
      }
    }
  };

  // Status badge style mapping
  const getStatusBadge = (status: string) => {
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
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-600 dark:bg-emerald-500 text-white dark:text-stone-950 rounded-md">
            Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500 dark:bg-amber-500 text-white dark:text-stone-950 rounded-md">
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-600 dark:bg-rose-500 text-white dark:text-stone-950 rounded-md">
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

  if (isDetailsLoading && !activeOrder) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full !w-full sm:!max-w-5xl overflow-y-auto h-full max-h-screen p-4 sm:p-6 bg-white dark:bg-stone-950 font-[var(--font-zenvoraa)] border-stone-200 dark:border-stone-850 shadow-lg flex flex-col justify-between">
          <div className="space-y-6">
            <SheetHeader className="pb-4 border-b">
              <div className="h-6 w-48 bg-stone-200 dark:bg-stone-800 animate-pulse rounded" />
              <div className="h-4 w-64 bg-stone-100 dark:bg-stone-900 animate-pulse rounded mt-2" />
            </SheetHeader>
            <div className="h-20 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-32 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
                <div className="h-32 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
                <div className="h-24 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!activeOrder) return null;

  const paymentInfo = activeOrder.payments?.[0];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full !w-full sm:!max-w-5xl overflow-y-auto h-full max-h-screen p-4 sm:p-6 bg-white dark:bg-stone-950 font-[var(--font-zenvoraa)] border-stone-200 dark:border-stone-850 shadow-lg flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <SheetTitle className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <FileText className="text-[#c29958]" size={20} />
                  Order Details
                </SheetTitle>
                <SheetDescription className="text-xs text-stone-400 mt-1">
                  Reference: {activeOrder.orderNumber} | Placed on{" "}
                  {new Date(activeOrder.createdAt).toLocaleDateString()} at{" "}
                  {new Date(activeOrder.createdAt).toLocaleTimeString()}
                </SheetDescription>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(activeOrder.status)}
                {getPaymentStatusBadge(activeOrder.paymentStatus)}
              </div>
            </div>
          </SheetHeader>

          <div className="pt-6">
            <OrderTrackingTimeline status={activeOrder.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Order Items Summary
                </span>
                {isDetailsLoading ? (
                  <div className="space-y-2">
                    <div className="h-16 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
                    <div className="h-16 bg-stone-100 dark:bg-stone-900 animate-pulse rounded" />
                  </div>
                ) : activeOrder.orderItems?.length ? (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {activeOrder.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 border border-stone-100 dark:border-stone-850 rounded-md bg-stone-50/55 dark:bg-stone-900/10 items-center hover:border-[#c29958]/35 transition-colors"
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
                          {item.productId ? (
                            <a
                              href={`/dashboard/products/${item.productId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate block hover:underline hover:text-[#c29958] flex items-center gap-1"
                            >
                              {item.name}
                              <ExternalLink size={10} className="inline opacity-60" />
                            </a>
                          ) : (
                            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate">
                              {item.name}
                            </h4>
                          )}
                          <div className="text-[10px] text-stone-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>{item.sku ? `SKU: ${item.sku} | ` : ""}Qty: {item.quantity} x ₹{parseFloat(item.unitPrice).toFixed(2)}</span>
                            {item.appliedOfferName && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.2 border border-amber-100/60 rounded-sm">
                                {item.appliedOfferName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-[#c29958] shrink-0">
                          ₹{parseFloat(item.totalPrice).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 italic p-4 border border-dashed rounded-md text-center bg-stone-50/10">
                    No items available for this order.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Billing Details
                </span>
                <div className="p-4 border border-stone-150 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 rounded-md space-y-3">
                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{parseFloat(activeOrder.subtotalAmount).toFixed(2)}</span>
                    </div>
                    {parseFloat(activeOrder.discountAmount) > 0 && (
                      <div className="flex justify-between text-rose-500 font-semibold">
                        <span>Discount</span>
                        <span>-₹{parseFloat(activeOrder.discountAmount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {parseFloat(activeOrder.shippingAmount) === 0
                          ? "Free"
                          : `₹${parseFloat(activeOrder.shippingAmount).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{parseFloat(activeOrder.taxAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-stone-900 dark:text-stone-50 border-t pt-2 mt-1">
                      <span>Total Paid</span>
                      <span className="text-[#c29958] text-base">
                        ₹{parseFloat(activeOrder.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Payment & Transaction Details
                </span>
                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/10 text-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Method</span>
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                        <CreditCard size={14} className="text-[#c29958]" />
                        {paymentInfo ? (
                          <>
                            {paymentInfo.provider === "RAZORPAY"
                              ? "Razorpay Online Secure"
                              : "Cash on Delivery (COD)"}
                            {paymentInfo.method ? ` - ${paymentInfo.method.toUpperCase()}` : ""}
                          </>
                        ) : (
                          "Cash on Delivery"
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Payment Status</span>
                      <div className="flex items-center gap-2">
                        {paymentInfo?.status ? (
                          <Badge variant="outline" className="font-semibold px-2 py-0.5 rounded text-[10px]">
                            {paymentInfo.status}
                          </Badge>
                        ) : (
                          getPaymentStatusBadge(activeOrder.paymentStatus)
                        )}
                      </div>
                    </div>
                  </div>

                  {paymentInfo && paymentInfo.provider === "RAZORPAY" && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-850 space-y-2 text-[11px]">
                      {paymentInfo.razorpayPaymentId && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Razorpay Payment ID:</span>
                          <span className="font-bold text-stone-850 dark:text-stone-200">
                            {paymentInfo.razorpayPaymentId}
                          </span>
                        </div>
                      )}
                      {paymentInfo.razorpayOrderId && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Razorpay Order ID:</span>
                          <span className="font-bold text-stone-850 dark:text-stone-200">
                            {paymentInfo.razorpayOrderId}
                          </span>
                        </div>
                      )}
                      {paymentInfo.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Paid At:</span>
                          <span className="font-bold text-stone-850 dark:text-stone-200">
                            {new Date(paymentInfo.paidAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Shipping Information
                </span>
                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/10 text-xs space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-500 dark:text-stone-400">Recipient:</span>{" "}
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {activeOrder.fullname}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-500 dark:text-stone-400">Phone:</span>{" "}
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {activeOrder.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-500 dark:text-stone-400">Address:</span>{" "}
                      <span className="text-stone-800 dark:text-stone-200 font-medium block mt-0.5">
                        {activeOrder.addressLine1}
                        {activeOrder.addressLine2 ? `, ${activeOrder.addressLine2}` : ""}
                        {activeOrder.landmark ? ` (Landmark: ${activeOrder.landmark})` : ""}
                        <br />
                        {activeOrder.city}, {activeOrder.state} - {activeOrder.postalCode}
                        <br />
                        {activeOrder.country}
                      </span>
                    </div>
                  </div>
                  {activeOrder.trackingNumber && (
                    <div className="pt-2 border-t mt-2 flex items-center gap-1.5">
                      <Truck size={12} className="text-stone-400" />
                      <span className="font-bold text-stone-500 dark:text-stone-400">
                        Tracking Number:
                      </span>{" "}
                      <span className="bg-stone-100 dark:bg-stone-850 px-1.5 py-0.5 rounded text-[10px] text-stone-700 dark:text-stone-300">
                        {activeOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Order Documents
                </span>
                <div className="p-4 border rounded-md bg-stone-50/20 dark:bg-stone-900/10 text-xs space-y-2.5">
                  <Button
                    variant="outline"
                    disabled={isDownloadingInvoice}
                    onClick={handleDownloadInvoice}
                    className="w-full border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs h-9 rounded-none font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {isDownloadingInvoice ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Generating Invoice...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={12} />
                        <span>Download Invoice</span>
                      </>
                    )}
                  </Button>

                  {activeOrder.status !== "CANCELLED" && activeOrder.status !== "FAILED" && (
                    <Button
                      variant="outline"
                      disabled={isDownloadingLabel}
                      onClick={handleDownloadShippingLabel}
                      className="w-full border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs h-9 rounded-none font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {isDownloadingLabel ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Generating Label...</span>
                        </>
                      ) : (
                        <>
                          <Truck size={12} />
                          <span>Download Shipping Label</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {activeOrder.status !== "DELIVERED" && (
                <div className="bg-stone-50 dark:bg-stone-900/40 p-4 border border-stone-150 dark:border-stone-800 rounded-md space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-450 dark:text-stone-400 block border-b pb-1 flex items-center gap-1.5">
                    Admin Action Center
                  </label>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        Update Fulfillment Status
                      </span>
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
                    </div>

                    {updateStatus === "SHIPPED" && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                          <Truck size={12} className="text-stone-450" />
                          Carrier Tracking Number
                        </span>
                        <Input
                          placeholder="e.g. ZVFD-9854721"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-[#c29958] rounded-none"
                        />
                      </div>
                    )}

                    <Button
                      disabled={isUpdating}
                      onClick={handleUpdateStatus}
                      className="w-full bg-stone-950 hover:bg-[#c29958] text-white dark:bg-[#c29958] dark:text-stone-950 dark:hover:bg-[#b0884b] text-xs h-9 rounded-none font-bold transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                      {isUpdating ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Saving Status...
                        </>
                      ) : (
                        "Apply Status"
                      )}
                    </Button>

                    {activeOrder.status !== "CANCELLED" &&
                      activeOrder.status !== "FAILED" && (
                        <Button
                          variant="outline"
                          disabled={isCancelling}
                          onClick={handleCancelOrder}
                          className="w-full border-rose-200 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20 text-rose-600 text-xs h-9 rounded-none font-bold transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                          <Trash2 size={12} />
                          {isCancelling ? "Cancelling..." : "Cancel Order"}
                        </Button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs rounded-none hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Close Pane
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

OrderDetailsSheet.displayName = "OrderDetailsSheet";
