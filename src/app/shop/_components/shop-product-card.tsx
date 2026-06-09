"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, RefreshCw, Search, ShoppingBag, Star } from "lucide-react";
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

function ProductActions({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [toggleWishlist, { isLoading }] = useToggleWishlistItemMutation();

  return (
    <div className="absolute right-4 top-4 flex translate-x-4 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => toggleWishlist({ productId })}
        aria-label="Add to wishlist"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222222] shadow-sm transition-colors hover:bg-[#c29958] hover:text-white disabled:opacity-60"
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Compare product"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222222] shadow-sm transition-colors hover:bg-[#c29958] hover:text-white"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
      <Link
        href={`/shop/${productSlug}`}
        aria-label="Quick view product"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222222] shadow-sm transition-colors hover:bg-[#c29958] hover:text-white"
      >
        <Search className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function ShopProductCard({ product, viewMode }: ShopProductCardProps) {
  const productImage = getProductImage(product.slug);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : 0;
  const price = Number(product.price);
  const discount =
    originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  if (viewMode === "list") {
    return (
      <article className="group grid gap-6 border border-[#eee8df] bg-white p-4 font-[var(--font-corano)] transition-shadow hover:shadow-md md:grid-cols-[260px_1fr]">
        <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#f7f2ea]">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 260px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <ProductActions productId={product.id} productSlug={product.slug} />
        </Link>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c29958]">
            Zenvoraa
          </p>
          <h3 className="mt-3 text-xl font-bold text-[#222222] transition-colors group-hover:text-[#c29958]">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>
          <div className="mt-3 flex text-[#c29958]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-lg font-bold text-[#c29958]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#999999] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#555555]">
            {product.excerpt}
          </p>
          <Link
            href={`/shop/${product.slug}`}
            className="mt-6 inline-flex h-11 w-fit items-center gap-2 bg-[#222222] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#c29958]"
          >
            <ShoppingBag className="h-4 w-4" />
            View Product
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group font-[var(--font-corano)]">
      <div className="relative overflow-hidden bg-[#f7f2ea]">
        <Link href={`/shop/${product.slug}`} className="relative block aspect-square">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-[#222222] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#c29958] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {discount}%
            </span>
          )}
        </div>

        <ProductActions productId={product.id} productSlug={product.slug} />

        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-x-0 bottom-0 flex h-11 translate-y-full items-center justify-center gap-2 bg-[#222222] text-xs font-bold uppercase tracking-wide text-white transition-transform duration-300 hover:bg-[#c29958] group-hover:translate-y-0"
        >
          <ShoppingBag className="h-4 w-4" />
          View Product
        </Link>
      </div>

      <div className="pt-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c29958]">
          Zenvoraa
        </p>
        <h3 className="mt-2 text-base font-bold text-[#222222] transition-colors group-hover:text-[#c29958]">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-2 flex justify-center text-[#c29958]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-center gap-2">
          <span className="font-bold text-[#c29958]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#999999] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
