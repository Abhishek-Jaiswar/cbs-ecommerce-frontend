"use client";

import { useState } from "react";
import type { Product } from "./product-types";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].hex);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Brand */}
      <p className="text-sm text-[#c8a96e] font-medium uppercase tracking-widest">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1 className="text-2xl font-semibold text-gray-800 leading-snug">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-4 h-4 text-[#c8a96e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-400">
          ({product.reviewCount} Review)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <span className="bg-[#c8a96e] text-white text-xs font-semibold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {product.stock} in stock
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
        {product.description}
      </p>

      {/* Size */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
          Size
        </p>
        <div className="flex gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-10 h-10 rounded border text-sm font-medium transition-colors duration-150 ${
                selectedSize === size
                  ? "border-[#c8a96e] bg-[#c8a96e] text-white"
                  : "border-gray-300 text-gray-600 hover:border-[#c8a96e]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
          Color
        </p>
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.hex)}
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
                selectedColor === color.hex
                  ? "border-gray-800 scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-medium text-gray-800">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button className="flex-1 bg-[#c8a96e] hover:bg-[#b5943d] text-white text-sm font-semibold uppercase tracking-widest py-3 rounded transition-colors duration-200">
          Add to Cart
        </button>
      </div>

      {/* Wishlist / Compare */}
      <div className="flex gap-5 text-sm text-gray-500 pt-1">
        <button className="flex items-center gap-1.5 hover:text-[#c8a96e] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Wishlist
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#c8a96e] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Compare
        </button>
      </div>
    </div>
  );
}
