"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/services/api/checkout-api";
import { Loader2, CheckCircle2, ShoppingBag, ArrowRight, Truck } from "lucide-react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: orderRes, isLoading, isError } = useGetOrderByIdQuery(orderId ?? "", {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="text-sm text-stone-500 italic">Retrieving order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !orderRes?.success || !orderRes?.data) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6 bg-white border border-stone-200 p-10 shadow-sm animate-fade-in">
          <div className="bg-rose-50 h-16 w-16 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-100">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 font-bold">
            Order Not Found
          </h2>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            We couldn&apos;t load the details for this order. It might still be processing or there was a system issue.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/shop"
              className="bg-stone-950 text-white font-bold py-4 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 text-center"
            >
              Back to Catalog
            </Link>
            <Link
              href="/"
              className="border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-bold py-4 text-xs uppercase tracking-widest transition-colors duration-200 text-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = orderRes.data;

  // Format delivery date (3-5 days from creation)
  const orderDate = new Date(order.createdAt);
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(orderDate.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(orderDate.getDate() + 5);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const formattedDelivery = `${deliveryStart.toLocaleDateString("en-US", options)} - ${deliveryEnd.toLocaleDateString("en-US", options)}, ${deliveryEnd.getFullYear()}`;

  return (
    <div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* SUCCESS CARD */}
        <div className="bg-white border border-stone-200 shadow-sm p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center bg-emerald-50 h-16 w-16 rounded-full border border-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif text-stone-900 font-medium">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              We&apos;ve received your order and are preparing it for delivery. A confirmation details update is available in your profile dashboard.
            </p>
          </div>
          
          <div className="inline-flex gap-8 border-y border-stone-100 py-4 w-full justify-center text-xs font-mono uppercase tracking-wider text-stone-600">
            <div>
              <span className="block text-[10px] text-stone-400 font-sans font-bold">Order Number</span>
              <span className="font-semibold text-stone-900">{order.orderNumber}</span>
            </div>
            <div className="border-l border-stone-200" />
            <div>
              <span className="block text-[10px] text-stone-400 font-sans font-bold">Payment Method</span>
              <span className="font-semibold text-stone-900">
                {order.payments?.[0]?.provider === "COD" ? "Cash On Delivery (COD)" : "Paid via Razorpay"}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Shipping Address */}
          <div className="bg-white border border-stone-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-150 pb-2 flex items-center gap-1.5">
              <Truck size={14} className="text-stone-500" />
              Delivery Information
            </h2>
            <div className="space-y-1.5 text-xs text-stone-700 leading-relaxed font-sans">
              <p className="font-bold text-stone-900">{order.fullname}</p>
              <p>{order.addressLine1}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              {order.landmark && <p>Landmark: {order.landmark}</p>}
              <p>{order.city}, {order.state} - {order.postalCode}</p>
              <p>{order.country}</p>
              <p className="text-stone-500 font-medium mt-3 block">Phone: {order.phoneNumber}</p>
            </div>

            <div className="border-t border-stone-100 pt-4 mt-4 text-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Estimated Delivery</span>
              <span className="font-semibold text-stone-900 bg-stone-50 px-2 py-1 border border-stone-150 inline-block">
                {formattedDelivery}
              </span>
            </div>
          </div>

          {/* Cost Summary & Actions */}
          <div className="bg-white border border-stone-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-150 pb-2">
              Receipt Summary
            </h2>
            
            {/* Items display */}
            <div className="max-h-[160px] overflow-y-auto divide-y divide-stone-50 pr-1 space-y-2.5">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs py-1.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-stone-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">QTY: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    ₹{parseFloat(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{parseFloat(order.subtotalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {parseFloat(order.shippingAmount) === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.2 border border-emerald-100">
                    Free
                  </span>
                ) : (
                  <span className="font-semibold text-stone-900">
                    ₹{parseFloat(order.shippingAmount).toFixed(2)}
                  </span>
                )}
              </div>
              {parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold">
                    -₹{parseFloat(order.discountAmount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-stone-100 pt-3 font-bold text-stone-900 text-sm">
                <span>Total Amount</span>
                <span>₹{parseFloat(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full bg-stone-950 text-white font-bold py-3.5 text-[11px] uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 text-center flex items-center justify-center gap-1.5"
              >
                Continue Shopping
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
            <p className="text-sm text-stone-500 italic">Loading page content...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
