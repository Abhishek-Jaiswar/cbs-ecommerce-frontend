"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetProductListingQuery,
  useGetCategoriesQuery,
} from "@/services/api/products/products-api";
import { getProductImage } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [page, setPage] = useState(1);

  // We fetch a larger pool to support client-side filtering/sorting easily
  const { data: listingData, isLoading: isListingLoading } = useGetProductListingQuery({
    page: 1,
    limit: 100, // Fetch all for easy search/filter/sort in client
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data.items ?? [];

  const rawProducts = listingData?.data.items ?? [];

  // Filter and sort products in client side for instant responsiveness
  const processedProducts = useMemo(() => {
    let result = [...rawProducts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      // In a real DB, getProductsForListing would support categoryId query. 
      // Since it doesn't, we can match category by looking at product names/slugs or matching structure.
      // E.g. we match keywords in the slug
      const catSlug = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const slug = p.slug.toLowerCase();
        if (catSlug === "rings") return slug.includes("ring") || slug.includes("band");
        if (catSlug === "earrings") return slug.includes("earring") || slug.includes("stud") || slug.includes("hoop");
        if (catSlug === "necklaces") return slug.includes("necklace") || slug.includes("chain") || slug.includes("pendant");
        if (catSlug === "bracelets") return slug.includes("bracelet") || slug.includes("bangle") || slug.includes("cuff");
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else if (sortBy === "new") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [rawProducts, search, selectedCategory, sortBy]);

  // Paginate client-side
  const itemsPerPage = 8;
  const totalPages = Math.max(Math.ceil(processedProducts.length / itemsPerPage), 1);
  
  // Reset page if out of bounds
  const activePage = page > totalPages ? 1 : page;

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, activePage, itemsPerPage]);

  return (
    <div className="flex-1 bg-stone-50 py-10 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS & HEADER */}
        <div className="mb-8 text-center sm:text-left">
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-600">Shop Catalog</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-semibold tracking-tight">
            The Collections
          </h1>
          <div className="mt-2 h-[2px] w-12 bg-amber-500 mx-auto sm:mx-0" />
        </div>

        {/* TOP CONTROLS & SEARCH */}
        <div className="bg-white border border-stone-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-xs flex items-center border border-stone-300 rounded-none bg-stone-50 px-3 py-1.5 focus-within:ring-1 focus-within:ring-amber-500">
            <Search size={16} className="text-stone-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-sm w-full outline-none placeholder:text-stone-400 text-stone-800"
            />
          </div>

          {/* Sort selector */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="border border-stone-300 bg-white text-xs px-3 py-2 rounded-none outline-none focus:border-amber-500 text-stone-700"
              >
                <option value="featured">Featured First</option>
                <option value="new">New Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Alphabetical: A-Z</option>
              </select>
            </div>
            
            <div className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{processedProducts.length}</span> designs
            </div>
          </div>
        </div>

        {/* LAYOUT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          
          {/* CATEGORY FILTER SIDEBAR */}
          <div className="flex flex-col gap-6 bg-white border border-stone-200 p-6 self-start shadow-sm">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-200">
                <SlidersHorizontal size={14} className="text-amber-600" />
                Categories
              </h3>
              <ul className="mt-4 flex flex-wrap lg:flex-col gap-2">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setPage(1);
                    }}
                    className={`text-xs uppercase tracking-wider font-semibold w-full text-left px-3 py-2.5 transition-colors ${
                      selectedCategory === "all"
                        ? "bg-amber-500 text-stone-950"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    All Collections
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                      }}
                      className={`text-xs uppercase tracking-wider font-semibold w-full text-left px-3 py-2.5 transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-amber-500 text-stone-950"
                          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block border-t border-stone-100 pt-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 mb-2">Our Promise</h4>
              <p className="text-[11px] leading-relaxed text-stone-500 font-light">
                All designs include lifetime certification, complimentary cleaning support, and elegant velvet gift boxes.
              </p>
            </div>
          </div>

          {/* MAIN PRODUCT CATALOG GRID */}
          <div>
            {isListingLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 6].map((i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4 bg-white border border-stone-200 p-4">
                    <div className="bg-stone-200 aspect-square w-full" />
                    <div className="h-4 bg-stone-200 w-1/3 rounded" />
                    <div className="h-6 bg-stone-200 w-3/4 rounded" />
                    <div className="h-4 bg-stone-200 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white border border-stone-200 text-center py-20 px-4 shadow-sm">
                <p className="text-lg font-serif text-stone-800">No matching designs found</p>
                <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">
                  Try adjusting your search terms or select another category filter.
                </p>
                <Button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                  className="bg-stone-900 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 mt-6"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const discount = product.originalPrice
                      ? Math.round(
                          ((parseFloat(product.originalPrice) - parseFloat(product.price)) /
                            parseFloat(product.originalPrice)) *
                            100
                        )
                      : 0;

                    const productImg = getProductImage(product.slug);

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white border border-stone-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                          {product.isNew && (
                            <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              New
                            </span>
                          )}
                          {product.originalPrice && discount > 0 && (
                            <span className="bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Product Image */}
                        <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
                          <Image
                            src={productImg}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1 gap-2">
                          <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest">
                            ZenVora Premium
                          </span>
                          <h3 className="font-serif text-base text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                          </h3>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {product.excerpt}
                          </p>

                          <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <Star className="h-3 w-3 fill-amber-500" />
                            <Star className="h-3 w-3 fill-amber-500" />
                            <Star className="h-3 w-3 fill-amber-500" />
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span className="text-[10px] text-stone-400 ml-1">(1 review)</span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-stone-100">
                            <span className="text-base font-bold text-stone-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Link */}
                        <Link
                          href={`/shop/${product.slug}`}
                          className="w-full text-center py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 hover:text-stone-950 transition-colors mt-auto block"
                        >
                          View Details
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-stone-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={activePage === 1}
                      className="rounded-none border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((itemPage) => (
                        <Button
                          key={itemPage}
                          variant={activePage === itemPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(itemPage)}
                          className={`rounded-none h-8 w-8 p-0 text-xs ${
                            activePage === itemPage
                              ? "bg-stone-900 text-white hover:bg-stone-800"
                              : "border-stone-300 hover:bg-stone-100 text-stone-700"
                          }`}
                        >
                          {itemPage}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={activePage === totalPages}
                      className="rounded-none border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
