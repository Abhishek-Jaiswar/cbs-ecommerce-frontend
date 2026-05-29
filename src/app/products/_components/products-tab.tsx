"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "./product-types";

type ProductTabsProps = {
  product: Product;
};

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(5);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "information", label: "Information" },
    { id: "reviews", label: `Reviews (${product.reviews.length})` },
  ];

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      {/* Tab Headers */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors duration-150 border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-[#c8a96e] text-[#c8a96e]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description Tab */}
      {activeTab === "description" && (
        <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
          {product.longDescription}
        </p>
      )}

      {/* Information Tab */}
      {activeTab === "information" && (
        <div className="max-w-sm">
          <table className="w-full border border-gray-200 text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50 w-1/3">
                  Color
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {product.information.colors.join(", ")}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
                  Size
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {product.information.sizes.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="flex flex-col gap-8">
          {/* Existing Reviews */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-gray-700">
              {product.reviews.length} review for{" "}
              <span className="text-[#c8a96e]">{product.name}</span>
            </h3>
            {product.reviews.map((review) => (
              <div key={review.id} className="flex gap-4">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating
                            ? "text-[#c8a96e]"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium text-gray-600">
                      {review.author}
                    </span>{" "}
                    - {review.date}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="border-t border-gray-100 pt-6 flex flex-col gap-4 max-w-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
              Write a Review
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                <span className="text-red-400">*</span> Your Name
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c8a96e] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                <span className="text-red-400">*</span> Your Email
              </label>
              <input
                type="email"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c8a96e] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                <span className="text-red-400">*</span> Your Review
              </label>
              <textarea
                rows={4}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c8a96e] transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                <span className="text-red-400">*</span> Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className={`w-7 h-7 transition-colors ${
                      s <= rating ? "text-[#c8a96e]" : "text-gray-300"
                    }`}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <button className="self-start bg-[#c8a96e] hover:bg-[#b5943d] text-white text-sm font-semibold uppercase tracking-widest px-8 py-3 rounded transition-colors duration-200">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
