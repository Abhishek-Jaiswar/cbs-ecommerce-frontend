"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { cn, getProductImage } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useAddToCartMutation } from "@/services/api/cart/cart-api";
import { useToggleWishlistItemMutation } from "@/services/api/wishlist/wishlist-api";
import type { ProductListing } from "@/services/api/products/products-api.types";

export function formatInr(value: string | number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return `₹ ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
}

/**
 * ZenVoraa product card (Figma "Selling item").
 * States: default, hover (inner glow), discount (20% tag + struck price), sold out.
 * Width comes from the parent; the photo is always square.
 */
export function ZvProductCard({ product, className }: { product: ProductListing; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [toggleWishlist, { isLoading: isWishing }] = useToggleWishlistItemMutation();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.id);

  const href = `/shop/${product.slug}`;
  const price = Number(product.price);
  const original = Number(product.originalPrice || 0);
  const discount = original > price && price > 0 ? Math.round(((original - price) / original) * 100) : 0;
  const variant = product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];
  const soldOut = !!product.variants?.length && !product.variants.some((v) => v.stock > 0);

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-leaf bg-white font-zv-body transition-shadow hover:shadow-zv-card-hover",
        className,
      )}
    >
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden rounded-tl-[20px] bg-zv-image-well">
        <Link href={href} className="block size-full" aria-label={product.name}>
          <img
            src={product.image?.url || getProductImage(product.slug)}
            alt={product.image?.alt || product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const fallback = getProductImage(product.slug);
              if (!e.currentTarget.src.endsWith(fallback)) e.currentTarget.src = fallback;
            }}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && !soldOut && (
          <span className="pointer-events-none absolute left-zv-10 top-zv-10 rounded-zv-tag bg-zv-gold px-zv-5 py-0.5 text-xs font-bold text-white">
            {discount}%
          </span>
        )}
        {!soldOut && (
          <button
            type="button"
            aria-label={`Save ${product.name} to wishlist`}
            disabled={isWishing}
            onClick={async () => {
              if (!requireAuth()) return;
              try {
                const res = await toggleWishlist({ productId: product.id }).unwrap();
                toast.success(res.data?.liked ? "Saved to favourites" : "Removed from favourites");
              } catch {
                toast.error("Couldn’t update favourites. Please try again.");
              }
            }}
            className="absolute bottom-zv-10 right-zv-10 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <img src="/zenvoraa/icons/card-wishlist-overlay.svg" alt="" width={24} height={24} className="size-6" />
          </button>
        )}
      </div>

      {/* Info strip */}
      <div className="flex flex-1 items-start gap-zv-10 rounded-br-[20px] bg-white px-zv-10 py-zv-20 max-lg:flex-col lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
          <Link href={href} className="line-clamp-2 text-sm text-zv-ink lg:line-clamp-1 lg:text-base">
            {product.name}
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-x-zv-10 gap-y-1">
            {product.colors && product.colors.length > 0 ? (
              <div className="flex items-center gap-zv-10" role="radiogroup" aria-label="Finish">
                {product.colors.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedColor === c.id}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.id)}
                    className={cn(
                      "size-3.5 rounded-full transition-opacity",
                      selectedColor === c.id ? "ring-2 ring-zv-primary" : "opacity-20 hover:opacity-60",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            ) : (
              <span />
            )}
            <p className="type-price ml-auto whitespace-nowrap text-zv-ink">
              {discount > 0 && (
                <span className="mr-1.5 font-normal text-zv-ink/60 line-through">{formatInr(original)}</span>
              )}
              {formatInr(price)}
            </p>
          </div>
        </div>
        {variant && !soldOut && (
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            disabled={isAdding}
            onClick={async () => {
              if (!requireAuth()) return;
              try {
                await addToCart({ variantId: variant.id, quantity: 1 }).unwrap();
                toast.success(`${product.name} added to cart`, {
                  action: { label: "View cart", onClick: () => router.push("/cart") },
                });
              } catch (err) {
                toast.error((err as { data?: { message?: string } })?.data?.message || "Couldn’t add to cart. Please try again.");
              }
            }}
            className="shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <img src="/zenvoraa/icons/card-cart.svg" alt="" width={24} height={24} className="size-6" />
          </button>
        )}
      </div>

      {soldOut && (
        <Link
          href={href}
          className="absolute inset-0 z-20 flex items-center justify-center bg-zv-primary/50 text-lg text-white"
        >
          Sold Out
        </Link>
      )}
    </article>
  );
}
