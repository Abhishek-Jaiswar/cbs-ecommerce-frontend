"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "@/services/api/checkout-api";
import { Loader2, ShoppingBag, Truck, Calendar, Trash2, X, CreditCard, ChevronDown, ChevronUp, Check, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const OrderHistory: React.FC = () => {
  const { data: ordersRes, isLoading, isError, refetch } = useGetMyOrdersQuery({
    page: 1,
    limit: 100,
  });
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();

  const [cancellationOrderId, setCancellationOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State to track expanded orders for detailed timeline/billing view
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  const handleDownloadInvoice = async (orderId: string, orderNumber: string) => {
    setDownloadingOrderId(orderId);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice`;
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
      link.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to download invoice PDF. Please try again.");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const orders = ordersRes?.data?.items ?? [];

  const handleCancelClick = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion
    setCancellationOrderId(orderId);
    setErrorMsg(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancellationOrderId) return;
    setErrorMsg(null);

    try {
      const res = await cancelOrder(cancellationOrderId).unwrap();
      if (res.success) {
        setCancellationOrderId(null);
      } else {
        setErrorMsg(res.message || "Failed to cancel order.");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrorMsg(error?.data?.message || "An error occurred while canceling this order.");
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
          <p className="text-xs text-stone-500 italic">Retrieving order history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center space-y-4 max-w-sm mx-auto bg-white border border-stone-200 p-8 shadow-sm">
        <p className="text-xs text-stone-500 leading-relaxed">
          There was an issue fetching your orders. Please check your connection or reload the page.
        </p>
        <button
          onClick={refetch}
          className="border border-stone-200 hover:border-stone-950 font-bold px-4 py-2 text-[10px] uppercase tracking-wider transition-colors duration-200"
        >
          Retry Load
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-serif text-stone-900 font-medium">Order History</h2>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            You have not placed any orders yet.
          </p>
        </div>

        <div className="bg-white border border-stone-200 p-10 text-center space-y-5 max-w-md mx-auto shadow-sm">
          <div className="h-12 w-12 bg-stone-50 flex items-center justify-center text-stone-400 mx-auto border border-stone-100">
            <ShoppingBag size={20} />
          </div>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Curate your look with our masterfully crafted luxury designs. Let&apos;s get you started.
          </p>
          <Link
            href="/shop"
            className="w-full bg-stone-950 text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 text-center block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-205";
      case "PROCESSING":
        return "bg-blue-50 text-blue-800 border-blue-250";
      case "SHIPPED":
        return "bg-purple-50 text-purple-800 border-purple-250";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border-emerald-250";
      case "CANCELLED":
        return "bg-stone-50 text-stone-500 border-stone-200";
      default:
        return "bg-stone-50 text-stone-800 border-stone-100";
    }
  };

  const getTimelineIndex = (status: string) => {
    switch (status) {
      case "PENDING": return 0;
      case "PROCESSING": return 1;
      case "SHIPPED": return 2;
      case "DELIVERED": return 3;
      default: return -1;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif text-stone-900 font-medium">Order History</h2>
        <p className="text-xs text-stone-400 font-light mt-0.5">
          View shipping status, interactive delivery timelines, and financial breakdown details.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const placementDate = new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const isCancellable = order.status === "PENDING" || order.status === "PROCESSING";
          const isExpanded = expandedOrderId === order.id;
          const timelineIndex = getTimelineIndex(order.status);
          const isOrderCancelled = order.status === "CANCELLED";

          return (
            <div
              key={order.id}
              className="bg-white border border-stone-200 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Order Header Summary */}
              <div 
                onClick={() => toggleExpandOrder(order.id)}
                className="bg-stone-50/70 border-b border-stone-150 px-6 py-4 flex flex-wrap gap-y-4 gap-x-8 justify-between items-center text-xs cursor-pointer hover:bg-stone-50/90 select-none"
              >
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      Order Number
                    </span>
                    <span className="font-semibold text-stone-800">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      Order Placed
                    </span>
                    <span className="font-semibold text-stone-800 flex items-center gap-1">
                      <Calendar size={12} className="text-stone-400" />
                      {placementDate}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      Total Amount
                    </span>
                    <span className="font-bold text-stone-905">
                      ₹{parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider rounded-none ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                    <Badge variant="outline" className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider rounded-none ${getStatusColor(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="text-stone-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-stone-100 px-6 py-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 items-center">
                    <div className="relative h-14 w-14 bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                      <Image
                        src={item.image || "/placeholder-item.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.productId ? (
                        <Link
                          href={`/shop/${item.productId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif text-stone-900 text-xs font-semibold truncate hover:underline hover:text-[#c29958] flex items-center gap-1"
                        >
                          {item.name}
                          <ExternalLink size={10} className="opacity-50" />
                        </Link>
                      ) : (
                        <h4 className="font-serif text-stone-900 text-xs font-semibold truncate">
                          {item.name}
                        </h4>
                      )}
                      <div className="flex flex-wrap gap-2 items-center mt-1">
                        <p className="text-[10px] text-stone-400">QTY: {item.quantity}</p>
                        {(item as any).appliedOfferName && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.2 border border-amber-100/60 rounded-sm">
                            {(item as any).appliedOfferName}
                          </span>
                        )}
                      </div>
                      {item.sku && (
                        <p className="text-[9px] text-stone-400">SKU: {item.sku}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-stone-900 text-xs">
                        ₹{parseFloat(item.totalPrice).toFixed(2)}
                      </span>
                      <span className="block text-[9px] text-stone-400 mt-0.5">
                        ₹{parseFloat(item.unitPrice).toFixed(2)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Collapsible expanded timeline and billing details */}
              {isExpanded && (
                <div className="bg-stone-50/20 border-t border-stone-100 px-6 py-6 space-y-6">
                  {/* Visual Stepper Timeline */}
                  {!isOrderCancelled && timelineIndex >= 0 ? (
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block border-b pb-1">
                        Fulfillment Tracking Timeline
                      </span>
                      <div className="bg-white border p-6">
                        <div className="flex items-center justify-between relative w-full px-4">
                          <div className="absolute left-[36px] right-[36px] top-1/2 -translate-y-1/2 h-0.5 bg-stone-100 z-0">
                            <div
                              className="h-full bg-[#c29958] transition-all duration-300"
                              style={{ width: `${(timelineIndex / 3) * 100}%` }}
                            />
                          </div>
                          {[
                            { label: "Order Placed", desc: "Awaiting confirmation" },
                            { label: "Processing", desc: "Preparing your items" },
                            { label: "Shipped", desc: "In transit with carrier" },
                            { label: "Delivered", desc: "Package handed over" }
                          ].map((step, idx) => {
                            const done = idx <= timelineIndex;
                            const active = idx === timelineIndex;
                            return (
                              <div key={idx} className="flex flex-col items-center z-10 relative">
                                <div
                                  className={`h-6 w-6 rounded-full flex items-center justify-center border text-[9px] transition-all ${
                                    done
                                      ? "bg-[#c29958] border-[#c29958] text-white shadow-[0_0_6px_rgba(194,153,88,0.3)]"
                                      : "bg-white border-stone-200 text-stone-400"
                                  }`}
                                >
                                  {done ? <Check size={10} /> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${active ? "text-[#c29958]" : done ? "text-stone-700" : "text-stone-400"}`}>
                                  {step.label}
                                </span>
                                <span className="text-[8px] text-stone-400 text-center max-w-[80px] hidden sm:block font-light mt-0.5">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : isOrderCancelled ? (
                    <div className="p-4 border border-rose-100 bg-rose-50/40 text-rose-800 text-xs font-semibold flex items-center gap-1.5">
                      ⚠️ This order was cancelled and cannot be tracked further.
                    </div>
                  ) : null}

                  {/* Financial Breakdown & Address details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Delivery & Payment details */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block border-b pb-1">
                          Delivery Address
                        </span>
                        <div className="p-4 border bg-white space-y-1 text-stone-600 leading-relaxed">
                          <p className="font-bold text-stone-900">{order.fullname}</p>
                          <p>{order.phoneNumber}</p>
                          <p>
                            {order.addressLine1}
                            {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                            {order.landmark ? ` (Landmark: ${order.landmark})` : ""}
                            <br />
                            {order.city}, {order.state} - {order.postalCode}
                            <br />
                            {order.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Billing breakdown */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block border-b pb-1">
                        Financial Statement
                      </span>
                      <div className="p-4 border bg-white space-y-2 text-stone-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{parseFloat(order.subtotalAmount).toFixed(2)}</span>
                        </div>
                        {parseFloat(order.discountAmount) > 0 && (
                          <div className="flex justify-between text-rose-500 font-semibold">
                            <span>Discount Applied</span>
                            <span>-₹{parseFloat(order.discountAmount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping Fees</span>
                          <span>
                            {parseFloat(order.shippingAmount) === 0
                              ? "Free"
                              : `₹${parseFloat(order.shippingAmount).toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes</span>
                          <span>₹{parseFloat(order.taxAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-stone-900 border-t pt-2 mt-1">
                          <span>Total Paid</span>
                          <span className="text-[#c29958] text-sm">
                            ₹{parseFloat(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Footer Actions */}
              <div className="border-t border-stone-100 px-6 py-3 bg-stone-50/20 flex flex-wrap gap-4 items-center justify-between text-xs">
                <div className="text-stone-500 font-light flex items-center gap-1.5">
                  {order.trackingNumber ? (
                    <>
                      <Truck size={14} className="text-[#c29958]" />
                      <span>
                        Tracking Code: <strong className="font-semibold text-stone-800">{order.trackingNumber}</strong>
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-stone-400">
                      <ClockSpinner size={12} />
                      Awaiting shipment dispatch details...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadInvoice(order.id, order.orderNumber);
                    }}
                    disabled={downloadingOrderId === order.id}
                    className="border border-stone-200 hover:border-[#c29958] hover:text-[#c29958] font-bold px-3 py-1.5 text-[9px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1 bg-white text-stone-600 shadow-sm disabled:opacity-50"
                  >
                    {downloadingOrderId === order.id ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-[#c29958]" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={12} />
                        <span>Download Invoice</span>
                      </>
                    )}
                  </button>
                  {isCancellable && (
                    <button
                      onClick={(e) => handleCancelClick(order.id, e)}
                      className="border border-stone-200 hover:border-rose-600 hover:text-rose-600 font-bold px-3 py-1.5 text-[9px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1 bg-white text-stone-600 shadow-sm"
                    >
                      <Trash2 size={12} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CANCELLATION MODAL */}
      {cancellationOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white border border-stone-200 shadow-md p-6 relative">
            <button
              onClick={() => setCancellationOrderId(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
              title="Close modal"
              type="button"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3 mb-4">
              Cancel Order
            </h3>

            {errorMsg && (
              <div className="p-3 text-[11px] font-semibold mb-4 bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-1">
                <span className="shrink-0">⚠️</span>
                <p>{errorMsg}</p>
              </div>
            )}

            <p className="text-xs text-stone-500 leading-relaxed mb-6 font-light">
              Are you sure you want to cancel this order? This action will restore product quantities in inventory, but cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setCancellationOrderId(null)}
                disabled={isCanceling}
                className="flex-1 border border-stone-200 hover:border-stone-950 font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 bg-white text-stone-700"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isCanceling ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Canceling...</span>
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper spin loader
const ClockSpinner: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <span className="inline-block animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" style={{ width: size, height: size }} />
);

export default OrderHistory;
