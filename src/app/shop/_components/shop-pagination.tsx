"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ShopPaginationProps = {
  activePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ShopPagination({
  activePage,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex justify-center font-[var(--font-zenvoraa)]" aria-label="Product pagination">
      <ul className="flex items-center gap-2">
        <li>
          <button
            type="button"
            disabled={activePage === 1}
            onClick={() => onPageChange(Math.max(1, activePage - 1))}
            className="flex h-10 w-10 items-center justify-center border border-[#ded7cc] text-[#555555] transition-colors hover:border-[#c29958] hover:bg-[#c29958] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <li key={page}>
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center border text-sm font-bold transition-colors ${
                activePage === page
                  ? "border-[#c29958] bg-[#c29958] text-white"
                  : "border-[#ded7cc] text-[#555555] hover:border-[#c29958] hover:bg-[#c29958] hover:text-white"
              }`}
              aria-current={activePage === page ? "page" : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            disabled={activePage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
            className="flex h-10 w-10 items-center justify-center border border-[#ded7cc] text-[#555555] transition-colors hover:border-[#c29958] hover:bg-[#c29958] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
