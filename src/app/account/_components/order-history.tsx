"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "@/services/api/checkout-api";
import { Loader2, ShoppingBag, Truck, Calendar, Trash2, ShieldCheck, X } from "lucide-react";

const OrderHistory: React.FC = () => {
  const { data: ordersRes, isLoading, isError, refetch } = useGetMyOrdersQuery({
    page: 1,
    limit: 100,
  });
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();

  const [cancellationOrderId, setCancellationOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const orders = ordersRes?.data?.items ?? [];

  const handleCancelClick = (orderId: string) => {
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
        return "bg-amber-50 text-amber-800 border-amber-100";
      case "PROCESSING":
        return "bg-sky-50 text-sky-800 border-sky-100";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-800 border-indigo-100";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "CANCELLED":
        return "bg-rose-50 text-rose-800 border-rose-100";
      default:
        return "bg-stone-50 text-stone-800 border-stone-100";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif text-stone-900 font-medium">Order History</h2>
        <p className="text-xs text-stone-400 font-light mt-0.5">
          View shipping status, invoices, and cancellation options for your recent orders.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const placementDate = new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const isCancellable = order.status === "PENDING" || order.status === "PROCESSING";

          return (
            <div
              key={order.id}
              className="bg-white border border-stone-200 shadow-sm overflow-hidden"
            >
              {/* Order Header Summary */}
              <div className="bg-stone-50/70 border-b border-stone-150 px-6 py-4 flex flex-wrap gap-y-4 gap-x-8 justify-between items-center text-xs">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">
                      Order Number
                    </span>
                    <span className="font-semibold text-stone-800 font-mono">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">
                      Order Placed
                    </span>
                    <span className="font-semibold text-stone-800 flex items-center gap-1">
                      <Calendar size={12} className="text-stone-400" />
                      {placementDate}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 font-bold uppercase">
                      Total Amount
                    </span>
                    <span className="font-bold text-stone-900">
                      ₹{parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider select-none ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider select-none ${getStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
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
                      <h4 className="font-serif text-stone-900 text-xs font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono">QTY: {item.quantity}</p>
                      {item.sku && (
                        <p className="text-[9px] text-stone-400 font-mono">SKU: {item.sku}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-stone-900 text-xs">
                        ₹{parseFloat(item.totalPrice).toFixed(2)}
                      </span>
                      <span className="block text-[9px] text-stone-400">
                        ₹{parseFloat(item.unitPrice).toFixed(2)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="border-t border-stone-100 px-6 py-3 bg-stone-50/20 flex flex-wrap gap-4 items-center justify-between">
                <div className="text-xs text-stone-500 font-light flex items-center gap-1">
                  {order.trackingNumber ? (
                    <>
                      <Truck size={14} className="text-stone-400" />
                      <span>
                        Tracking Code: <strong className="font-mono text-stone-800">{order.trackingNumber}</strong>
                      </span>
                    </>
                  ) : (
                    <span>Awaiting shipment details...</span>
                  )}
                </div>

                {isCancellable && (
                  <button
                    onClick={() => handleCancelClick(order.id)}
                    className="border border-stone-200 hover:border-rose-600 hover:text-rose-600 font-bold px-3 py-1.5 text-[9px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1 bg-white text-stone-600"
                  >
                    <Trash2 size={12} />
                    Cancel Order
                  </button>
                )}
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

export default OrderHistory;
