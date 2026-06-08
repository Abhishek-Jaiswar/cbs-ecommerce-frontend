"use client";

import React, { useState } from "react";
import { useValidateCouponMutation } from "@/services/api/promotions/promotions-api";
import { Loader2, Tag, X } from "lucide-react";

interface CouponFieldProps {
  orderAmount: number;
  onCouponApplied: (couponCode: string, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon: string | null;
  discountAmount: number;
}

const CouponField: React.FC<CouponFieldProps> = ({
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
  discountAmount,
}) => {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!code.trim()) {
      setErrorMsg("Please enter a coupon code");
      return;
    }

    try {
      const res = await validateCoupon({
        code: code.trim().toUpperCase(),
        orderAmount,
      }).unwrap();

      if (res.success && res.data) {
        onCouponApplied(res.data.code, res.data.discountAmount);
        setCode("");
      } else {
        setErrorMsg(res.message || "Invalid coupon code");
      }
    } catch (err: unknown) {
      console.error("Coupon validation error:", err);
      const error = err as { data?: { message?: string } };
      setErrorMsg(error?.data?.message || "Invalid coupon or minimum amount not met");
    }
  };

  const handleRemove = () => {
    onCouponRemoved();
    setErrorMsg(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
        Promo Code / Gift Card
      </label>

      {appliedCoupon ? (
        <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/55 px-4 py-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold font-mono text-emerald-900">{appliedCoupon}</span>
              <span className="ml-1 text-[11px]">applied (saved ₹{discountAmount.toFixed(2)})</span>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-emerald-700 hover:text-emerald-950 p-0.5 rounded transition-colors"
            title="Remove coupon"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. WELCOME10"
            className="flex-1 border border-stone-200 px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white focus:border-stone-950 transition-all font-mono uppercase placeholder:font-sans placeholder:normal-case"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-stone-900 text-white font-semibold px-5 py-2.5 text-[11px] uppercase tracking-wider hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
          </button>
        </form>
      )}

      {errorMsg && (
        <p className="text-[10px] text-rose-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
};

export default CouponField;
