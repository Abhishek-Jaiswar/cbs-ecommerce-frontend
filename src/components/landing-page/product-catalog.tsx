"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useGetProductListingQuery } from "@/services/api/products/products-api";
import type { ProductListing } from "@/services/api/products/products-api.types";

const fallbackProducts = [
  {
    brand: "Gold",
    excerpt: "A polished everyday piece with a bright diamond-inspired finish.",
    image: "/corano/product/product-1.jpg",
    oldPrice: "₹2,999",
    price: "₹5,000",
    rating: "4.9",
    slug: "perfect-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Mony",
    excerpt: "A warm golden necklace designed for layered occasion styling.",
    image: "/corano/product/product-2.jpg",
    oldPrice: "₹3,500",
    price: "₹6,000",
    rating: "4.8",
    slug: "handmade-golden-necklace",
    title: "Handmade Golden Necklace",
  },
  {
    brand: "Diamond",
    excerpt: "Refined sparkle with a minimal setting and crisp silhouette.",
    image: "/corano/product/product-3.jpg",
    oldPrice: "",
    price: "₹4,000",
    rating: "4.7",
    slug: "minimal-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Silver",
    excerpt: "A sculpted ornament with cool silver tones and elegant shine.",
    image: "/corano/product/product-4.jpg",
    oldPrice: "₹4,500",
    price: "₹7,000",
    rating: "4.8",
    slug: "diamond-exclusive-ornament",
    title: "Diamond Exclusive Ornament",
  },
  {
    brand: "Mony",
    excerpt: "A citygold ring with a smooth profile and easy daily polish.",
    image: "/corano/product/product-5.jpg",
    oldPrice: "₹2,500",
    price: "₹4,500",
    rating: "4.6",
    slug: "citygold-exclusive-ring",
    title: "Citygold Exclusive Ring",
  },
  {
    brand: "Gold",
    excerpt: "A statement piece built around classic shine and soft detailing.",
    image: "/corano/product/product-6.jpg",
    oldPrice: "₹6,000",
    price: "₹8,000",
    rating: "4.9",
    slug: "classic-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Mony",
    excerpt: "Hand-finished gold styling with a clean neckline presence.",
    image: "/corano/product/product-7.jpg",
    oldPrice: "₹4,000",
    price: "₹5,500",
    rating: "4.7",
    slug: "golden-necklace-edit",
    title: "Handmade Golden Necklace",
  },
  {
    brand: "Diamond",
    excerpt: "A bright diamond look for weddings, gifting, and evening wear.",
    image: "/corano/product/product-8.jpg",
    oldPrice: "",
    price: "₹9,500",
    rating: "5.0",
    slug: "diamond-jewelry-highlight",
    title: "Perfect Diamond Jewelry",
  },
];

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return price;

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mb-10 text-center font-[var(--font-corano)]">
      <h2 className="text-3xl font-bold capitalize text-[#222222] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#777777]">{subtitle}</p>
    </div>
  );
}

function ProductCard({
  product,
  staticProduct,
}: {
  product?: ProductListing;
  staticProduct?: (typeof fallbackProducts)[number];
}) {
  const image = staticProduct?.image ?? "/corano/product/product-1.jpg";
  const title = product?.name ?? staticProduct?.title ?? "Perfect Diamond Jewelry";
  const excerpt =
    product?.excerpt ??
    staticProduct?.excerpt ??
    "A refined Zenvoraa piece designed for everyday elegance.";
  const price = product ? formatPrice(product.price) : staticProduct?.price ?? "₹5,000";
  const oldPrice = product?.originalPrice
    ? formatPrice(product.originalPrice)
    : staticProduct?.oldPrice;
  const href = product
    ? `/shop/${product.slug}`
    : `/shop/${staticProduct?.slug ?? "perfect-diamond-jewelry"}`;
  const rating = staticProduct?.rating ?? "4.8";

  return (
    <article className="group flex h-full flex-col bg-transparent font-[var(--font-corano)] pb-4">
      <div className="relative overflow-hidden bg-[#fbfaf8] aspect-square">
        <Link href={href} className="relative block w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          <span className="bg-stone-900/90 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
            New
          </span>
          {oldPrice && (
            <span className="bg-[#c29958]/95 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-[2px] text-stone-700 shadow-sm border border-stone-100/50 transition-all duration-300 hover:bg-[#c29958] hover:text-white hover:border-[#c29958] hover:scale-105"
            aria-label="Add to wishlist"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Slide-Up View Product */}
        <Link
          href={href}
          className="absolute inset-x-0 bottom-0 flex h-10 translate-y-full items-center justify-center gap-1.5 bg-stone-900/90 backdrop-blur-[2px] text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#c29958] group-hover:translate-y-0 z-10"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          View Product
        </Link>
      </div>

      <div className="flex flex-1 flex-col pt-4 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c29958]">
          {staticProduct?.brand ?? "Zenvoraa"}
        </p>
        <h3 className="mt-1.5 text-[15px] font-serif font-medium text-stone-850 leading-snug transition-colors duration-300 group-hover:text-[#c29958] line-clamp-1">
          <Link href={href}>{title}</Link>
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-stone-400 line-clamp-2 min-h-[32px]">
          {excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-stone-100/60 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-850 tracking-wide">{price}</span>
            {oldPrice && (
              <span className="text-[11px] text-stone-400 line-through font-light">{oldPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#c29958]">
            <Star className="h-3 w-3 fill-current stroke-current" />
            <span className="text-[11px] font-bold text-stone-500 font-mono">{rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCatalog() {
  const [activeTab, setActiveTab] = React.useState("All");
  const { data, isLoading } = useGetProductListingQuery({ limit: 12, page: 1 });
  const displayProducts = data?.data.items.slice(0, 12) ?? [];

  // Implement functional tab filtering based on text contents
  const filteredProducts = React.useMemo(() => {
    const products = displayProducts.length > 0 ? displayProducts : [];
    
    // If loading or empty API results, fallback to static mock products
    const listToFilter = products.length > 0 ? products : fallbackProducts;

    if (activeTab === "All") return listToFilter.slice(0, 8);

    return listToFilter
      .filter((product) => {
        const productName = "name" in product ? product.name : product.title;
        const productExcerpt = product.excerpt || "";
        const brand = "brand" in product ? product.brand : "Zenvoraa";
        const content = `${productName} ${productExcerpt} ${brand}`.toLowerCase();
        return content.includes(activeTab.toLowerCase());
      })
      .slice(0, 8);
  }, [activeTab, displayProducts]);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="our products" subtitle="Add our products to weekly lineup" />
        
        {/* Tab Selection Row */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {["All", "Gold", "Diamond", "Platinum", "Silver"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                activeTab === tab
                  ? "border-[#c29958] bg-[#c29958] text-white"
                  : "border-[#eee8df] text-[#555555] hover:border-[#c29958] hover:text-[#c29958]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-square bg-[#f0ebe2]" />
                <div className="mx-auto mt-5 h-4 w-24 bg-[#f0ebe2]" />
                <div className="mx-auto mt-3 h-5 w-40 bg-[#f0ebe2]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              if ("id" in product) {
                return <ProductCard key={product.id} product={product} />;
              } else {
                return <ProductCard key={product.image} staticProduct={product} />;
              }
            })}
          </div>
        )}
      </div>
    </section>
  );
}
