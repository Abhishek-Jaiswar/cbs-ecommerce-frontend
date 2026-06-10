"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetProductListingQuery,
  useGetProductTagsQuery,
} from "@/services/api/products/products-api";
import { ShopPagination } from "./shop-pagination";
import { ShopProductGrid } from "./shop-product-grid";
import { ShopSidebar } from "./shop-sidebar";
import { ShopToolbar } from "./shop-toolbar";
import type { ShopProduct, ShopSortKey, ShopViewMode } from "./shop-types";

type ShopCatalogProps = {
  initialSearch?: string;
  initialCategory?: string;
  initialTag?: string;
  initialFeatured?: boolean;
  initialSale?: boolean;
};

export function ShopCatalog({
  initialSearch = "",
  initialCategory = "",
  initialTag = "",
  initialFeatured = false,
  initialSale = false,
  initialBrand = "",
}: ShopCatalogProps & { initialBrand?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState<ShopSortKey>("relevance");
  const [viewMode, setViewMode] = useState<ShopViewMode>("grid");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [onlyNew, setOnlyNew] = useState(initialTag === "new");
  const [onlyFeatured, setOnlyFeatured] = useState(initialFeatured);
  const [onlySale, setOnlySale] = useState(initialSale);

  const { data: listingData, isLoading: isListingLoading } =
    useGetProductListingQuery({
      page: 1,
      limit: 100,
    });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const { data: tagsData } = useGetProductTagsQuery();

  const categories = useMemo(
    () => categoriesData?.data.items ?? [],
    [categoriesData?.data.items]
  );
  const rawProducts = useMemo(
    () => listingData?.data.items ?? [],
    [listingData?.data.items]
  );
  const brands = useMemo(
    () => brandsData?.data.items ?? [],
    [brandsData?.data.items]
  );
  const tags = useMemo(
    () => tagsData?.data.items ?? [],
    [tagsData?.data.items]
  );

  const availableMaxPrice = useMemo(() => {
    const prices = rawProducts
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000000;
  }, [rawProducts]);

  // Sync search state with URL params
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setOnlyFeatured(initialFeatured);
  }, [initialFeatured]);

  useEffect(() => {
    setOnlySale(initialSale);
  }, [initialSale]);

  // Sync categories state with URL param
  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      const matched = categories.find(
        (c) => c.slug.toLowerCase() === initialCategory.toLowerCase()
      );
      if (matched) {
        setSelectedCategoryId(matched.id);
      } else {
        setSelectedCategoryId("all");
      }
    } else if (!initialCategory) {
      setSelectedCategoryId("all");
    }
  }, [initialCategory, categories]);

  // Sync brands state with URL param (comma-separated names/slugs)
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam && brands.length > 0) {
      const brandList = brandParam.split(",").filter(Boolean);
      const brandIds = brandList.map((slug) => {
        const matched = brands.find(
          (b) => b.name.toLowerCase() === slug.toLowerCase() || b.id === slug
        );
        return matched ? matched.id : slug;
      });
      setSelectedBrandIds(brandIds);
    } else {
      setSelectedBrandIds(initialBrand && initialBrand !== "all" ? [initialBrand] : []);
    }
  }, [searchParams, brands, initialBrand]);

  // Sync tags state with URL param (comma-separated names/slugs)
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam && tags.length > 0) {
      const tagList = tagParam.split(",").filter(Boolean);
      const tagIds: string[] = [];
      let hasNewTag = false;

      tagList.forEach((slug) => {
        if (slug === "new") {
          hasNewTag = true;
        } else {
          const matched = tags.find(
            (t) => t.slug.toLowerCase() === slug.toLowerCase() || t.id === slug
          );
          if (matched) tagIds.push(matched.id);
        }
      });
      setSelectedTagIds(tagIds);
      setOnlyNew(hasNewTag);
    } else {
      setSelectedTagIds([]);
      setOnlyNew(initialTag === "new");
    }
  }, [searchParams, tags, initialTag]);

  // Read minPrice/maxPrice/page/sortBy from searchParams on load/popstate
  useEffect(() => {
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    const p = searchParams.get("page");
    const sort = searchParams.get("sortBy");

    if (minP) setMinPrice(Number(minP));
    if (maxP) setMaxPrice(Number(maxP));
    if (p) setPage(Number(p));
    if (sort) setSortBy(sort as ShopSortKey);
  }, [searchParams]);

  // Helper to sync local filter state to browser URL search params
  const updateUrl = (updatedFilters: {
    categorySlug?: string | null;
    brandIds?: string[];
    tagIds?: string[];
    searchVal?: string;
    minP?: number;
    maxP?: number;
    sortKey?: ShopSortKey;
    pageNum?: number;
    isFeaturedVal?: boolean;
    isSaleVal?: boolean;
    isNewVal?: boolean;
  }) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    if (updatedFilters.categorySlug !== undefined) {
      if (updatedFilters.categorySlug) {
        params.set("category", updatedFilters.categorySlug);
      } else {
        params.delete("category");
      }
    }

    if (updatedFilters.brandIds !== undefined) {
      if (updatedFilters.brandIds.length > 0) {
        const brandNames = updatedFilters.brandIds
          .map((id) => brands.find((b) => b.id === id)?.name.toLowerCase() || id)
          .join(",");
        params.set("brand", brandNames);
      } else {
        params.delete("brand");
      }
    }

    if (updatedFilters.tagIds !== undefined || updatedFilters.isNewVal !== undefined) {
      const activeTagIds = updatedFilters.tagIds !== undefined ? updatedFilters.tagIds : selectedTagIds;
      const isNewActive = updatedFilters.isNewVal !== undefined ? updatedFilters.isNewVal : onlyNew;
      
      const finalTags: string[] = [];
      if (isNewActive) finalTags.push("new");
      
      activeTagIds.forEach((id) => {
        const slug = tags.find((t) => t.id === id)?.slug;
        if (slug) finalTags.push(slug);
      });

      if (finalTags.length > 0) {
        params.set("tag", finalTags.join(","));
      } else {
        params.delete("tag");
      }
    }

    if (updatedFilters.searchVal !== undefined) {
      if (updatedFilters.searchVal.trim()) {
        params.set("search", updatedFilters.searchVal.trim());
      } else {
        params.delete("search");
      }
    }

    if (updatedFilters.minP !== undefined) {
      if (updatedFilters.minP > 0) {
        params.set("minPrice", updatedFilters.minP.toString());
      } else {
        params.delete("minPrice");
      }
    }

    if (updatedFilters.maxP !== undefined) {
      if (updatedFilters.maxP < availableMaxPrice) {
        params.set("maxPrice", updatedFilters.maxP.toString());
      } else {
        params.delete("maxPrice");
      }
    }

    if (updatedFilters.sortKey !== undefined) {
      if (updatedFilters.sortKey !== "relevance") {
        params.set("sortBy", updatedFilters.sortKey);
      } else {
        params.delete("sortBy");
      }
    }

    if (updatedFilters.pageNum !== undefined) {
      if (updatedFilters.pageNum > 1) {
        params.set("page", updatedFilters.pageNum.toString());
      } else {
        params.delete("page");
      }
    }

    if (updatedFilters.isFeaturedVal !== undefined) {
      if (updatedFilters.isFeaturedVal) {
        params.set("featured", "true");
      } else {
        params.delete("featured");
      }
    }

    if (updatedFilters.isSaleVal !== undefined) {
      if (updatedFilters.isSaleVal) {
        params.set("sale", "true");
      } else {
        params.delete("sale");
      }
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  // Helper to find parent category and all its children/grandchildren categories recursively
  const selectedCategoryIds = useMemo(() => {
    if (selectedCategoryId === "all") return new Set(["all"]);
    const ids = new Set([selectedCategoryId]);

    const findChildren = (parentId: string) => {
      categories.forEach((cat) => {
        if (cat.parentId === parentId) {
          ids.add(cat.id);
          findChildren(cat.id);
        }
      });
    };

    findChildren(selectedCategoryId);
    return ids;
  }, [selectedCategoryId, categories]);

  // Compute live product counts dynamically based on all products in the catalog
  const productCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>,
      brands: {} as Record<string, number>,
      tags: {} as Record<string, number>,
    };

    counts.categories.all = rawProducts.length;

    categories.forEach((c) => {
      counts.categories[c.id] = 0;
    });
    brands.forEach((b) => {
      counts.brands[b.id] = 0;
    });
    tags.forEach((t) => {
      counts.tags[t.id] = 0;
    });

    rawProducts.forEach((product) => {
      if (product.categoryId) {
        counts.categories[product.categoryId] = (counts.categories[product.categoryId] ?? 0) + 1;
      }
      if (product.brandId) {
        counts.brands[product.brandId] = (counts.brands[product.brandId] ?? 0) + 1;
      }
      if (product.productTags) {
        product.productTags.forEach((pt) => {
          counts.tags[pt.tag.id] = (counts.tags[pt.tag.id] ?? 0) + 1;
        });
      }
    });

    // Accumulate child category counts into parent category counts recursively
    categories.forEach((cat) => {
      if (cat.parentId) {
        const addToParent = (parentId: string, amount: number) => {
          const parent = categories.find((c) => c.id === parentId);
          if (parent) {
            counts.categories[parent.id] = (counts.categories[parent.id] ?? 0) + amount;
            if (parent.parentId) {
              addToParent(parent.parentId, amount);
            }
          }
        };
        const childCount = rawProducts.filter((p) => p.categoryId === cat.id).length;
        addToParent(cat.parentId, childCount);
      }
    });

    return counts;
  }, [rawProducts, categories, brands, tags]);

  const processedProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = rawProducts.filter((product) => {
      const price = Number(product.price);
      
      // Search term filtering
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.excerpt.toLowerCase().includes(normalizedSearch) ||
        product.slug.toLowerCase().includes(normalizedSearch);

      // Category / Subcategory nested filtering
      const matchesCategory =
        selectedCategoryId === "all" || selectedCategoryIds.has(product.categoryId);

      // Multi-brand selection filtering
      const matchesBrand =
        selectedBrandIds.length === 0 ||
        (product.brandId && selectedBrandIds.includes(product.brandId));

      // Price range filtering
      const matchesPrice =
        Number.isFinite(price) && price >= minPrice && price <= maxPrice;

      // Multi-tag selection filtering
      const productTagIds = product.productTags?.map((pt) => pt.tag.id) ?? [];
      const matchesTags =
        selectedTagIds.length === 0 ||
        selectedTagIds.some((id) => productTagIds.includes(id));

      // Flag tags filtering
      const matchesFeatured = !onlyFeatured || product.isFeatured;
      const matchesSale = !onlySale || product.isSale;
      const matchesNew = !onlyNew || product.isNew;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesTags &&
        matchesFeatured &&
        matchesSale &&
        matchesNew
      );
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
  }, [
    maxPrice,
    minPrice,
    rawProducts,
    search,
    selectedBrandIds,
    selectedCategoryId,
    selectedCategoryIds,
    selectedTagIds,
    sortBy,
    onlyNew,
    onlyFeatured,
    onlySale,
  ]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / itemsPerPage));
  const activePage = Math.min(page, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedProducts = processedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const resultStart = processedProducts.length === 0 ? 0 : startIndex + 1;
  const resultEnd = Math.min(startIndex + itemsPerPage, processedProducts.length);

  const resetPagination = () => setPage(1);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategoryId("all");
    setSelectedBrandIds([]);
    setSelectedTagIds([]);
    setMinPrice(0);
    setMaxPrice(availableMaxPrice);
    setSortBy("relevance");
    setOnlyNew(false);
    setOnlyFeatured(false);
    setOnlySale(false);
    setPage(1);
    setItemsPerPage(8);
    router.push("/shop");
  };

  return (
    <section className="mx-auto max-w-[1170px] px-4 py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[270px_1fr]">
        <div className="order-2 lg:order-1">
          <ShopSidebar
            brands={brands}
            categories={categories}
            tags={tags}
            maxPrice={maxPrice === 1000000 ? availableMaxPrice : maxPrice}
            minPrice={minPrice}
            selectedBrandIds={selectedBrandIds}
            selectedCategoryId={selectedCategoryId}
            selectedTagIds={selectedTagIds}
            onBrandChange={(brandIds) => {
              setSelectedBrandIds(brandIds);
              resetPagination();
              updateUrl({ brandIds, pageNum: 1 });
            }}
            onCategoryChange={(categoryId) => {
              setSelectedCategoryId(categoryId);
              resetPagination();
              const cat = categories.find((c) => c.id === categoryId);
              updateUrl({ categorySlug: cat ? cat.slug : null, pageNum: 1 });
            }}
            onTagChange={(tagIds) => {
              setSelectedTagIds(tagIds);
              resetPagination();
              updateUrl({ tagIds, pageNum: 1 });
            }}
            onPriceChange={(range) => {
              setMinPrice(range[0]);
              setMaxPrice(range[1]);
              resetPagination();
              updateUrl({ minP: range[0], maxP: range[1], pageNum: 1 });
            }}
            productCounts={productCounts}
            absoluteMaxPrice={availableMaxPrice}
            onResetFilters={handleResetFilters}
          />
        </div>

        <div className="order-1 lg:order-2">
          {/* Elegant Search Input */}
          <div className="mb-8 flex h-12 items-center border border-stone-200 bg-white px-4 font-[var(--font-corano)] focus-within:border-[#c29958] transition-colors shadow-sm">
            <Search className="mr-3 h-4 w-4 shrink-0 text-[#c29958]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPagination();
                updateUrl({ searchVal: event.target.value, pageNum: 1 });
              }}
              placeholder="Search catalog..."
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
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
              updateUrl({ sortKey: value, pageNum: 1 });
            }}
            onViewModeChange={setViewMode}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit);
              resetPagination();
            }}
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
            onPageChange={(p) => {
              setPage(p);
              updateUrl({ pageNum: p });
            }}
          />
        </div>
      </div>
    </section>
  );
}
