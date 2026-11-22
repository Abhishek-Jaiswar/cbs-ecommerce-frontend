"use client";

import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ZvProductCard } from "@/components/storefront/zv-product-card";
import { useGetProductListingQuery } from "@/services/api/products/products-api";

/** Figma Product > Products Carousel ("You May Also Like"). Same category first, topped up with bestsellers. */
export function ZvRelatedProducts({ productId, categorySlug }: { productId: string; categorySlug?: string | undefined }) {
  const sameCat = useGetProductListingQuery(
    { page: 1, limit: 13, category: categorySlug, sort: "featured" },
    { skip: !categorySlug },
  );
  const sameCount = (sameCat.data?.data.items ?? []).filter((p) => p.id !== productId).length;
  const needTopUp = !categorySlug || (!sameCat.isLoading && sameCount < 8);
  const fallback = useGetProductListingQuery({ page: 1, limit: 13, sort: "featured" }, { skip: !needTopUp });

  const products = useMemo(() => {
    const seen = new Set([productId]);
    return [...(sameCat.data?.data.items ?? []), ...(fallback.data?.data.items ?? [])]
      .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
      .slice(0, 12);
  }, [sameCat.data, fallback.data, productId]);

  const isLoading = sameCat.isLoading || (needTopUp && fallback.isLoading);
  const railRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: "smooth" });

  if (!isLoading && products.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="flex flex-col gap-6 bg-zv-bg-soft py-zv-40 lg:gap-zv-20">
      <div className="relative flex items-center justify-center px-zv-20 lg:px-zv-40">
        <h2 id="related-title" className="text-center font-zv-display text-[30px] italic text-zv-ink-brown lg:text-[36px] lg:text-zv-ink">
          You May Also Like
        </h2>
        {products.length > 4 && (
          <div className="absolute right-zv-40 hidden gap-zv-10 lg:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollBy(d)}
                aria-label={d < 0 ? "Previous products" : "Next products"}
                className="grid size-10 place-items-center rounded-full border border-zv-primary text-zv-primary transition-colors hover:bg-zv-primary hover:text-white"
              >
                {d < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory scroll-px-zv-20 gap-zv-20 overflow-x-auto px-zv-20 pb-2 [scrollbar-width:thin] lg:scroll-px-zv-40 lg:px-zv-40"
      >
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-[324px] w-[192px] shrink-0 animate-pulse rounded-leaf bg-zv-image-well lg:h-[409px] lg:w-[322px]" />
            ))
          : products.map((p) => (
              <ZvProductCard key={p.id} product={p} className="w-[192px] shrink-0 snap-start lg:w-[322px]" />
            ))}
      </div>
    </section>
  );
}
