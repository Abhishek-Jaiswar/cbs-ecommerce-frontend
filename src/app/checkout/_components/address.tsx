"use client";

import React from "react";

interface AddressProps {
  values: {
    fullname: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const Address: React.FC<AddressProps> = ({ values, onChange, errors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={values.fullname}
            onChange={(e) => onChange("fullname", e.target.value)}
            placeholder="e.g. John Doe"
            className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
              errors.fullname ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
            }`}
          />
          {errors.fullname && (
            <span className="text-[10px] text-rose-600 font-medium">{errors.fullname}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={values.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="e.g. 9876543210"
            className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
              errors.phoneNumber ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
            }`}
          />
          {errors.phoneNumber && (
            <span className="text-[10px] text-rose-600 font-medium">{errors.phoneNumber}</span>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Address Line 1 <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={values.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          placeholder="Flat, House no., Building, Company, Apartment"
          className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
            errors.addressLine1 ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
          }`}
        />
        {errors.addressLine1 && (
          <span className="text-[10px] text-rose-600 font-medium">{errors.addressLine1}</span>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={values.addressLine2}
          onChange={(e) => onChange("addressLine2", e.target.value)}
          placeholder="Area, Street, Sector, Village"
          className="w-full border border-stone-200 px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white focus:border-stone-950 transition-all"
        />
      </div>

      {/* Landmark */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Landmark (Optional)
        </label>
        <input
          type="text"
          value={values.landmark}
          onChange={(e) => onChange("landmark", e.target.value)}
          placeholder="e.g. Near Apollo Hospital"
          className="w-full border border-stone-200 px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white focus:border-stone-950 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="e.g. Mumbai"
            className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
              errors.city ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
            }`}
          />
          {errors.city && (
            <span className="text-[10px] text-rose-600 font-medium">{errors.city}</span>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            State <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={values.state}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="e.g. Maharashtra"
            className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
              errors.state ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
            }`}
          />
          {errors.state && (
            <span className="text-[10px] text-rose-600 font-medium">{errors.state}</span>
          )}
        </div>

        {/* Postal Code */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Postal Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={values.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            placeholder="6-digit PIN code"
            maxLength={6}
            className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
              errors.postalCode ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
            }`}
          />
          {errors.postalCode && (
            <span className="text-[10px] text-rose-600 font-medium">{errors.postalCode}</span>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Country <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={values.country}
          onChange={(e) => onChange("country", e.target.value)}
          placeholder="e.g. India"
          className={`w-full border px-4 py-3 rounded-none outline-none text-sm text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
            errors.country ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
          }`}
        />
        {errors.country && (
          <span className="text-[10px] text-rose-600 font-medium">{errors.country}</span>
        )}
      </div>
    </div>
  );
};

export default Address;