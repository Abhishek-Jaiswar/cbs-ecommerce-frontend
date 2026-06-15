"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft, ArrowUpDown, Sparkles, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGetProductListingQuery, useGetCategoriesQuery } from "@/services/api/products/products-api";
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

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export default function SearchDialog({ isOpen, onClose, onOpen }: SearchDialogProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Listen for global keyboard shortcuts (Cmd+K / Ctrl+K, or / key)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Open on Cmd+K or Ctrl+K
      const isTriggerCombo = e.key === "k" && (e.metaKey || e.ctrlKey);
      
      // Open on / key if not currently typing in an input/textarea
      const isSlashTrigger = 
        e.key === "/" && 
        document.activeElement?.tagName !== "INPUT" && 
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.getAttribute("contenteditable") !== "true";

      if (isTriggerCombo || isSlashTrigger) {
        e.preventDefault();
        onOpen?.();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onOpen]);

  const { data, isLoading } = useGetProductListingQuery({
    page: 1,
    limit: 100,
  });

  const { data: categoriesRes } = useGetCategoriesQuery();
  const categories = React.useMemo(() => {
    return (categoriesRes?.data.items ?? []).filter((c) => c.isActive).slice(0, 4);
  }, [categoriesRes]);

  const query = search.trim().toLowerCase();
  
  // Filter products based on search term
  const matchedProducts = React.useMemo(() => {
    if (query.length === 0) return [];
    return (data?.data.items ?? [])
      .filter((product) => {
        const haystack = `${product.name} ${product.excerpt} ${product.slug}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 6);
  }, [data?.data.items, query]);

  // Mock recommendations (prepping for future recommendation engine)
  const recommendedProducts = React.useMemo(() => {
    return (data?.data.items ?? []).slice(0, 3);
  }, [data?.data.items]);

  // Reset active index when search query changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (matchedProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matchedProducts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + matchedProducts.length) % matchedProducts.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedProduct = matchedProducts[activeIndex];
      if (selectedProduct) {
        router.push(`/shop/${selectedProduct.slug}`);
        onClose();
      }
    }
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
            Search for jewelry products in the Zenvoraa store catalog.
          </DialogDescription>
          {/* Header search bar */}
          <div className="relative border-b border-[#eee8df] bg-white px-6 py-4">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c29958]" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products by name, type, or collection..."
              className="w-full bg-transparent pl-8 pr-12 text-[#222222] placeholder:text-[#999999] outline-none text-base font-normal tracking-wide"
            />
            <button
              onClick={onClose}
              className="absolute right-6 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center border border-[#eee8df] hover:border-[#c29958] text-[#999999] hover:text-[#c29958] transition-all duration-200"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body content */}
          <div className="max-h-[55vh] overflow-y-auto bg-white p-6">
            {query.length === 0 ? (
              <div className="space-y-6">
                {/* Popular Categories */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-3">
                      Popular Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop?category=${category.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-1.5 border border-[#eee8df] hover:border-[#c29958] px-3.5 py-1.5 text-xs text-[#555555] hover:text-[#c29958] bg-[#faf8f4] hover:bg-white transition-all duration-200"
                        >
                          {category.name}
                          <ChevronRight className="h-3 w-3 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended products */}
                {recommendedProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Sparkles className="h-3.5 w-3.5 text-[#c29958]" />
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#999999]">
                        Recommended For You
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          onClick={onClose}
                          className="group border border-[#f0ebe2] hover:border-[#c29958] p-3 transition-all duration-300 bg-[#faf8f4] hover:bg-white flex flex-col"
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-white mb-2.5">
                            <Image
                              src={getProductImage(product.slug)}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h5 className="truncate text-xs font-bold text-[#222222] group-hover:text-[#c29958] transition-colors mb-1">
                            {product.name}
                          </h5>
                          <span className="text-xs font-semibold text-[#c29958] mt-auto">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {isLoading ? (
                  <div className="py-12 text-center text-sm text-[#777777] font-medium animate-pulse">
                    Searching catalog...
                  </div>
                ) : matchedProducts.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-[#555555] mb-1">
                      No results found for &ldquo;<span className="font-bold text-[#222222]">{search}</span>&rdquo;
                    </p>
                    <p className="text-xs text-[#999999]">
                      Try searching with keywords like &quot;gold&quot;, &quot;ring&quot;, or &quot;diamond&quot;
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-3">
                      Products ({matchedProducts.length})
                    </h4>
                    <div className="space-y-2">
                      {matchedProducts.map((product, idx) => {
                        const isSelected = idx === activeIndex;
                        return (
                          <Link
                            key={product.id}
                            href={`/shop/${product.slug}`}
                            onClick={onClose}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={cn(
                              "flex items-center gap-4 border border-[#f0ebe2] p-3 transition-all duration-200",
                              isSelected 
                                ? "border-[#c29958] bg-[#fdfaf5] shadow-sm" 
                                : "hover:border-[#c29958] hover:bg-[#fdfaf5]"
                            )}
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[#eee8df] bg-[#f7f2ea]">
                              <Image
                                src={getProductImage(product.slug)}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="truncate text-sm font-bold text-[#222222]">
                                {product.name}
                              </h5>
                              <p className="truncate text-xs text-[#777777]">
                                {product.excerpt}
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
                            {isSelected && (
                              <CornerDownLeft className="h-4 w-4 text-[#c29958] shrink-0 ml-1 opacity-80" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
