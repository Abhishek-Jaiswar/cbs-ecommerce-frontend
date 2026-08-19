"use client";

import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, X, Sparkles, ArrowRight, Tag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useGetSearchSuggestionsQuery } from "@/services/api/products/products-api";
import { getProductImage } from "@/lib/utils";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

const POPULAR_SEARCHES = [
  "Gold Ring",
  "Diamond Necklace",
  "Pendant",
  "Earrings",
  "Silver Bracelet",
  "Solitaire",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(price);
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const trimmedQuery = searchQuery.trim();
  const { data: suggestionsData, isFetching } = useGetSearchSuggestionsQuery(trimmedQuery, {
    skip: trimmedQuery.length < 2,
  });

  const suggestions = suggestionsData?.data;
  const matchingCategories = suggestions?.categories || [];
  const matchingProducts = suggestions?.products || [];

  const handleSearch = (term?: string) => {
    const query = (term !== undefined ? term : searchQuery).trim();
    if (!query) return;

    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleProductClick = (slug: string) => {
    onClose();
    router.push(`/shop/${slug}`);
  };

  const handleCategoryClick = (categorySlug: string) => {
    onClose();
    router.push(`/shop?category=${categorySlug}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        {/* Sleek premium glassmorphic overlay */}
        <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300" />

        <DialogContent
          showCloseButton={false}
          className="fixed left-1/2 top-[10%] z-50 w-full max-w-2xl -translate-x-1/2 translate-y-0 rounded-none border border-[#eee8df] bg-white p-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] outline-none sm:max-w-2xl"
        >
          <DialogTitle className="sr-only">Search Products</DialogTitle>
          <DialogDescription className="sr-only">
            Search for products in the store catalog.
          </DialogDescription>

          {/* Header search bar */}
          <div className="relative border-b border-[#eee8df] bg-white px-6 py-4">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c29958]" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search products by name, type, or collection..."
              className="w-full bg-transparent pl-8 pr-12 text-[#222222] placeholder:text-[#999999] outline-none text-base font-normal tracking-wide"
              autoFocus
            />
            {isFetching ? (
              <Loader2 className="absolute right-14 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c29958] animate-spin" />
            ) : null}
            <button
              onClick={onClose}
              className="absolute right-6 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center border border-[#eee8df] hover:border-[#c29958] text-[#999999] hover:text-[#c29958] transition-all duration-200"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body content */}
          <div className="max-h-[60vh] overflow-y-auto bg-white p-6">
            {trimmedQuery.length >= 2 ? (
              <div>
                {/* Categories Section */}
                {matchingCategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-2.5 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-[#c29958]" /> Matching Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="flex items-center gap-1.5 border border-[#eee8df] hover:border-[#c29958] px-3 py-1.5 text-xs text-[#555555] hover:text-[#c29958] bg-[#faf8f4] hover:bg-white transition-all"
                        >
                          <span>{cat.name}</span>
                          <ArrowRight className="h-3 w-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {matchingProducts.length > 0 ? (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-3 flex items-center justify-between">
                      <span>Products ({matchingProducts.length})</span>
                      <button
                        onClick={() => handleSearch()}
                        className="text-[#c29958] hover:underline normal-case text-xs font-semibold"
                      >
                        View all results &rarr;
                      </button>
                    </h4>

                    <div className="space-y-2">
                      {matchingProducts.map((product) => {
                        const image = product.imageUrl || getProductImage(product.slug);
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="flex items-center gap-4 border border-[#f0ebe2] p-3 transition-all duration-200 hover:border-[#c29958] hover:bg-[#fdfaf5] cursor-pointer group"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[#eee8df] bg-[#f7f2ea]">
                              <Image
                                src={image}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="truncate text-sm font-serif font-medium text-[#222222] group-hover:text-[#c29958]">
                                {product.name}
                              </h5>
                              <p className="truncate text-xs text-[#777777]">
                                {product.categoryName ? product.categoryName : product.excerpt}
                              </p>
                            </div>
                            <div className="text-right shrink-0 flex flex-col items-end">
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
                        );
                      })}
                    </div>
                  </div>
                ) : !isFetching ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-[#555555] mb-1">
                      No live suggestions found for &ldquo;<span className="font-bold text-[#222222]">{searchQuery}</span>&rdquo;
                    </p>
                    <p className="text-xs text-[#999999]">
                      Press <kbd className="px-1.5 py-0.5 border border-[#eee8df] bg-[#faf8f4] text-[#222222] font-mono text-[10px]">Enter</kbd> to perform full search.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-[#c29958]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#999999]">
                    Popular Searches
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="flex items-center gap-1.5 border border-[#eee8df] hover:border-[#c29958] px-3.5 py-1.5 text-xs text-[#555555] hover:text-[#c29958] bg-[#faf8f4] hover:bg-white transition-all duration-200 font-medium"
                    >
                      {term}
                      <ArrowRight className="h-3 w-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer shortcut bar */}
            <div className="border-t border-[#eee8df] pt-4 mt-4 flex items-center justify-between text-xs text-[#777777]">
              <span>Press <kbd className="px-1.5 py-0.5 border border-[#eee8df] bg-[#faf8f4] text-[#222222] font-mono text-[10px]">Enter</kbd> to search full catalog</span>
              {trimmedQuery && (
                <button
                  onClick={() => handleSearch()}
                  className="text-[#c29958] hover:underline font-bold flex items-center gap-1"
                >
                  Search for &quot;{trimmedQuery}&quot; &rarr;
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
