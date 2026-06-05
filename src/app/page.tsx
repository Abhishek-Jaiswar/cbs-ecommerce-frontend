"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetProductListingQuery } from "@/services/api/products/products-api";
import { ArrowRight, Star, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/lib/utils";

const collections = [
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
    tagline: "Elegant wristwear",
  },
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    tagline: "Eternal bands of light",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    tagline: "Timeless neckpieces",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80",
    tagline: "Stunning ear adornments",
  },
];

export default function LandingPage() {
  const { data, isLoading } = useGetProductListingQuery({ page: 1, limit: 10 });
  const products = data?.data.items ?? [];
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="flex-1 bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-stone-950 flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop"
            alt="ZenVora Luxury Jewelry Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 text-white">
          <div className="max-w-2xl flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 self-start">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                The Heritage Collection
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-50 leading-[1.1]">
              Crafting Pure <span className="text-amber-500">Brilliance</span> For Your Moments
            </h1>
            <p className="text-base sm:text-lg text-stone-300 max-w-lg leading-relaxed font-light">
              Explore ZenVora's curated line of premium, ethically sourced diamond rings, sterling silver bracelets, and gold neckpieces built to stand the test of time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button size="lg" className="bg-amber-500 text-stone-950 hover:bg-amber-400 text-sm font-semibold tracking-wide h-12 px-8 rounded-none transition-all duration-300" asChild>
                <Link href="/shop">
                  Discover Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-stone-500 text-stone-50 hover:bg-stone-800 hover:text-white text-sm font-semibold tracking-wide h-12 px-8 rounded-none transition-all duration-300" asChild>
                <Link href="/shop?tag=new">
                  New Arrivals
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY BADGES */}
      <section className="border-y border-stone-100 bg-stone-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Certified Craftsmanship</h4>
                <p className="text-xs text-stone-500 mt-1">Every design is created by master craftsmen with premium quality metals.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Lifetime Warranty</h4>
                <p className="text-xs text-stone-500 mt-1">We stand by our stones. Full repair and sizing support on all premium releases.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Ethically Sourced</h4>
                <p className="text-xs text-stone-500 mt-1">Conflict-free diamonds and sustainably gathered gems from approved reserves.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED COLLECTIONS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Shop by Category
            </h2>
            <div className="mx-auto mt-2 h-[2px] w-16 bg-amber-500" />
            <p className="mt-4 text-stone-500 text-sm max-w-md mx-auto">
              Curated jewelry lines representing the heights of design and precious metal excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/shop?category=${col.slug}`}
                className="group relative h-96 overflow-hidden bg-stone-100 block transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                    {col.tagline}
                  </span>
                  <h3 className="text-xl font-bold tracking-wide mt-1">{col.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-300 mt-3 font-semibold group-hover:text-amber-300 transition-colors">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED AD SECTION */}
      <section className="relative h-[50vh] bg-stone-900 flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
            alt="Luxury background banner"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative max-w-xl px-4 z-10 flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Limited Offer</span>
          <h2 className="text-3xl sm:text-4xl leading-tight">Dazzle in Gold & Diamonds</h2>
          <p className="text-sm text-stone-300 leading-relaxed font-light">
            Enjoy up to 25% off during our spring solstice catalog showcase. Receive a complimentary diamond polishing cloth with every order over $500.
          </p>
          <Button size="lg" className="bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold rounded-none self-center px-8 mt-2 transition-all duration-300" asChild>
            <Link href="/shop">
              Shop The Sale
            </Link>
          </Button>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                Featured Highlights
              </h2>
              <div className="mt-2 h-[2px] w-16 bg-amber-500 mx-auto sm:mx-0" />
            </div>
            <Button variant="link" className="text-amber-600 hover:text-amber-700 text-sm font-semibold tracking-wide mt-4 sm:mt-0" asChild>
              <Link href="/shop" className="flex items-center gap-1.5">
                View Entire Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-stone-200 h-80 w-full" />
                  <div className="h-4 bg-stone-200 w-1/3 rounded" />
                  <div className="h-6 bg-stone-200 w-3/4 rounded" />
                  <div className="h-4 bg-stone-200 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(
                      ((parseFloat(product.originalPrice) - parseFloat(product.price)) /
                        parseFloat(product.originalPrice)) *
                        100
                    )
                  : 0;

                const primaryImage = getProductImage(product.slug);

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-stone-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300"
                  >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {product.isNew && (
                        <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          New
                        </span>
                      )}
                      {product.originalPrice && discount > 0 && (
                        <span className="bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 gap-2">
                      <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest">
                        ZenVora Luxury
                      </span>
                      <h3 className="text-base text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                        <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {product.excerpt}
                      </p>

                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span className="text-[10px] text-stone-400 ml-1">(1 review)</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-auto pt-3 border-t border-stone-100">
                        <span className="text-base font-bold text-stone-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="w-full text-center py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-amber-500 hover:text-stone-950 transition-colors mt-auto block"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
