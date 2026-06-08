"use client";

import React from "react";
import { CreditCard, Truck } from "lucide-react";

interface PaymentSelectorProps {
  selectedProvider: "RAZORPAY" | "COD";
  onChange: (provider: "RAZORPAY" | "COD") => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedProvider,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
        Payment Method
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Razorpay Option */}
        <label
          className={`flex flex-col p-4 border rounded-none cursor-pointer transition-all ${
            selectedProvider === "RAZORPAY"
              ? "border-stone-950 bg-stone-50/50"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentProvider"
              value="RAZORPAY"
              checked={selectedProvider === "RAZORPAY"}
              onChange={() => onChange("RAZORPAY")}
              className="accent-stone-950 h-4 w-4"
            />
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-stone-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Online Payment
              </span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-stone-400 font-light leading-relaxed pl-7">
            Pay securely using UPI, Credit/Debit Cards, Netbanking, or Wallets via Razorpay.
          </p>
        </label>

        {/* COD Option */}
        <label
          className={`flex flex-col p-4 border rounded-none cursor-pointer transition-all ${
            selectedProvider === "COD"
              ? "border-stone-950 bg-stone-50/50"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentProvider"
              value="COD"
              checked={selectedProvider === "COD"}
              onChange={() => onChange("COD")}
              className="accent-stone-950 h-4 w-4"
            />
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-stone-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Cash On Delivery (COD)
              </span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-stone-400 font-light leading-relaxed pl-7">
            Pay with cash upon delivery of your products. No extra charges.
          </p>
        </label>
      </div>
    </div>
  );
};

export default PaymentSelector;
