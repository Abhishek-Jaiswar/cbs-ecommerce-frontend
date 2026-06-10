"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { ShopBrand, ShopCategory } from "./shop-types";
import { ChevronDown, ChevronUp, Check, X, RotateCcw } from "lucide-react";
import type { ITag } from "@/services/api/products/products-api.types";

type ShopSidebarProps = {
  brands: ShopBrand[];
  categories: ShopCategory[];
  tags: ITag[];
  maxPrice: number;
  minPrice: number;
  selectedBrandIds: string[];
  selectedCategoryId: string;
  selectedTagIds: string[];
  onBrandChange: (brandIds: string[]) => void;
  onCategoryChange: (categoryId: string) => void;
  onTagChange: (tagIds: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  productCounts: {
    categories: Record<string, number>;
    brands: Record<string, number>;
    tags: Record<string, number>;
  };
  absoluteMaxPrice: number;
  onResetFilters: () => void;
};

function SidebarSection({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#eee8df] pb-7 pt-1">
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#222222]">
          {title}
        </h5>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── Price Range Slider Component ────────────────────────────────────────────
function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
    minValRef.current = val;
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
    maxValRef.current = val;
  };

  const triggerChange = () => {
    onChange([minVal, maxVal]);
  };

  return (
    <div className="relative w-full flex flex-col space-y-5">
      <div className="relative w-full h-5 flex items-center select-none">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          onMouseUp={triggerChange}
          onTouchEnd={triggerChange}
          className="thumb thumb--left z-[10] pointer-events-none absolute h-0 w-full outline-none"
          style={{ WebkitAppearance: "none" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          onMouseUp={triggerChange}
          onTouchEnd={triggerChange}
          className="thumb thumb--right z-[11] pointer-events-none absolute h-0 w-full outline-none"
          style={{ WebkitAppearance: "none" }}
        />

        <div className="relative w-full h-1 bg-[#eee8df] rounded">
          <div
            ref={range}
            className="absolute h-1 bg-[#c29958] rounded"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center border border-[#ded7cc] bg-white h-9 px-2">
          <span className="text-[10px] text-[#aaa] mr-1">₹</span>
          <input
            type="number"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => {
              const val = Math.min(Math.max(Number(e.target.value), min), maxVal - 1);
              setMinVal(val);
              minValRef.current = val;
              onChange([val, maxVal]);
            }}
            className="w-full text-xs font-semibold text-[#222] outline-none"
          />
        </div>
        <span className="text-xs text-[#aaa] font-medium">—</span>
        <div className="flex-1 flex items-center border border-[#ded7cc] bg-white h-9 px-2">
          <span className="text-[10px] text-[#aaa] mr-1">₹</span>
          <input
            type="number"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => {
              const val = Math.max(Math.min(Number(e.target.value), max), minVal + 1);
              setMaxVal(val);
              maxValRef.current = val;
              onChange([minVal, val]);
            }}
            className="w-full text-xs font-semibold text-[#222] outline-none"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Nested Category Row Component ───────────────────────────────────────────
function CategoryRow({
  category,
  subcategories,
  selectedCategoryId,
  count,
  onCategoryChange,
  productCounts,
}: {
  category: ShopCategory;
  subcategories: ShopCategory[];
  selectedCategoryId: string;
  count: number;
  onCategoryChange: (categoryId: string) => void;
  productCounts: ShopSidebarProps["productCounts"];
}) {
  const isSelected = selectedCategoryId === category.id;
  const hasSelectedSub = subcategories.some((s) => selectedCategoryId === s.id);
  const [isOpen, setIsOpen] = useState(isSelected || hasSelectedSub);

  // Sync open state if prop changes
  useEffect(() => {
    if (isSelected || hasSelectedSub) {
      setIsOpen(true);
    }
  }, [isSelected, hasSelectedSub]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group">
        <button
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={`text-left text-sm font-medium transition-colors hover:text-[#c29958] flex-1 py-1 flex items-center justify-between pr-2 ${
            isSelected ? "text-[#c29958] font-semibold" : "text-[#333]"
          }`}
        >
          <span>{category.name}</span>
          <span className={`text-[10px] ml-1.5 transition-colors ${isSelected ? "text-[#c29958]" : "text-[#aaa] group-hover:text-[#888]"}`}>
            ({count})
          </span>
        </button>
        {subcategories.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 hover:text-[#c29958] text-[#aaa] transition-colors"
          >
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {subcategories.length > 0 && isOpen && (
        <ul className="pl-3.5 border-l border-[#eee8df] ml-1.5 space-y-1 py-0.5">
          {subcategories.map((sub) => {
            const subCount = productCounts.categories[sub.id] ?? 0;
            const isSubSelected = selectedCategoryId === sub.id;
            return (
              <li key={sub.id}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(sub.id)}
                  className={`text-left text-xs transition-colors hover:text-[#c29958] w-full py-1 flex items-center justify-between pr-2 ${
                    isSubSelected ? "text-[#c29958] font-semibold" : "text-[#666]"
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className={`text-[9px] ${isSubSelected ? "text-[#c29958]" : "text-[#bbb]"}`}>
                    ({subCount})
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Main Shop Sidebar Component ──────────────────────────────────────────────
export function ShopSidebar({
  brands,
  categories,
  tags,
  maxPrice,
  minPrice,
  selectedBrandIds,
  selectedCategoryId,
  selectedTagIds,
  onBrandChange,
  onCategoryChange,
  onTagChange,
  onPriceChange,
  productCounts,
  absoluteMaxPrice,
  onResetFilters,
}: ShopSidebarProps) {
  // Extract parents and subcategories
  const parentCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  const subcategoriesByParent = useMemo(() => {
    const map: Record<string, ShopCategory[]> = {};
    categories.forEach((c) => {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
    return map;
  }, [categories]);

  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategoryId !== "all" ||
      selectedBrandIds.length > 0 ||
      selectedTagIds.length > 0 ||
      minPrice > 0 ||
      maxPrice < absoluteMaxPrice
    );
  }, [selectedCategoryId, selectedBrandIds, selectedTagIds, minPrice, maxPrice, absoluteMaxPrice]);

  return (
    <aside className="space-y-7 font-[var(--font-corano)] select-none">
      {/* Header and Reset Filters */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eee8df]">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#222]">
          Filters
        </h4>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c29958] hover:text-[#222] transition-colors"
          >
            <RotateCcw size={10} />
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <SidebarSection title="Categories">
        <div className="space-y-1">
          {/* All Collections Button */}
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left text-sm font-semibold transition-colors hover:text-[#c29958] py-1 flex items-center justify-between pr-2 border-b border-dashed border-[#eee8df] pb-2 mb-2 ${
              selectedCategoryId === "all" ? "text-[#c29958]" : "text-[#333]"
            }`}
          >
            <span>All Collections</span>
            <span className="text-[10px] text-[#aaa] font-normal">
              ({productCounts.categories.all ?? 0})
            </span>
          </button>

          {/* Nested Categories list */}
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
            {parentCategories.map((parent) => {
              const subs = subcategoriesByParent[parent.id] || [];
              const count = productCounts.categories[parent.id] ?? 0;
              return (
                <CategoryRow
                  key={parent.id}
                  category={parent}
                  subcategories={subs}
                  selectedCategoryId={selectedCategoryId}
                  count={count}
                  onCategoryChange={onCategoryChange}
                  productCounts={productCounts}
                />
              );
            })}
          </div>
        </div>
      </SidebarSection>

      {/* Price range */}
      <SidebarSection title="Price">
        <PriceRangeSlider
          min={0}
          max={absoluteMaxPrice}
          value={[minPrice, maxPrice]}
          onChange={onPriceChange}
        />
      </SidebarSection>

      {/* Brands */}
      {brands.length > 0 && (
        <SidebarSection
          title="Brands"
          action={
            selectedBrandIds.length > 0 && (
              <button
                onClick={() => onBrandChange([])}
                className="text-[9px] font-bold text-[#aaa] uppercase tracking-wider hover:text-[#c29958] transition-colors"
              >
                Clear
              </button>
            )
          }
        >
          <ul className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {brands.map((brand) => {
              const isChecked = selectedBrandIds.includes(brand.id);
              const count = productCounts.brands[brand.id] ?? 0;
              return (
                <li key={brand.id}>
                  <label className="flex cursor-pointer items-center justify-between py-0.5 group select-none text-sm text-[#555] hover:text-[#222]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-[#c29958] border-[#c29958]"
                            : "border-[#ded7cc] group-hover:border-[#c29958] bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? selectedBrandIds.filter((id) => id !== brand.id)
                            : [...selectedBrandIds, brand.id];
                          onBrandChange(next);
                        }}
                        className="sr-only"
                      />
                      <span className={`transition-colors ${isChecked ? "text-[#222] font-semibold" : "text-[#555]"}`}>
                        {brand.name}
                      </span>
                    </div>
                    <span className={`text-[10px] transition-colors ${isChecked ? "text-[#222] font-semibold" : "text-[#aaa]"}`}>
                      ({count})
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </SidebarSection>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <SidebarSection
          title="Product Tags"
          action={
            selectedTagIds.length > 0 && (
              <button
                onClick={() => onTagChange([])}
                className="text-[9px] font-bold text-[#aaa] uppercase tracking-wider hover:text-[#c29958] transition-colors"
              >
                Clear
              </button>
            )
          }
        >
          <ul className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {tags.map((tag) => {
              const isChecked = selectedTagIds.includes(tag.id);
              const count = productCounts.tags[tag.id] ?? 0;
              return (
                <li key={tag.id}>
                  <label className="flex cursor-pointer items-center justify-between py-0.5 group select-none text-sm text-[#555] hover:text-[#222]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-[#c29958] border-[#c29958]"
                            : "border-[#ded7cc] group-hover:border-[#c29958] bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? selectedTagIds.filter((id) => id !== tag.id)
                            : [...selectedTagIds, tag.id];
                          onTagChange(next);
                        }}
                        className="sr-only"
                      />
                      <span className={`transition-colors ${isChecked ? "text-[#222] font-semibold" : "text-[#555]"}`}>
                        #{tag.name}
                      </span>
                    </div>
                    <span className={`text-[10px] transition-colors ${isChecked ? "text-[#222] font-semibold" : "text-[#aaa]"}`}>
                      ({count})
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </SidebarSection>
      )}

      {/* Banner */}
      <Link href="/shop" className="group block overflow-hidden mt-2 pt-2 border-t border-[#eee8df]">
        <Image
          src="/corano/sidebar-banner.jpg"
          alt="Zenvoraa jewelry promotion"
          width={270}
          height={376}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
    </aside>
  );
}
