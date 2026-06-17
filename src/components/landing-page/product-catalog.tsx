"use client";

import * as React from "react";
import { useGetProductListingQuery } from "@/services/api/products/products-api";
import { ShopProductCard } from "@/app/shop/_components/shop-product-card";
import type { ShopProduct } from "@/app/shop/_components/shop-types";

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

function mapStaticToShopProduct(staticProd: (typeof fallbackProducts)[number]): ShopProduct {
  const colors = [];
  const brandLower = staticProd.brand.toLowerCase();
  const titleLower = staticProd.title.toLowerCase();

  if (brandLower === "gold" || titleLower.includes("gold")) {
    colors.push({ id: "gold", name: "Gold", hex: "#c29958" });
  } else if (brandLower === "silver" || titleLower.includes("silver")) {
    colors.push({ id: "silver", name: "Silver", hex: "#e5e5e5" });
  } else if (brandLower === "diamond" || titleLower.includes("diamond")) {
    colors.push({ id: "platinum", name: "Platinum", hex: "#e1e4e6" });
    colors.push({ id: "gold", name: "Gold", hex: "#c29958" });
  } else {
    colors.push({ id: "gold", name: "Gold", hex: "#c29958" });
    colors.push({ id: "silver", name: "Silver", hex: "#e5e5e5" });
  }

  return {
    id: staticProd.slug,
    name: staticProd.title,
    slug: staticProd.slug,
    excerpt: staticProd.excerpt,
    price: staticProd.price.replace("₹", "").replace(",", ""),
    originalPrice: staticProd.oldPrice ? staticProd.oldPrice.replace("₹", "").replace(",", "") : "",
    isNew: true,
    isFeatured: false,
    isSale: !!staticProd.oldPrice,
    offerEnds: null,
    forListing: true,
    categoryId: "fallback",
    brand: {
      name: staticProd.brand,
    },
    colors,
    variants: [
      { id: `${staticProd.slug}-variant`, stock: 25 },
    ],
  };
}

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mb-10 text-center font-[var(--font-zenvoraa)]">
      <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] sm:text-4xl tracking-wide">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#777777]">{subtitle}</p>
    </div>
  );
}

export function ProductCatalog() {
  const [activeTab, setActiveTab] = React.useState("All");
  const { data, isLoading } = useGetProductListingQuery({ limit: 12, page: 1 });
  const displayProducts = data?.data.items.slice(0, 12) ?? [];

  const filteredProducts = React.useMemo(() => {
    const products = displayProducts.length > 0 ? displayProducts : [];
    const listToFilter = products.length > 0 ? products : fallbackProducts;

    if (activeTab === "All") return listToFilter.slice(0, 8);

    return listToFilter
      .filter((product) => {
        const productName = "name" in product ? product.name : product.title;
        const productExcerpt = product.excerpt || "";
        const brand = product.brand
          ? (typeof product.brand === "string" ? product.brand : product.brand.name)
          : "Zenvoraa";
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
                return (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    viewMode="grid"
                  />
                );
              } else {
                return (
                  <ShopProductCard
                    key={product.slug}
                    product={mapStaticToShopProduct(product)}
                    viewMode="grid"
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </section>
  );
}
