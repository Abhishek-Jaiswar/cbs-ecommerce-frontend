import type { ShopProduct, ShopViewMode } from "./shop-types";
import { ShopProductCard } from "./shop-product-card";

type ShopProductGridProps = {
  isLoading: boolean;
  products: ShopProduct[];
  viewMode: ShopViewMode;
  onResetFilters: () => void;
};

function ShopSkeleton({ viewMode }: { viewMode: ShopViewMode }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="grid gap-6 border border-[#eee8df] bg-white p-4 md:grid-cols-[260px_1fr]">
            <div className="aspect-square animate-pulse bg-[#f0ebe4]" />
            <div className="space-y-4 py-4">
              <div className="h-3 w-24 animate-pulse bg-[#f0ebe4]" />
              <div className="h-6 w-2/3 animate-pulse bg-[#f0ebe4]" />
              <div className="h-4 w-36 animate-pulse bg-[#f0ebe4]" />
              <div className="h-20 w-full animate-pulse bg-[#f0ebe4]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item}>
          <div className="aspect-square animate-pulse bg-[#f0ebe4]" />
          <div className="mx-auto mt-5 h-3 w-24 animate-pulse bg-[#f0ebe4]" />
          <div className="mx-auto mt-3 h-5 w-40 animate-pulse bg-[#f0ebe4]" />
          <div className="mx-auto mt-3 h-4 w-28 animate-pulse bg-[#f0ebe4]" />
        </div>
      ))}
    </div>
  );
}

export function ShopProductGrid({
  isLoading,
  products,
  viewMode,
  onResetFilters,
}: ShopProductGridProps) {
  if (isLoading) {
    return <ShopSkeleton viewMode={viewMode} />;
  }

  if (products.length === 0) {
    return (
      <div className="border border-[#eee8df] bg-white px-4 py-20 text-center font-[var(--font-zenvoraa)]">
        <h2 className="text-2xl font-bold text-[#222222]">No matching products found</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#555555]">
          Try a different category, price range, or search term to discover more Zenvoraa pieces.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-7 h-11 bg-[#222222] px-7 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#c29958]"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ShopProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}
