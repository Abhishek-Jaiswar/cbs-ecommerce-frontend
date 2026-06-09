"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useToggleWishlistItemMutation } from "@/services/api/wishlist/wishlist-api";
import { getProductImage } from "@/lib/utils";
import type { ShopProduct, ShopViewMode } from "./shop-types";

type ShopProductCardProps = {
  product: ShopProduct;
  viewMode: ShopViewMode;
};

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return price;

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

export function ShopProductCard({ product, viewMode }: ShopProductCardProps) {
  const productImage = getProductImage(product.slug);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : 0;
  const price = Number(product.price);
  const discount =
    originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const [toggleWishlist, { isLoading }] = useToggleWishlistItemMutation();
  const rating = "4.8"; // Default premium rating fallback

  if (viewMode === "list") {
    return (
      <article className="group grid gap-8 border-b border-stone-100 pb-8 font-[var(--font-corano)] md:grid-cols-[240px_1fr] bg-transparent">
        <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#fbfaf8]">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 240px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-center text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c29958]">
            Zenvoraa
          </p>
          <h3 className="mt-2 text-xl font-serif font-medium text-stone-850 leading-snug transition-colors duration-300 group-hover:text-[#c29958]">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>
          
          <div className="mt-2.5 flex items-center gap-3 text-xs text-stone-400 font-mono uppercase tracking-wider">
            <div className="flex items-center gap-1 text-[#c29958]">
              <Star className="h-3 w-3 fill-current stroke-current" />
              <span className="font-bold text-stone-500">{rating}</span>
            </div>
            <span>•</span>
            <span>SKU: {product.id.substring(0, 8).toUpperCase()}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-lg font-bold text-stone-850 tracking-wide">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through font-light">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-stone-500 max-w-xl">
            {product.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href={`/shop/${product.slug}`}
              className="inline-flex h-10 items-center justify-center gap-2 border border-stone-900 bg-stone-900 px-6 text-[11px] font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#c29958] hover:border-[#c29958] hover:text-white active:scale-[0.98]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              View Product
            </Link>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => toggleWishlist({ productId: product.id })}
              className="flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-600 hover:text-white hover:bg-[#c29958] hover:border-[#c29958] transition-all duration-300"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col bg-transparent font-[var(--font-corano)] pb-4">
      <div className="relative overflow-hidden bg-[#fbfaf8] aspect-square">
        <Link href={`/shop/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-stone-900/90 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#c29958]/95 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
              {discount}%
            </span>
          )}
        </div>

        {/* Minimal Wishlist Button in Top-Right */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => toggleWishlist({ productId: product.id })}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-[2px] text-stone-700 shadow-sm border border-stone-100/50 transition-all duration-300 hover:bg-[#c29958] hover:text-white hover:border-[#c29958] hover:scale-105 disabled:opacity-60"
            aria-label="Add to wishlist"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-x-0 bottom-0 flex h-10 translate-y-full items-center justify-center gap-1.5 bg-stone-900/90 backdrop-blur-[2px] text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#c29958] group-hover:translate-y-0 z-10"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          View Product
        </Link>
      </div>

      <div className="flex flex-1 flex-col pt-4 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c29958]">
          Zenvoraa
        </p>
        <h3 className="mt-1.5 text-[15px] font-serif font-medium text-stone-850 leading-snug transition-colors duration-300 group-hover:text-[#c29958] line-clamp-1">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        
        <p className="mt-2 text-xs leading-relaxed text-stone-400 line-clamp-2 min-h-[32px]">
          {product.excerpt}
        </p>

        {/* Left Aligned Price and Right Aligned Star */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100/60 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-850 tracking-wide">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through font-light">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#c29958]">
            <Star className="h-3 w-3 fill-current stroke-current" />
            <span className="text-[11px] font-bold text-stone-500 font-mono">{rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
