"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetProductListingQuery,
} from "@/services/api/products/products-api";
import { ShopPagination } from "./shop-pagination";
import { ShopProductGrid } from "./shop-product-grid";
import { ShopSidebar } from "./shop-sidebar";
import { ShopToolbar } from "./shop-toolbar";
import type { ShopProduct, ShopSortKey, ShopViewMode } from "./shop-types";

const ITEMS_PER_PAGE = 12;

type ShopCatalogProps = {
  initialSearch?: string;
};

function getOptionalBrandId(product: ShopProduct) {
  return (product as ShopProduct & { brandId?: string }).brandId;
}

export function ShopCatalog({ initialSearch = "" }: ShopCatalogProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedBrandId, setSelectedBrandId] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState<ShopSortKey>("relevance");
  const [viewMode, setViewMode] = useState<ShopViewMode>("grid");
  const [page, setPage] = useState(1);

  const { data: listingData, isLoading: isListingLoading } =
    useGetProductListingQuery({
      page: 1,
      limit: 100,
    });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();

  const categories = useMemo(
    () => categoriesData?.data.items ?? [],
    [categoriesData?.data.items]
  );
  const rawProducts = useMemo(
    () => listingData?.data.items ?? [],
    [listingData?.data.items]
  );
  const hasProductBrandIds = rawProducts.some((product) => getOptionalBrandId(product));
  const brands = hasProductBrandIds ? brandsData?.data.items ?? [] : [];

  const availableMaxPrice = useMemo(() => {
    const prices = rawProducts
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000000;
  }, [rawProducts]);

  const processedProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = rawProducts.filter((product) => {
      const price = Number(product.price);
      const brandId = getOptionalBrandId(product);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.excerpt.toLowerCase().includes(normalizedSearch) ||
        product.slug.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      const matchesBrand = selectedBrandId === "all" || brandId === selectedBrandId;
      const matchesPrice =
        Number.isFinite(price) && price >= minPrice && price <= maxPrice;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "new") {
      filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    } else {
      filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return filtered;
  }, [maxPrice, minPrice, rawProducts, search, selectedBrandId, selectedCategoryId, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / ITEMS_PER_PAGE));
  const activePage = Math.min(page, totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = processedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const resultStart = processedProducts.length === 0 ? 0 : startIndex + 1;
  const resultEnd = Math.min(startIndex + ITEMS_PER_PAGE, processedProducts.length);

  const resetPagination = () => setPage(1);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategoryId("all");
    setSelectedBrandId("all");
    setMinPrice(0);
    setMaxPrice(availableMaxPrice);
    setSortBy("relevance");
    setPage(1);
  };

  return (
    <section className="mx-auto max-w-[1170px] px-4 py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[270px_1fr]">
        <div className="order-2 lg:order-1">
          <ShopSidebar
            brands={brands}
            categories={categories}
            maxPrice={maxPrice === 1000000 ? availableMaxPrice : maxPrice}
            minPrice={minPrice}
            selectedBrandId={selectedBrandId}
            selectedCategoryId={selectedCategoryId}
            onBrandChange={(brandId) => {
              setSelectedBrandId(brandId);
              resetPagination();
            }}
            onCategoryChange={(categoryId) => {
              setSelectedCategoryId(categoryId);
              resetPagination();
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
              resetPagination();
            }}
            onMinPriceChange={(value) => {
              setMinPrice(value);
              resetPagination();
            }}
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="mb-8 flex h-12 items-center border border-[#ded7cc] bg-white px-4 font-[var(--font-corano)]">
            <Search className="mr-3 h-5 w-5 shrink-0 text-[#c29958]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPagination();
              }}
              placeholder="Search catalog..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#555555] outline-none placeholder:text-[#999999]"
            />
          </div>

          <ShopToolbar
            end={resultEnd}
            sortBy={sortBy}
            start={resultStart}
            total={processedProducts.length}
            viewMode={viewMode}
            onSortChange={(value) => {
              setSortBy(value);
              resetPagination();
            }}
            onViewModeChange={setViewMode}
          />

          <ShopProductGrid
            isLoading={isListingLoading}
            products={paginatedProducts}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />

          <ShopPagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
