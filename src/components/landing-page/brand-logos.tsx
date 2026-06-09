"use client";

import * as React from "react";
import { useGetBrandsQuery } from "@/services/api/products/products-api";

const fallbackBrandLogos = [
  "/corano/brand/1.png",
  "/corano/brand/2.png",
  "/corano/brand/3.png",
  "/corano/brand/4.png",
  "/corano/brand/5.png",
  "/corano/brand/6.png",
];

export function BrandLogos() {
  const { data, isLoading } = useGetBrandsQuery({ page: 1, limit: 100 });
  const brands = data?.data?.items ?? [];

  // Tripling the items ensures a seamless looping marquee without empty gaps
  const items = React.useMemo(() => {
    if (brands.length > 0) {
      return [...brands, ...brands, ...brands];
    }
    // Fallback if no brands exist in database yet
    const fallbackList = fallbackBrandLogos.map((url, idx) => ({
      id: `fallback-${idx}`,
      image: url,
      name: `Partner Brand ${idx + 1}`,
      altText: `Partner Brand ${idx + 1}`,
    }));
    return [...fallbackList, ...fallbackList, ...fallbackList];
  }, [brands]);

  if (isLoading) {
    return (
      <div className="py-12 bg-white flex items-center justify-center border-t border-[#eee8df]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c29958] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="border-t border-[#eee8df] py-12 bg-white overflow-hidden relative">
      {/* Inline Styles for circular infinite marquee slider */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .marquee-wrapper {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .marquee-wrapper:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="w-full flex">
        <div className="marquee-wrapper flex items-center gap-16 px-4">
          {items.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="relative w-36 h-16 shrink-0 opacity-50 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
            >
              <img
                src={brand.image}
                alt={brand.altText || brand.name}
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
