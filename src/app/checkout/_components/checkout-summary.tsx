"use client";

import React from "react";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import type { CartItem } from "@/services/api/cart/cart-api";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxCost: number;
  discountAmount: number;
  total: number;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  paymentProvider: "RAZORPAY" | "COD";
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  taxCost,
  discountAmount,
  total,
  isPlacingOrder,
  onPlaceOrder,
  paymentProvider,
}) => {
  return (
    <div className="bg-white border border-stone-200 shadow-sm p-6 space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
        Review Your Order
      </h2>

      {/* Cart Items List */}
      <div className="max-h-[280px] overflow-y-auto divide-y divide-stone-100 pr-1">
        {items.map((item) => {
          const product = item.variant.product;
          const imageSrc =
            product.images && product.images.length > 0
              ? product.images[0].media.url
              : "/placeholder-item.jpg";

          return (
            <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
              <div className="relative h-14 w-14 bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-stone-900 text-xs font-medium truncate">
                  {product.name}
                </h3>
                <p className="text-[10px] text-stone-400 font-mono">
                  QTY: {item.quantity}
                </p>
                <div className="flex flex-wrap gap-1 text-[9px] text-stone-500 font-semibold uppercase tracking-wider mt-0.5">
                  {item.variant.color && (
                    <span className="bg-stone-50 px-1 py-0.2 border border-stone-100">
                      Color: {item.variant.color.name}
                    </span>
                  )}
                  {item.variant.size && (
                    <span className="bg-stone-50 px-1 py-0.2 border border-stone-100">
                      Size: {item.variant.size.value}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-medium text-stone-900 text-xs">
                  ₹{(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Details */}
      <div className="space-y-3 text-xs text-stone-600 border-t border-stone-100 pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-stone-900">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Shipping</span>
          {shippingCost === 0 ? (
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 border border-emerald-100">
              Complimentary
            </span>
          ) : (
            <span className="font-semibold text-stone-900">
              ₹{shippingCost.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span className="font-semibold text-stone-900">
            ₹{taxCost.toFixed(2)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Coupon Discount</span>
            <span className="font-semibold">
              -₹{discountAmount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline">
        <span className="text-xs font-bold text-stone-900 uppercase">
          Total Amount
        </span>
        <span className="text-lg font-bold text-stone-900">
          ₹{total.toFixed(2)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
        className="w-full bg-stone-950 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 py-4 font-bold uppercase tracking-widest text-xs gap-2 transition-all duration-200 shadow-sm disabled:opacity-50 flex items-center justify-center"
      >
        {isPlacingOrder ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>Processing Order...</span>
          </>
        ) : paymentProvider === "RAZORPAY" ? (
          "Pay Now & Place Order"
        ) : (
          "Place COD Order"
        )}
      </button>

      {/* Terms and Security Badge */}
      <div className="space-y-3 pt-2 text-[10px] text-stone-400 text-center leading-relaxed">
        <p className="font-light">
          By placing your order, you agree to our Terms of Sale, Privacy Policy, and return terms.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-stone-500 font-medium uppercase tracking-wider text-[9px] border-t border-stone-50 pt-3">
          <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
          <span>100% Encrypted SSL Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
