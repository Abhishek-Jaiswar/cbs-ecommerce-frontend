"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetProductDetailsQuery, useGetProductListingQuery } from "@/services/api/products/products-api";
import { getProductImage } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  Package2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCartMutation, useGetCartQuery, useUpdateCartItemQuantityMutation } from "@/services/api/cart/cart-api";
import { useToggleWishlistItemMutation, useGetWishlistQuery } from "@/services/api/wishlist/wishlist-api";
import { useGetProductReviewsQuery, useCreateReviewMutation } from "@/services/api/reviews/reviews-api";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ShopProductCard } from "../_components/shop-product-card";
import { trackEvent } from "@/lib/analytics";

type Params = { slug: string };

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return `₹${price}`;
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

// ─── Image Magnifier ──────────────────────────────────────────────────────────
function ImageMagnifier({ src, alt, zoom = 2.4 }: { src: string; alt: string; zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-square overflow-hidden bg-[#f9f5f0] cursor-crosshair select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={onMove}
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" draggable={false} />
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {!isHovering && (
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-white/90 border border-[#e4dfd7] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#888]">
          <ZoomIn className="h-2.5 w-2.5 text-[#c29958]" />
          Hover to zoom
        </div>
      )}
    </div>
  );
}

// ─── Recommended Products ─────────────────────────────────────────────────────
function RecommendedProducts({ currentProductId, categoryId }: { currentProductId: string; categoryId?: string }) {
  const { data, isLoading } = useGetProductListingQuery({ page: 1, limit: 20 });

  const recommended = useMemo(() => {
    const all = data?.data?.items ?? [];
    const sameCat = all.filter((p) => p.id !== currentProductId && (categoryId ? p.categoryId === categoryId : true));
    const others = all.filter((p) => p.id !== currentProductId && (categoryId ? p.categoryId !== categoryId : false));
    return [...sameCat, ...others].slice(0, 4);
  }, [data, currentProductId, categoryId]);

  if (isLoading) {
    return (
      <div className="mt-10 pt-10 border-t border-[#eee8df]">
        <div className="h-4 w-40 bg-[#f0ebe2] animate-pulse mx-auto mb-8 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-[#f0ebe2] animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!recommended.length) return null;

  return (
    <div className="mt-10 pt-10 border-t border-[#eee8df]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-[#eee8df]" />
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c29958] mb-0.5">Curated For You</p>
          <h2 className="text-lg font-serif font-medium text-[#222222]">You May Also Like</h2>
        </div>
        <div className="h-px flex-1 bg-[#eee8df]" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommended.map((product) => (
          <ShopProductCard key={product.id} product={product} viewMode="grid" />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-[#222222] bg-transparent px-7 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#222222] transition-all duration-300 hover:bg-[#222222] hover:text-white group"
        >
          Explore Full Collection
          <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetails({ slug }: Params) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetProductDetailsQuery(slug);
  const product = data?.data;
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [selectedColorState, setSelectedColorState] = useState<string>("");
  const [selectedSizeState, setSelectedSizeState] = useState<string>("");
  const [activeImgIndexState, setActiveImgIndex] = useState<number | null>(null);
  const [prevVariantId, setPrevVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [imgFading, setImgFading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const selectedColor = selectedColorState || product?.colors?.[0]?.id || "";
  const selectedSize = selectedSizeState || product?.sizes?.[0]?.id || "";

  const setSelectedColor = useCallback((colorId: string) => {
    setSelectedColorState(colorId);
    setActiveImgIndex(null);
  }, []);

  const setSelectedSize = useCallback((sizeId: string) => {
    setSelectedSizeState(sizeId);
  }, []);

  const activeVariant = useMemo(() =>
    product?.variants?.find((v) => v.color?.id === selectedColor && v.size?.id === selectedSize) ?? null,
    [product, selectedColor, selectedSize]
  );

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [updateCartItemQuantity, { isLoading: isUpdatingCart }] = useUpdateCartItemQuantityMutation();
  const { data: cartRes } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [toggleWishlist, { isLoading: isTogglingWishlist }] = useToggleWishlistItemMutation();
  const { data: wishlistRes } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const isWishlisted = wishlistRes?.data?.items?.some((item) => item.product?.id === product?.id) ?? false;

  const { data: reviewsRes, isLoading: isReviewsLoading } = useGetProductReviewsQuery(
    { productId: product?.id ?? "" },
    { skip: !product?.id }
  );
  const reviews = reviewsRes?.data?.items ?? [];
  const reviewsCount = reviewsRes?.data?.total ?? 0;
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();

  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setReviewName((prev) => prev || user.name);
      setReviewEmail((prev) => prev || user.email);
    }
  }, [isAuthenticated, user]);

  // Track view_item event when product loads
  useEffect(() => {
    if (product) {
      trackEvent("view_item", {
        productId: product.id,
        name: product.name,
        price: product.price,
      });
    }
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product?.images?.length)
      return [{ url: getProductImage(slug), altText: product?.name ?? "Jewelry", colorId: null }];
    return product.images.map((img) => ({
      url: img.media.url,
      altText: img.media.altText || product.name,
      colorId: img.colorId,
    }));
  }, [product, slug]);

  const switchImage = useCallback((idx: number) => {
    setImgFading(true);
    setTimeout(() => { setActiveImgIndex(idx); setImgFading(false); }, 160);
  }, []);

  const activeImgIndex = useMemo(() => {
    if (activeImgIndexState !== null) return activeImgIndexState;
    if (!selectedColor) return 0;
    const idx = galleryImages.findIndex((img) => img.colorId === selectedColor);
    return idx !== -1 ? idx : 0;
  }, [activeImgIndexState, selectedColor, galleryImages]);

  const existingCartItem = useMemo(() => {
    if (!cartRes?.data?.items || !activeVariant) return null;
    return cartRes.data.items.find((item) => item.variantId === activeVariant.id);
  }, [cartRes, activeVariant]);

  // Adjust state during render to reset quantity when selected variant changes
  const currentVariantId = activeVariant?.id ?? null;
  if (currentVariantId !== prevVariantId) {
    setPrevVariantId(currentVariantId);
    setQuantity(existingCartItem?.quantity ?? 1);
  }

  const displayPrice = activeVariant ? activeVariant.price : product?.price ?? "0.00";
  const displayOriginalPrice = product?.originalPrice ?? null;
  const discountPercent = useMemo(() => {
    if (!displayOriginalPrice) return 0;
    const p = parseFloat(displayPrice), o = parseFloat(displayOriginalPrice);
    return o > p ? Math.round(((o - p) / o) * 100) : 0;
  }, [displayPrice, displayOriginalPrice]);

  const handleAddToBag = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!activeVariant) return;
    try {
      if (existingCartItem) {
        await updateCartItemQuantity({ cartItemId: existingCartItem.id, quantity }).unwrap();
      } else {
        await addToCart({ variantId: activeVariant.id, quantity }).unwrap();
      }
      trackEvent("add_to_cart", {
        productId: product?.id,
        variantId: activeVariant.id,
        quantity,
        price: activeVariant.price || product?.price,
      });
    }
    catch (err) { console.error("Failed to add to bag", err); }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!product) return;
    try { await toggleWishlist({ productId: product.id }).unwrap(); }
    catch (err) { console.error("Failed to toggle wishlist", err); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!product) return;
    setReviewError("");
    try {
      await createReview({ productId: product.id, rating: reviewRating, comment: reviewComment }).unwrap();
      setReviewSubmitted(true);
      setReviewComment("");
    } catch (err: any) {
      setReviewError(err?.data?.message || "Failed to submit review. You might have already reviewed this product.");
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 bg-[#f9f5f0] py-10 min-h-screen font-(--font-zenvoraa)">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="h-3 bg-[#e8e2d9] w-52 rounded animate-pulse mb-7" />
          <div className="bg-white border border-[#e4dfd7] p-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex gap-2.5">
                <div className="flex flex-col gap-2 w-14">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-14 w-14 bg-[#f0ebe2]" />)}
                </div>
                <div className="flex-1 aspect-square bg-[#f0ebe2]" />
              </div>
              <div className="space-y-4">
                <div className="h-2.5 bg-[#f0ebe2] w-20 rounded" />
                <div className="h-7 bg-[#f0ebe2] w-3/4 rounded" />
                <div className="h-2.5 bg-[#f0ebe2] w-28 rounded" />
                <div className="h-6 bg-[#f0ebe2] w-1/3 rounded" />
                <div className="h-16 bg-[#f0ebe2] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="flex-1 bg-[#f9f5f0] py-24 text-center font-(--font-zenvoraa)">
        <div className="mx-auto max-w-sm px-4">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-serif text-[#222222]">Design Not Found</h2>
          <p className="text-sm text-[#777777] mt-2">We couldn&apos;t find this piece. It may have been archived.</p>
          <Button className="mt-6 bg-[#222222] text-white rounded-none hover:bg-[#c29958] h-10 px-7 text-xs font-bold uppercase tracking-widest" asChild>
            <Link href="/shop">Back to Catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryName = product.category?.name ?? "Collection";
  const brandName = product.brand?.name ?? "ZenVora";
  const selectedColorName = product.colors?.find((c) => c.id === selectedColor)?.name;
  const selectedSizeName = product.sizes?.find((s) => s.id === selectedSize)?.value;
  const isInStock = !!activeVariant && activeVariant.stock > 0;

  return (
    <div className="flex-1 bg-[#f9f5f0] min-h-screen font-(--font-zenvoraa)">
      <div className="mx-auto max-w-[1170px] px-4 py-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#999999] mb-6">
          <Link href="/" className="hover:text-[#c29958] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-[#cccccc]" />
          <Link href="/shop" className="hover:text-[#c29958] transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 text-[#cccccc]" />
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#c29958] transition-colors">
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-[#cccccc]" />
          <span className="text-[#555555] line-clamp-1 max-w-[140px]">{product.name}</span>
        </nav>

        {/* ── Main Card ─────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#e4dfd7] shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0">

            {/* LEFT: Gallery */}
            <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-[#eee8df]">
              <div className="flex gap-2.5">

                {/* Vertical thumbs */}
                {galleryImages.length > 1 && (
                  <div className="flex flex-col gap-2 w-[60px] shrink-0 hidden sm:flex">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => i !== activeImgIndex && switchImage(i)}
                        className={`relative w-[60px] h-[60px] shrink-0 overflow-hidden border-2 transition-all duration-150 bg-[#f9f5f0] ${
                          i === activeImgIndex ? "border-[#c29958]" : "border-transparent hover:border-[#e4dfd7]"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image src={img.url} alt={`${product.name} ${i + 1}`} fill sizes="60px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 z-10 bg-[#c29958] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1">
                        -{discountPercent}% OFF
                      </span>
                    )}
                    {product.isNew && (
                      <span className={`absolute z-10 bg-[#222222] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 ${discountPercent > 0 ? "top-10 left-2.5" : "top-2.5 left-2.5"}`}>
                        New
                      </span>
                    )}
                    <div className={`transition-opacity duration-150 ${imgFading ? "opacity-0" : "opacity-100"}`}>
                      <ImageMagnifier src={galleryImages[activeImgIndex]?.url} alt={galleryImages[activeImgIndex]?.altText || product.name} />
                    </div>
                  </div>

                  {/* Mobile row thumbnails */}
                  {galleryImages.length > 1 && (
                    <div className="flex gap-2 mt-2.5 flex-wrap sm:hidden">
                      {galleryImages.map((img, i) => (
                        <button key={i} onClick={() => i !== activeImgIndex && switchImage(i)} className={`relative w-12 h-12 overflow-hidden border-2 transition-all ${i === activeImgIndex ? "border-[#c29958]" : "border-transparent hover:border-[#e4dfd7]"}`}>
                          <Image src={img.url} alt={`View ${i + 1}`} fill sizes="48px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="p-5 sm:p-7 flex flex-col gap-4">

              {/* Brand + name */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c29958] mb-1.5">{brandName}</p>
                <h1 className="text-[22px] sm:text-2xl font-serif font-medium text-[#222222] leading-snug">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= 5 ? "fill-[#c29958] text-[#c29958]" : "fill-[#ddd] text-[#ddd]"}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#999] font-medium">({reviewsCount} review{reviewsCount !== 1 ? "s" : ""})</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 pb-4 border-b border-[#eee8df]">
                <span className="text-2xl font-bold text-[#222222] tracking-tight">{formatPrice(displayPrice)}</span>
                {displayOriginalPrice && parseFloat(displayOriginalPrice) > parseFloat(displayPrice) && (
                  <>
                    <span className="text-sm text-[#aaa] line-through">{formatPrice(displayOriginalPrice)}</span>
                    <span className="bg-[#c29958]/10 text-[#c29958] border border-[#c29958]/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Excerpt */}
              <p className="text-[13px] text-[#666] leading-relaxed -mt-1">
                {product.excerpt || product.description}
              </p>

              {/* Colour */}
              {product.colors?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#555]">Colour</span>
                    {selectedColorName && <span className="text-[11px] text-[#999]">{selectedColorName}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.id;
                      const isLight = ["#fff", "#ffffff", "#FFF", "#FFFFFF"].includes(color.hex);
                      return (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          title={color.name}
                          aria-pressed={isSelected}
                          className={`relative w-7 h-7 rounded-full transition-all duration-150 flex items-center justify-center ${
                            isSelected ? "ring-2 ring-[#c29958] ring-offset-2 scale-110" : "ring-1 ring-[#ddd] hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <span className={`block w-2 h-2 rounded-full ${isLight ? "bg-[#555]" : "bg-white"}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size */}
              {product.sizes?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#555]">Size</span>
                    {selectedSizeName && <span className="text-[11px] text-[#999]">{selectedSizeName}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        aria-pressed={selectedSize === size.id}
                        className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all duration-150 ${
                          selectedSize === size.id
                            ? "border-[#222] bg-[#222] text-white"
                            : "border-[#e4dfd7] text-[#555] hover:border-[#222] bg-white"
                        }`}
                      >
                        {size.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant status */}
              <div className="bg-[#f9f5f0] border border-[#eee8df] px-4 py-3 flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-bold text-[#777] uppercase tracking-wider">
                    <Package2 className="h-3 w-3" /> SKU
                  </span>
                  <span className="font-mono font-semibold text-[#333]">
                    {activeVariant ? activeVariant.sku : "— Select options —"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#777] uppercase tracking-wider">Availability</span>
                  {activeVariant ? (
                    activeVariant.stock > 0 ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> In Stock ({activeVariant.stock})
                      </span>
                    ) : (
                      <span className="font-bold text-rose-500">Out of Stock</span>
                    )
                  ) : (
                    <span className="text-[#aaa]">Select colour & size</span>
                  )}
                </div>
              </div>

              {/* Qty + Add to bag + Wishlist */}
              <div className="flex gap-2 items-stretch">
                {/* Qty */}
                <div className="flex items-center border border-[#e4dfd7] bg-white h-11 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!activeVariant || !isInStock}
                    className="w-9 h-full flex items-center justify-center text-[#555] hover:bg-[#f9f5f0] hover:text-[#222] transition-colors disabled:opacity-40"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#222] tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(activeVariant?.stock ?? 10, q + 1))}
                    disabled={!activeVariant || !isInStock || quantity >= (activeVariant?.stock ?? 0)}
                    className="w-9 h-full flex items-center justify-center text-[#555] hover:bg-[#f9f5f0] hover:text-[#222] transition-colors disabled:opacity-40"
                    aria-label="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Add to bag */}
                <Button
                  disabled={!activeVariant || !isInStock || isAddingToCart || isUpdatingCart}
                  onClick={handleAddToBag}
                  className="flex-1 bg-[#222222] text-white rounded-none hover:bg-[#c29958] h-11 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                >
                  {isAddingToCart || isUpdatingCart ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isAddingToCart ? "Adding…" : "Updating…"}
                    </span>
                  ) : existingCartItem ? "Update Bag" : "Add to Bag"}
                </Button>

                {/* Wishlist */}
                <button
                  disabled={isTogglingWishlist}
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-500"
                      : "bg-white border-[#e4dfd7] text-[#777] hover:border-[#c29958] hover:text-[#c29958]"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#eee8df]">
                {[
                  { icon: Truck, label: "Free Delivery", sub: "On all orders" },
                  { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle free" },
                  { icon: ShieldCheck, label: "Warranty", sub: "Quality assured" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-3 text-center">
                    <Icon className="h-4 w-4 text-[#c29958]" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#444]">{label}</p>
                      <p className="text-[9px] text-[#aaa] mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {product.productTags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.productTags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/shop?tag=${tag.slug}`}
                      className="text-[9px] font-semibold uppercase tracking-wider text-[#999] border border-[#e4dfd7] px-2 py-0.5 hover:border-[#c29958] hover:text-[#c29958] transition-colors bg-white"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#e4dfd7] shadow-sm mb-8">
          {/* Tab headers */}
          <div className="flex border-b border-[#eee8df] overflow-x-auto">
            {[
              { key: "description", label: "Description" },
              { key: "specifications", label: "Specifications" },
              { key: "reviews", label: `Reviews (${reviewsCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 -mb-px transition-all duration-200 ${
                  activeTab === tab.key
                    ? "border-[#c29958] text-[#222]"
                    : "border-transparent text-[#999] hover:text-[#555] hover:border-[#ddd]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-8">
            {/* Description */}
            {activeTab === "description" && (
              <div className="max-w-2xl">
                <p className="text-sm text-[#555] leading-relaxed font-light">{product.description}</p>
                <p className="mt-4 text-xs text-[#aaa] italic border-l-2 border-[#eee8df] pl-3">
                  Note: All weights and measurements are approximate and may vary slightly.
                </p>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div className="max-w-lg">
                {product.specification?.length > 0 ? (
                  <table className="w-full text-xs border border-[#eee8df]">
                    <tbody>
                      {product.specification.map((spec, idx) => (
                        <tr key={spec.id} className={`border-b border-[#eee8df] ${idx % 2 === 0 ? "bg-[#f9f5f0]" : "bg-white"}`}>
                          <td className="px-4 py-2.5 font-bold uppercase tracking-wider text-[#555] w-2/5">{spec.key}</td>
                          <td className="px-4 py-2.5 text-[#666]">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-[#aaa] italic">No specifications provided for this piece.</p>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
                {/* List */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-[#555] uppercase tracking-wider">
                    {reviewsCount} Review{reviewsCount !== 1 ? "s" : ""} for{" "}
                    <span className="font-serif italic text-[#c29958] normal-case">&quot;{product.name}&quot;</span>
                  </h3>

                  {isReviewsLoading ? (
                    <div className="space-y-4 animate-pulse">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="h-8 w-8 bg-[#f0ebe2] rounded-full shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-2.5 bg-[#f0ebe2] w-1/3 rounded" />
                            <div className="h-2.5 bg-[#f0ebe2] w-full rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-5">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="flex gap-3 border-b border-[#f0ebe2] pb-5 last:border-0">
                          <div className="h-8 w-8 bg-[#c29958]/15 text-[#c29958] font-bold rounded-full flex items-center justify-center shrink-0 text-xs">
                            {(rev.user?.name || "A")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#333]">{rev.user?.name || "Customer"}</span>
                              <span className="text-[9px] text-[#bbb]">·</span>
                              <span className="text-[10px] text-[#aaa]">
                                {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`h-2.5 w-2.5 ${s <= rev.rating ? "fill-[#c29958] text-[#c29958]" : "fill-[#ddd] text-[#ddd]"}`} />
                              ))}
                            </div>
                            <p className="text-xs text-[#666] leading-relaxed mt-0.5">{rev.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#aaa] italic">No reviews yet — be the first to share your experience!</p>
                  )}

                  {reviewSubmitted && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2.5 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Your review has been submitted. Thank you!
                    </div>
                  )}
                  {reviewError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2.5 text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {reviewError}
                    </div>
                  )}
                </div>

                {/* Write review form */}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5 border-l border-[#eee8df] md:pl-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#555] mb-1">Write a Review</h3>

                  {/* Star rating */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-[#aaa] uppercase tracking-wider">Your Rating *</label>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} type="button"
                          onMouseEnter={() => setHoveredStar(s)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setReviewRating(s)}
                          className="w-7 h-7 flex items-center justify-center"
                        >
                          <Star className={`w-4 h-4 transition-colors ${s <= (hoveredStar || reviewRating) ? "fill-[#c29958] text-[#c29958]" : "fill-[#ddd] text-[#ddd]"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {[
                    { label: "Your Name *", type: "text", value: reviewName, onChange: setReviewName, placeholder: "Full name" },
                    { label: "Your Email *", type: "email", value: reviewEmail, onChange: setReviewEmail, placeholder: "your@email.com" },
                  ].map(({ label, type, value, onChange, placeholder }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#aaa] uppercase tracking-wider">{label}</label>
                      <input
                        type={type} required value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="border border-[#e4dfd7] bg-[#f9f5f0] px-3 py-2 text-xs text-[#333] outline-none focus:border-[#c29958] transition-colors rounded-none placeholder:text-[#bbb]"
                      />
                    </div>
                  ))}

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-[#aaa] uppercase tracking-wider">Your Review *</label>
                    <textarea
                      rows={4} required value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience…"
                      className="border border-[#e4dfd7] bg-[#f9f5f0] px-3 py-2 text-xs text-[#333] outline-none focus:border-[#c29958] transition-colors resize-none rounded-none placeholder:text-[#bbb]"
                    />
                  </div>

                  <button
                    type="submit" disabled={isSubmittingReview}
                    className="bg-[#222] hover:bg-[#c29958] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 transition-all duration-300 disabled:opacity-50 mt-0.5"
                  >
                    {isSubmittingReview ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ── Recommended Products ──────────────────────────────────────────── */}
        <RecommendedProducts currentProductId={product.id} categoryId={product.category?.id} />
      </div>
    </div>
  );
}
