"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProductListingQuery } from "@/services/api/products/products-api";
import { getProductImage } from "@/lib/utils";

const mockBestSellers = [
  ["Diamond Exclusive Ring", "/corano/product/product-1.jpg", "₹5,000", "₹2,999", "/shop?category=rings"],
  ["Handmade Golden Ring", "/corano/product/product-3.jpg", "₹5,500", "₹3,000", "/shop?category=rings"],
  ["Exclusive Gold Jewelry", "/corano/product/product-5.jpg", "₹4,500", "₹2,500", "/shop?category=jewellery"],
  ["Perfect Diamond Earring", "/corano/product/product-7.jpg", "₹5,000", "₹2,999", "/shop?category=earrings"],
];

const mockSpecialOffers = [
  ["Diamond Exclusive Ring", "/corano/product/product-17.jpg", "₹5,000", "₹2,999", "/shop?category=rings"],
  ["Handmade Golden Necklace", "/corano/product/product-16.jpg", "₹6,000", "₹4,000", "/shop?category=necklaces"],
  ["Perfect Diamond Jewelry", "/corano/product/product-12.jpg", "₹7,000", "₹5,500", "/shop?category=jewellery"],
  ["Citygold Exclusive Ring", "/corano/product/product-11.jpg", "₹4,500", "₹2,500", "/shop?category=rings"],
];

export function BottomCollections() {
  const { data, isLoading } = useGetProductListingQuery({ limit: 24, page: 1 });
  const apiProducts = data?.data.items ?? [];

  const bestSellers = React.useMemo(() => {
    if (isLoading || apiProducts.length === 0) return mockBestSellers;
    
    // Sort featured products first
    const featured = apiProducts.filter((p) => p.isFeatured);
    const candidates = featured.length >= 4 ? featured : [...featured, ...apiProducts.filter((p) => !p.isFeatured)];
    
    // Deduplicate
    const unique = Array.from(new Map(candidates.map((p) => [p.id, p])).values()).slice(0, 4);
    
    return unique.map((p) => [
      p.name,
      getProductImage(p.slug),
      p.originalPrice && parseFloat(p.originalPrice) > 0
        ? `₹${Number(p.originalPrice).toLocaleString("en-IN")}`
        : `₹${Math.round(parseFloat(p.price) * 1.35).toLocaleString("en-IN")}`,
      `₹${Number(p.price).toLocaleString("en-IN")}`,
      `/shop/${p.slug}`,
    ]);
  }, [apiProducts, isLoading]);

  const specialOffers = React.useMemo(() => {
    if (isLoading || apiProducts.length === 0) return mockSpecialOffers;
    
    // Filter sale items
    const sales = apiProducts.filter((p) => p.isSale || (p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.price)));
    const candidates = sales.length >= 4 ? sales : [...sales, ...apiProducts];
    
    // Deduplicate
    const unique = Array.from(new Map(candidates.map((p) => [p.id, p])).values()).slice(0, 4);
    
    return unique.map((p) => [
      p.name,
      getProductImage(p.slug),
      p.originalPrice && parseFloat(p.originalPrice) > 0
        ? `₹${Number(p.originalPrice).toLocaleString("en-IN")}`
        : `₹${Math.round(parseFloat(p.price) * 1.35).toLocaleString("en-IN")}`,
      `₹${Number(p.price).toLocaleString("en-IN")}`,
      `/shop/${p.slug}`,
    ]);
  }, [apiProducts, isLoading]);

  const groupedProducts = [
    {
      title: "Best Sellers",
      products: bestSellers,
    },
    {
      title: "Special Offers",
      products: specialOffers,
    },
  ];

  return (
    <section className="py-20 bg-white font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] sm:text-4xl tracking-wide">
            curated highlights
          </h2>
          <p className="mt-3 text-sm text-[#777777]">
            Explore our most loved designs and exclusive offers
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side: Elegant Promo Banner */}
          <Link
            href="/shop?category=necklaces"
            className="group relative block min-h-[380px] overflow-hidden border border-[#eee8df] bg-[#faf8f5] p-2 shadow-sm"
          >
            <div className="relative h-full min-h-[364px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
                alt="Bridal and Festive Jewelry"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#222222]/20 transition-opacity duration-500 group-hover:bg-[#222222]/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c29958] drop-shadow-sm">
                  BRIDAL & FESTIVE
                </p>
                <h3 className="mt-2 text-3xl font-serif font-medium tracking-wide drop-shadow-md">
                  Exquisite Collections
                </h3>
                <span className="mt-5 border-b border-white pb-1 text-xs font-bold uppercase tracking-wider transition-colors duration-300 group-hover:border-[#c29958] group-hover:text-[#c29958]">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>

          {/* Right Side: Product Lists */}
          <div className="grid gap-8 sm:grid-cols-2">
            {groupedProducts.map((group) => (
              <div key={group.title}>
                <h3 className="mb-6 border-b border-[#eee8df] pb-3 text-base font-bold uppercase tracking-wider text-[#222222]">
                  {group.title}
                </h3>
                <div className="space-y-5">
                  {group.products.map(([title, image, price, oldPrice, link]) => (
                    <Link
                      key={`${title}-${image}`}
                      href={link || "/shop"}
                      className="group flex gap-4 items-center"
                    >
                      <div className="relative shrink-0 w-[72px] h-[72px] bg-[#faf8f5] border border-[#eee8df] overflow-hidden transition-transform duration-300 group-hover:scale-95">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold capitalize text-[#222222] transition-colors duration-300 group-hover:text-[#c29958] line-clamp-2">
                          {title}
                        </h4>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-bold text-[#c29958]">{oldPrice}</span>
                          {price && (
                            <span className="text-[10px] text-[#999999] line-through">
                              {price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
