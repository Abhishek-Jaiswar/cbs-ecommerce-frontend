"use client";

import { Grid2X2, List } from "lucide-react";
import type { ShopSortKey, ShopViewMode } from "./shop-types";

type ShopToolbarProps = {
  end: number;
  sortBy: ShopSortKey;
  start: number;
  total: number;
  viewMode: ShopViewMode;
  onSortChange: (sortBy: ShopSortKey) => void;
  onViewModeChange: (viewMode: ShopViewMode) => void;
};

const sortOptions: { label: string; value: ShopSortKey }[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Name (A - Z)", value: "name-asc" },
  { label: "Name (Z - A)", value: "name-desc" },
  { label: "Price (Low > High)", value: "price-asc" },
  { label: "Price (High > Low)", value: "price-desc" },
  { label: "Newest First", value: "new" },
];

export function ShopToolbar({
  end,
  sortBy,
  start,
  total,
  viewMode,
  onSortChange,
  onViewModeChange,
}: ShopToolbarProps) {
  return (
    <div className="mb-8 border border-[#eee8df] bg-white px-5 py-4 font-[var(--font-corano)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                viewMode === "grid"
                  ? "border-[#c29958] bg-[#c29958] text-white"
                  : "border-[#ded7cc] text-[#555555] hover:border-[#c29958] hover:text-[#c29958]"
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                viewMode === "list"
                  ? "border-[#c29958] bg-[#c29958] text-white"
                  : "border-[#ded7cc] text-[#555555] hover:border-[#c29958] hover:text-[#c29958]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-[#555555]">
            {total > 0 ? (
              <>
                Showing {start}-{end} of {total} results
              </>
            ) : (
              "Showing 0 results"
            )}
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-[#555555]">
          Sort By :
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as ShopSortKey)}
            className="h-10 min-w-48 border border-[#ded7cc] bg-white px-3 text-sm text-[#555555] outline-none focus:border-[#c29958]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
