"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Search, ArrowUpDown, Loader2, Sparkles, Filter, Star } from "lucide-react";
import { useSearchProductsQuery } from "@/services/api/products/products-api";
import { ShopProductCard } from "@/app/shop/_components/shop-product-card";
import { ShopPagination } from "@/app/shop/_components/shop-pagination";
import type { ShopProduct } from "@/app/shop/_components/shop-types";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialSort = searchParams.get("sort") || "relevance";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [isSaleOnly, setIsSaleOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(12);

  // Fetch search products via RTK Query
  const { data, isLoading, isFetching } = useSearchProductsQuery({
    q: query,
    page,
    limit,
    categoryId: selectedCategory || undefined,
    brandId: selectedBrand || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    isSale: isSaleOnly || undefined,
    inStockOnly: inStockOnly || undefined,
    isFeatured: isFeaturedOnly || undefined,
    sort: sortBy,
  });

  const searchData = data?.data;
  const products = searchData?.items || [];
  const totalProducts = searchData?.total || 0;
  const totalPages = searchData?.totalPages || 0;
  const facets = searchData?.facets;

  const startItem = totalProducts > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, totalProducts);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? "" : catId));
    setPage(1);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand((prev) => (prev === brandId ? "" : brandId));
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setIsSaleOnly(false);
    setInStockOnly(false);
    setIsFeaturedOnly(false);
    setSortBy("relevance");
    setPage(1);
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedBrand ||
    minPrice ||
    maxPrice ||
    minRating > 0 ||
    isSaleOnly ||
    inStockOnly ||
    isFeaturedOnly ||
    sortBy !== "relevance";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#222222] font-(--font-zenvoraa) pb-20">
      {/* Search Header Banner */}
      <div className="border-b border-[#eee8df] bg-white py-8 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c29958] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#c29958]" /> Catalog Search
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-850 tracking-tight">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-[#c29958]">{query}</span>&rdquo;
                </>
              ) : (
                "Explore Our Catalog"
              )}
            </h1>

            <p className="mt-2 text-xs text-[#777777]">
              Showing <span className="font-bold text-[#222222]">{totalProducts}</span> matching products
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">

          {/* Left Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="border border-[#eee8df] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#eee8df] pb-4 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-[#c29958]" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-[#c29958] hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Facets */}
              {facets?.categories && facets.categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {facets.categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between text-xs text-[#555555] hover:text-[#222222] cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat.id}
                            onChange={() => handleCategoryChange(cat.id)}
                            className="h-3.5 w-3.5 rounded-none border-[#ddd6c9] text-[#c29958] focus:ring-0 accent-[#c29958]"
                          />
                          <span className={selectedCategory === cat.id ? "font-bold text-[#c29958]" : ""}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] bg-[#faf8f5] border border-[#eee8df] px-1.5 py-0.5 text-[#888888]">
                          {cat.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Facets */}
              {facets?.brands && facets.brands.length > 0 && (
                <div className="mb-6 border-t border-[#eee8df] pt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-3">
                    Brands
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {facets.brands.map((b) => (
                      <label
                        key={b.id}
                        className="flex items-center justify-between text-xs text-[#555555] hover:text-[#222222] cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBrand === b.id}
                            onChange={() => handleBrandChange(b.id)}
                            className="h-3.5 w-3.5 rounded-none border-[#ddd6c9] text-[#c29958] focus:ring-0 accent-[#c29958]"
                          />
                          <span className={selectedBrand === b.id ? "font-bold text-[#c29958]" : ""}>
                            {b.name}
                          </span>
                        </div>
                        <span className="text-[10px] bg-[#faf8f5] border border-[#eee8df] px-1.5 py-0.5 text-[#888888]">
                          {b.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-6 border-t border-[#eee8df] pt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-3">
                  Price Range (₹)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-[#eee8df] bg-[#faf8f5] px-2.5 py-1.5 text-xs text-[#222222] outline-none focus:border-[#c29958]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-[#eee8df] bg-[#faf8f5] px-2.5 py-1.5 text-xs text-[#222222] outline-none focus:border-[#c29958]"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6 border-t border-[#eee8df] pt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-3">
                  Minimum Rating
                </h4>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((ratingVal) => (
                    <button
                      key={ratingVal}
                      onClick={() => setMinRating((r) => (r === ratingVal ? 0 : ratingVal))}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 w-full border transition-colors ${
                        minRating === ratingVal
                          ? "border-[#c29958] bg-[#fdfaf5] text-[#c29958] font-bold"
                          : "border-[#eee8df] bg-[#faf8f5] text-[#555555] hover:border-[#c29958]"
                      }`}
                    >
                      <div className="flex items-center text-[#c29958]">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span>{ratingVal} Stars &amp; Above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles Section */}
              <div className="border-t border-[#eee8df] pt-4 space-y-2.5">
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#c29958]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSaleOnly}
                    onChange={(e) => setIsSaleOnly(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#c29958]"
                  />
                  <span>On Sale Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedOnly}
                    onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#c29958]"
                  />
                  <span>Featured Collection</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product List Area (List View Only) */}
          <div>
            {/* Control Bar: Sorting & Per-Page Controls */}
            <div className="border border-[#eee8df] bg-white p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#555555]">Sort By:</span>
                  <div className="relative min-w-[200px]">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full appearance-none border border-[#eee8df] bg-[#faf8f5] px-3 py-1.5 pr-8 text-xs font-semibold text-[#222222] outline-none focus:border-[#c29958] cursor-pointer"
                    >
                      <option value="relevance">Most Relevant (Recommended)</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="name_asc">Alphabetical: A to Z</option>
                      <option value="name_desc">Alphabetical: Z to A</option>
                      <option value="rating_desc">Highest Customer Rating</option>
                      <option value="discount_desc">Highest Discount / Offers</option>
                    </select>
                    <ArrowUpDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777] pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#555555]">
                  <span>Items per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="border border-[#eee8df] bg-[#faf8f5] px-2.5 py-1 text-xs text-[#222222] outline-none focus:border-[#c29958] cursor-pointer font-semibold"
                  >
                    {[8, 12, 16, 24].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs text-[#777777]">
                {totalProducts > 0 ? (
                  <>
                    Showing <strong className="text-[#222222]">{startItem}-{endItem}</strong> of <strong className="text-[#222222]">{totalProducts}</strong> results
                  </>
                ) : (
                  "Showing 0 results"
                )}
              </div>
            </div>

            {/* Products List (Strict List View) */}
            {isLoading || isFetching ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#c29958]" />
                <p className="text-sm text-[#777777] font-medium">Searching catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="border border-[#eee8df] bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#faf8f4] mb-4">
                  <Search className="h-6 w-6 text-[#c29958]" />
                </div>
                <h3 className="text-lg font-serif font-medium text-[#222222] mb-1">
                  No matching products found
                </h3>
                <p className="text-xs text-[#777777] max-w-md mx-auto mb-6">
                  We couldn&apos;t find any products matching &ldquo;<span className="font-semibold text-[#222222]">{query}</span>&rdquo;.
                  Try checking for spelling errors or searching with broader keywords like &quot;ring&quot;, &quot;necklace&quot;, or &quot;gold&quot;.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 border border-stone-900 bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c29958] hover:border-[#c29958] transition-colors"
                  >
                    Clear Search Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product as unknown as ShopProduct}
                    viewMode="list"
                  />
                ))}
              </div>
            )}

            {/* Full Pagination Component */}
            <ShopPagination
              activePage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center flex flex-col items-center justify-center gap-3 bg-[#faf8f5]">
          <Loader2 className="h-8 w-8 animate-spin text-[#c29958]" />
          <p className="text-sm text-[#777777] font-medium">Loading search results...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}