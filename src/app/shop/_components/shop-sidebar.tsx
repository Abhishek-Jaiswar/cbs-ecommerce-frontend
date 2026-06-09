"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ShopBrand, ShopCategory } from "./shop-types";

type ShopSidebarProps = {
  brands: ShopBrand[];
  categories: ShopCategory[];
  maxPrice: number;
  minPrice: number;
  selectedBrandId: string;
  selectedCategoryId: string;
  onBrandChange: (brandId: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onMaxPriceChange: (value: number) => void;
  onMinPriceChange: (value: number) => void;
};

function SidebarSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="border-b border-[#eee8df] pb-8">
      <h5 className="mb-5 text-base font-bold uppercase tracking-wide text-[#222222]">
        {title}
      </h5>
      {children}
    </section>
  );
}

export function ShopSidebar({
  brands,
  categories,
  maxPrice,
  minPrice,
  selectedBrandId,
  selectedCategoryId,
  onBrandChange,
  onCategoryChange,
  onMaxPriceChange,
  onMinPriceChange,
}: ShopSidebarProps) {
  return (
    <aside className="space-y-8 font-[var(--font-corano)]">
      <SidebarSection title="Categories">
        <ul className="space-y-3 text-sm capitalize text-[#555555]">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className={`flex w-full items-center justify-between text-left transition-colors hover:text-[#c29958] ${
                selectedCategoryId === "all" ? "text-[#c29958]" : ""
              }`}
            >
              <span>All Collections</span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`flex w-full items-center justify-between text-left transition-colors hover:text-[#c29958] ${
                  selectedCategoryId === category.id ? "text-[#c29958]" : ""
                }`}
              >
                <span>{category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title="Price">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs uppercase tracking-wide text-[#777777]">
              Min
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(event) => onMinPriceChange(Number(event.target.value))}
                className="h-10 w-full border border-[#ded7cc] bg-white px-3 text-sm text-[#222222] outline-none focus:border-[#c29958]"
              />
            </label>
            <label className="space-y-1 text-xs uppercase tracking-wide text-[#777777]">
              Max
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(event) => onMaxPriceChange(Number(event.target.value))}
                className="h-10 w-full border border-[#ded7cc] bg-white px-3 text-sm text-[#222222] outline-none focus:border-[#c29958]"
              />
            </label>
          </div>
          <p className="text-xs leading-5 text-[#777777]">
            Filter products by the live prices returned from the catalog API.
          </p>
        </div>
      </SidebarSection>

      {brands.length > 0 && (
        <SidebarSection title="Brand">
          <ul className="space-y-3 text-sm text-[#555555]">
            <li>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="shop-brand"
                  checked={selectedBrandId === "all"}
                  onChange={() => onBrandChange("all")}
                  className="h-4 w-4 accent-[#c29958]"
                />
                <span>All Brands</span>
              </label>
            </li>
            {brands.map((brand) => (
              <li key={brand.id}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="shop-brand"
                    checked={selectedBrandId === brand.id}
                    onChange={() => onBrandChange(brand.id)}
                    className="h-4 w-4 accent-[#c29958]"
                  />
                  <span>{brand.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      <Link href="/shop" className="group block overflow-hidden">
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
