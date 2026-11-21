"use client";

import { useGetProductListingQuery } from "@/services/api/products/products-api";
import { ZvProductCard } from "@/components/storefront/zv-product-card";

/** Figma Home > Products Carousel ("Our Trending Bestsellers"). */
export function HomeBestsellers() {
  const { data, isLoading } = useGetProductListingQuery({ limit: 12, page: 1 });
  const items = data?.data.items ?? [];
  // Featured products first; fall back to the latest listing.
  const featured = items.filter((p) => p.isFeatured);
  const products = (featured.length >= 4 ? featured : items).slice(0, 8);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 bg-zv-bg-soft py-zv-40 lg:gap-zv-20">
      <h2 className="px-zv-20 text-center font-zv-display text-[30px] italic text-zv-ink-brown lg:text-[36px] lg:text-zv-ink">
        Our Trending Bestsellers
      </h2>
      <div className="flex snap-x snap-mandatory gap-zv-20 overflow-x-auto px-zv-20 pb-2 [scrollbar-width:thin]">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[324px] w-[192px] shrink-0 animate-pulse rounded-leaf bg-zv-image-well lg:h-[409px] lg:w-[322px]"
              />
            ))
          : products.map((p) => (
              <ZvProductCard key={p.id} product={p} className="w-[192px] shrink-0 snap-start lg:w-[322px]" />
            ))}
      </div>
    </section>
  );
}
