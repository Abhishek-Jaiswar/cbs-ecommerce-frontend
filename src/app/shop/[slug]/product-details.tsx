"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetProductDetailsQuery } from "@/services/api/products/products-api";
import { getProductImage } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Params = {
  slug: string;
};

export default function ProductDetails({ slug }: Params) {
  const { data, isLoading, isError } = useGetProductDetailsQuery(slug);
  const product = data?.data;

  // Selected state
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Initialize selected values
  useEffect(() => {
    if (product) {
      if (product.colors?.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0].id);
      }
      if (product.sizes?.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0].id);
      }
    }
  }, [product, selectedColor, selectedSize]);

  // Construct gallery images
  const galleryImages = useMemo(() => {
    if (!product || !product.images || product.images.length === 0) {
      return [{ url: getProductImage(slug), altText: product?.name ?? "Jewelry", colorId: null }];
    }
    return product.images.map((img) => ({
      url: img.media.url,
      altText: img.media.altText || product.name,
      colorId: img.colorId,
    }));
  }, [product, slug]);

  // Auto switch image when color changes
  useEffect(() => {
    if (selectedColor) {
      const idx = galleryImages.findIndex((img) => img.colorId === selectedColor);
      if (idx !== -1) {
        setActiveImgIndex(idx);
      }
    }
  }, [selectedColor, galleryImages]);

  // Find matching variant
  const activeVariant = useMemo(() => {
    if (!product || !product.variants) return null;
    return product.variants.find(
      (v) => v.color?.id === selectedColor && v.size?.id === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Pricing calculations
  const displayPrice = activeVariant ? activeVariant.price : product?.price ?? "0.00";
  const displayOriginalPrice = product?.originalPrice ?? null;
  const isSale = product?.isSale ?? false;

  const discountPercent = useMemo(() => {
    if (!displayOriginalPrice) return 0;
    const priceVal = parseFloat(displayPrice);
    const origVal = parseFloat(displayOriginalPrice);
    if (origVal > priceVal) {
      return Math.round(((origVal - priceVal) / origVal) * 100);
    }
    return 0;
  }, [displayPrice, displayOriginalPrice]);

  // Handle Review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewComment) {
      alert("Please fill in all fields.");
      return;
    }
    setReviewSubmitted(true);
    // Reset fields
    setReviewName("");
    setReviewEmail("");
    setReviewComment("");
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-stone-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-stone-200 w-1/4 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <div className="bg-stone-200 aspect-square w-full rounded" />
              <div className="flex gap-4">
                <div className="bg-stone-200 h-20 w-20 rounded" />
                <div className="bg-stone-200 h-20 w-20 rounded" />
                <div className="bg-stone-200 h-20 w-20 rounded" />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="h-4 bg-stone-200 w-1/3 rounded" />
              <div className="h-10 bg-stone-200 w-3/4 rounded" />
              <div className="h-4 bg-stone-200 w-1/2 rounded" />
              <div className="h-24 bg-stone-200 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex-1 bg-stone-50 py-20 text-center">
        <div className="mx-auto max-w-md px-4">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-stone-800">Design Not Found</h2>
          <p className="text-sm text-stone-500 mt-2">
            We couldn't retrieve the details for this item. It might have been cataloged under a different name or archived.
          </p>
          <Button className="bg-stone-900 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 mt-6" asChild>
            <Link href="/shop">Back to Catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryName = product.category?.name ?? "Collection";
  const brandName = product.brand?.name ?? "ZenVora";
  const brandLogo = product.brand?.image ?? "https://res.cloudinary.com/demo/image/upload/v12345678/zenvora-logo.png";

  const reviewsCount = 1; // Default stub reviews count

  return (
    <div className="flex-1 bg-stone-50 py-10 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-8 justify-center sm:justify-start">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-amber-600 transition-colors">
                {categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-stone-600 line-clamp-1">{product.name}</span>
        </nav>

        {/* TWO-COLUMN DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 bg-white border border-stone-200 p-6 sm:p-10 shadow-sm mb-12">
          
          {/* LEFT COLUMN: GALLERY */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-stone-50 overflow-hidden border border-stone-100 flex items-center justify-center">
              <Image
                src={galleryImages[activeImgIndex]?.url}
                alt={galleryImages[activeImgIndex]?.altText || product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider px-3 py-1">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-20 h-20 overflow-hidden border bg-stone-50 transition-all duration-150 ${
                      i === activeImgIndex ? "border-amber-500 scale-105" : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} detail view ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PURCHASE OPTIONS */}
          <div className="flex flex-col gap-6">
            
            {/* Header / Brand */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                {brandName}
              </span>
              <h1 className="text-3xl font-serif text-stone-900 font-medium leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <span className="text-xs text-stone-400 font-medium">({reviewsCount} customer review)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-stone-200">
              <span className="text-3xl font-bold text-stone-900">
                ${displayPrice}
              </span>
              {displayOriginalPrice && parseFloat(displayOriginalPrice) > parseFloat(displayPrice) && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    ${displayOriginalPrice}
                  </span>
                  <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 font-bold text-xs rounded-none px-2 py-0.5">
                    Save {discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description Excerpt */}
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              {product.description || product.excerpt}
            </p>

            {/* COLOR SELECTOR */}
            {product.colors?.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  Selected Color: <span className="font-light text-stone-500">{product.colors.find(c => c.id === selectedColor)?.name}</span>
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      title={color.name}
                      className={`relative w-8 h-8 rounded-full border transition-all duration-150 flex items-center justify-center ${
                        selectedColor === color.id
                          ? "border-stone-900 ring-2 ring-stone-900/10 scale-110"
                          : "border-stone-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.id && (
                        <span className={`block w-2.5 h-2.5 rounded-full ${
                          color.hex === "#FFFFFF" || color.hex.toLowerCase() === "#fff" ? "bg-stone-900" : "bg-white"
                        }`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE SELECTOR */}
            {product.sizes?.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  Size: <span className="font-light text-stone-500">{product.sizes.find(s => s.id === selectedSize)?.value}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-colors duration-150 rounded-none ${
                        selectedSize === size.id
                          ? "border-stone-950 bg-stone-950 text-white"
                          : "border-stone-300 text-stone-600 hover:border-stone-950"
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC VARIANT PREVIEW */}
            <div className="bg-stone-50 border border-stone-200 p-4 flex flex-col gap-1.5 text-xs text-stone-600 mt-2">
              <div className="flex justify-between">
                <span className="font-bold">Variant SKU:</span>
                <span className="font-mono text-stone-900">{activeVariant ? activeVariant.sku : "SELECT DETAILS"}</span>
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="font-bold">Availability:</span>
                {activeVariant ? (
                  activeVariant.stock > 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} className="fill-emerald-100" />
                      In Stock ({activeVariant.stock} available)
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold">Out of Stock</span>
                  )
                ) : (
                  <span className="text-stone-400 font-bold">Select color & size above</span>
                )}
              </div>
            </div>

            {/* QUANTITY & ADD TO CART */}
            <div className="flex gap-4 items-center mt-4">
              <div className="flex items-center border border-stone-300 bg-stone-50 h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!activeVariant || activeVariant.stock <= 0}
                  className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-sm text-stone-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => {
                    const maxStock = activeVariant?.stock ?? 10;
                    return Math.min(maxStock, q + 1);
                  })}
                  disabled={!activeVariant || activeVariant.stock <= 0 || quantity >= (activeVariant?.stock ?? 0)}
                  className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button
                disabled={!activeVariant || activeVariant.stock <= 0}
                onClick={() => alert(`Added ${quantity} units of SKU ${activeVariant?.sku} to cart`)}
                className="flex-1 bg-stone-950 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 h-12 text-xs font-bold uppercase tracking-widest transition-colors duration-200"
              >
                Add to Bag
              </Button>
            </div>

            {/* TRUST MARKS */}
            <div className="grid grid-cols-3 gap-4 border-t border-stone-200 pt-6 mt-4 text-[10px] text-stone-500 uppercase tracking-widest text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="h-4 w-4 text-stone-400" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-stone-400" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-stone-400" />
                <span>Lifetime Warranty</span>
              </div>
            </div>

          </div>
        </div>

        {/* TABS SECTION */}
        <div className="bg-white border border-stone-200 p-6 sm:p-10 shadow-sm">
          {/* Tab headers */}
          <div className="flex gap-2 border-b border-stone-200 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === "description"
                  ? "border-amber-500 text-stone-900 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === "specifications"
                  ? "border-amber-500 text-stone-900 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === "reviews"
                  ? "border-amber-500 text-stone-900 font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Reviews ({reviewsCount})
            </button>
          </div>

          {/* Tab content */}
          <div className="text-stone-600 text-sm leading-relaxed font-light">
            
            {/* Description tab */}
            {activeTab === "description" && (
              <div className="max-w-3xl flex flex-col gap-4">
                <p>{product.description}</p>
                <p className="italic text-stone-400 mt-2">
                  Please note that all weights and measurements are approximate and may vary slightly from the listed information.
                </p>
              </div>
            )}

            {/* Specifications tab */}
            {activeTab === "specifications" && (
              <div className="max-w-md">
                {product.specification?.length > 0 ? (
                  <table className="w-full border border-stone-200 text-xs">
                    <tbody>
                      {product.specification.map((spec) => (
                        <tr key={spec.id} className="border-b border-stone-200">
                          <td className="px-4 py-3 font-bold text-stone-700 bg-stone-50 w-1/3 uppercase tracking-wider">
                            {spec.key}
                          </td>
                          <td className="px-4 py-3 text-stone-600">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-stone-400 italic">No technical specifications provided.</p>
                )}
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
                {/* Review List */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wide">
                    {reviewsCount} customer review for <span className="font-serif italic text-amber-600">"{product.name}"</span>
                  </h3>
                  
                  <div className="flex gap-4 border-b border-stone-100 pb-6">
                    <div className="h-10 w-10 bg-amber-100 text-amber-700 font-bold rounded-full flex items-center justify-center shrink-0 text-sm">
                      A
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                      </div>
                      <p className="text-xs text-stone-400">
                        <span className="font-bold text-stone-700">admin</span> – June 3, 2026
                      </p>
                      <p className="text-sm text-stone-600 mt-1 font-light leading-relaxed">
                        Exquisite craftsmanship and premium weight. The infinity loop has a stunning high-polish finish. Highly recommended!
                      </p>
                    </div>
                  </div>

                  {reviewSubmitted && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      Thank you! Your review has been submitted for approval by our gemologists.
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 border-l border-stone-200 md:pl-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Write a Review
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Your Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className={`w-7 h-7 transition-colors ${
                            s <= reviewRating ? "text-amber-500" : "text-stone-300"
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="border border-stone-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-stone-50 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      className="border border-stone-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-stone-50 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Your Review *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="border border-stone-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none bg-stone-50 text-stone-800"
                    />
                  </div>

                  <button type="submit" className="bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-none transition-colors duration-200 mt-2">
                    Submit Review
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
