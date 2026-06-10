"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetProductListingQuery } from "@/services/api/products/products-api";
import { cn, getProductImage } from "@/lib/utils";

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return price;

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

interface ProductSearchBoxProps {
  className?: string;
  onNavigate?: () => void;
  placeholder?: string;
}

export default function ProductSearchBox({
  className,
  onNavigate,
  placeholder = "Search entire store here",
}: ProductSearchBoxProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetProductListingQuery({
    page: 1,
    limit: 100,
  });

  const query = search.trim().toLowerCase();
  const products = useMemo(() => {
    if (query.length === 0) return [];

    return (data?.data.items ?? [])
      .filter((product) => {
        const haystack =
          `${product.name} ${product.excerpt} ${product.slug}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 6);
  }, [data?.data.items, query]);

  const showPanel = isOpen && search.trim().length > 0;

  const closeSearch = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (products[0]) {
          router.push(`/shop/${products[0].slug}`);
          closeSearch();
          return;
        }

        router.push(
          query ? `/shop?search=${encodeURIComponent(query)}` : "/shop",
        );
        closeSearch();
      }}
      onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
      onFocus={() => setIsOpen(true)}
      className={cn(
        "group relative flex h-11 items-center border border-[#e4dfd7] bg-white px-4 transition-colors focus-within:border-[#c29958]",
        className,
      )}
    >
      <input
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#555555] outline-none placeholder:text-[#999999]"
      />
      <button
        type="submit"
        className="text-[#c29958] transition-colors hover:text-[#222222]"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </button>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[430px] overflow-y-auto border border-[#eee8df] border-t-2 border-t-[#c29958] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
          <div className="border-b border-[#eee8df] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#777777]">
            {isLoading
              ? "Searching products..."
              : `${products.length} result${products.length === 1 ? "" : "s"}`}
          </div>

          {!isLoading && products.length === 0 && (
            <div className="px-4 py-6 text-sm text-[#777777]">
              No products found for{" "}
              <span className="font-bold">{search.trim()}</span>.
            </div>
          )}

          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              onClick={closeSearch}
              className="grid grid-cols-[64px_1fr] gap-3 border-b border-[#f0ebe2] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#f9f5f0]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7f2ea]">
                <Image
                  src={getProductImage(product.slug)}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-[#222222]">
                  {product.name}
                </h4>
                <p className="mt-1 line-clamp-1 text-xs text-[#777777]">
                  {product.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-[#c29958]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#999999] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}
