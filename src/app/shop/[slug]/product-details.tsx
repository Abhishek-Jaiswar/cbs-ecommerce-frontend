"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn, getProductImage } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAppSelector } from "@/store/hooks";
import { useGetProductDetailsQuery } from "@/services/api/products/products-api";
import type { IProductDetails, IVariants } from "@/services/api/products/products-api.types";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cart/cart-api";
import { useGetWishlistQuery, useToggleWishlistItemMutation } from "@/services/api/wishlist/wishlist-api";
import { useGetProductReviewsQuery } from "@/services/api/reviews/reviews-api";
import { formatInr } from "@/components/storefront/zv-product-card";
import { ZvProductGallery, type GalleryImage } from "./_components/zv-product-gallery";
import { Stars, ZvProductSections } from "./_components/zv-product-sections";
import { ZvRelatedProducts } from "./_components/zv-related-products";

const MAX_QTY = 10;
const LOW_STOCK = 5;

export default function ProductDetails({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetProductDetailsQuery(slug);
  const product = data?.data;

  if (isLoading) return <ProductSkeleton />;
  if (isError || !product) return <ProductNotFound />;
  // key: reset selections when navigating between products
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: IProductDetails }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const colors = useMemo(() => product.colors ?? [], [product.colors]);
  const sizes = useMemo(() => product.sizes ?? [], [product.sizes]);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  const matches = (v: IVariants, colorId: string, sizeId: string) =>
    (!colors.length || v.color?.id === colorId) && (!sizes.length || v.size?.id === sizeId);

  // default to the first in-stock combination
  const initial = variants.find((v) => v.stock > 0) ?? variants[0];
  const [colorId, setColorId] = useState(initial?.color?.id ?? colors[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(initial?.size?.id ?? sizes[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [openSections, setOpenSections] = useState<string[]>(["delivery"]);

  const variant = variants.find((v) => matches(v, colorId, sizeId)) ?? null;
  const stock = variant?.stock ?? 0;
  const colorInStock = (id: string) => variants.some((v) => v.color?.id === id && v.stock > 0);
  const sizeInStock = (id: string) => variants.some((v) => matches(v, colorId, id) && v.stock > 0);
  const anyInStock = variants.some((v) => v.stock > 0);

  // ---- gallery: picking a finish jumps to that finish's first photo
  const images: GalleryImage[] = useMemo(() => {
    if (!product.images?.length) return [{ url: getProductImage(product.slug), alt: product.name, colorId: null }];
    return [...product.images]
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || Number(a.position) - Number(b.position))
      .map((img) => ({ url: img.media.url, alt: img.media.altText || product.name, colorId: img.colorId ?? null }));
  }, [product]);
  const [imageIndex, setImageIndex] = useState(() => Math.max(0, images.findIndex((i) => i.colorId === colorId)));

  const pickColor = (id: string) => {
    setColorId(id);
    const i = images.findIndex((img) => img.colorId === id);
    if (i >= 0) setImageIndex(i);
    // keep the size if that combination exists, otherwise move to an in-stock size
    if (sizes.length && !variants.some((v) => matches(v, id, sizeId) && v.stock > 0)) {
      const alt = variants.find((v) => v.color?.id === id && v.stock > 0)?.size?.id;
      if (alt) setSizeId(alt);
    }
  };

  // ---- cart / wishlist
  const { data: cartRes } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const inCart = cartRes?.data?.items?.find((i) => i.variantId === variant?.id)?.quantity ?? 0;
  const maxQty = Math.max(0, Math.min(MAX_QTY, stock - inCart));
  const qty = Math.min(Math.max(1, quantity), Math.max(1, maxQty));

  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const { data: wishRes } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const saved = wishRes?.data?.items?.some((i) => i.product?.id === product.id) ?? false;
  const [toggleWishlist, { isLoading: saving }] = useToggleWishlistItemMutation();

  const goLogin = () => router.push(`/login?redirect=${encodeURIComponent(pathname)}`);

  const handleAdd = async () => {
    if (!isAuthenticated) return goLogin();
    if (!variant || maxQty < 1) return;
    try {
      await addToCart({ variantId: variant.id, quantity: qty }).unwrap();
      trackEvent("add_to_cart", { productId: product.id, variantId: variant.id, quantity: qty, price: variant.price || product.price });
      toast.success(`${product.name} added to cart`, {
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
      setQuantity(1);
    } catch (err) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Couldn’t add to cart. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return goLogin();
    try {
      const res = await toggleWishlist({ productId: product.id }).unwrap();
      toast.success(res.data?.liked ? "Saved to favourites" : "Removed from favourites");
    } catch {
      toast.error("Couldn’t update favourites. Please try again.");
    }
  };

  useEffect(() => {
    trackEvent("view_item", { productId: product.id, name: product.name, price: product.price });
  }, [product.id, product.name, product.price]);

  // ---- price (variant price already has active offers applied by the API)
  const price = Number(variant?.price ?? product.price);
  const mrp = Number(product.originalPrice || 0);
  const discount = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const { data: reviewsRes } = useGetProductReviewsQuery({ productId: product.id, limit: 5 });
  const reviewTotal = reviewsRes?.data?.total ?? 0;
  const average = reviewsRes?.data?.averageRating ?? null;
  const openReviews = () => {
    setOpenSections((o) => (o.includes("reviews") ? o : [...o, "reviews"]));
    requestAnimationFrame(() => document.getElementById("section-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const colorName = colors.find((c) => c.id === colorId)?.name;
  const badgeEls = (
    <>
      {discount > 0 && <span className="rounded-zv-tag bg-zv-gold px-zv-5 py-0.5 text-xs font-bold text-white">{discount}%</span>}
      {product.isNew && <span className="rounded-zv-tag bg-white px-zv-5 py-0.5 text-xs font-bold text-zv-primary">New</span>}
    </>
  );

  const cartLabel = !anyInStock
    ? "Sold Out"
    : !variant
      ? "Unavailable"
    : stock < 1
      ? "Sold Out"
      : maxQty < 1
        ? "All in Cart"
        : "Add to Cart";

  return (
    <main className="flex-1 bg-white font-zv-body">
      <div className="grid lg:grid-cols-2">
        <div className="lg:relative">
          <ZvProductGallery images={images} index={imageIndex} onIndexChange={setImageIndex} badges={badgeEls} />
        </div>

        <div className="flex flex-col px-zv-20 pb-zv-40 pt-zv-30 lg:px-zv-40 lg:pt-[140px] xl:px-[80px]">
          {/* Product information */}
          <div className="flex flex-col gap-zv-10">
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="self-start type-body-lg text-zv-bg2 transition-colors hover:text-zv-primary"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-zv-display text-[30px] italic leading-[1.1] text-zv-ink-brown lg:type-h1 lg:text-zv-ink">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-x-zv-10 gap-y-1">
              {discount > 0 && <span className="type-price-lg font-normal text-zv-ink/50 line-through">{formatInr(mrp)}</span>}
              <span className="type-price-lg text-zv-ink">{formatInr(price)}</span>
              {discount > 0 && <span className="rounded-zv-tag bg-zv-gold px-zv-5 py-0.5 text-xs font-bold text-white">{discount}%</span>}
            </div>
            <p className="type-caption text-zv-bg2">Price inclusive of all taxes</p>

            <button type="button" onClick={openReviews} className="flex items-center gap-1.5 self-start type-caption text-zv-bg2 hover:text-zv-primary">
              {reviewTotal > 0 ? (
                <>
                  <Stars value={average ?? 0} />
                  {average !== null && <span>{average.toFixed(1)}</span>}
                  <span>
                    ({reviewTotal} review{reviewTotal === 1 ? "" : "s"})
                  </span>
                </>
              ) : (
                <span className="underline-offset-4 hover:underline">Be the first to review</span>
              )}
            </button>

            {product.excerpt && <p className="type-body-sm text-zv-ink/80">{product.excerpt}</p>}
          </div>

          {/* Finish */}
          {colors.length > 0 && (
            <fieldset className="mt-zv-30 flex flex-col gap-zv-10">
              <legend className="mb-zv-10 type-body-sm text-zv-bg2">
                Finish: <span className="text-zv-ink">{colorName}</span>
              </legend>
              <div className="flex flex-wrap gap-zv-10">
                {colors.map((c) => {
                  const available = colorInStock(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pickColor(c.id)}
                      aria-pressed={colorId === c.id}
                      aria-label={`${c.name}${available ? "" : " (sold out)"}`}
                      title={c.name}
                      className={cn(
                        "relative size-7 rounded-full border border-black/10 ring-offset-2 transition",
                        colorId === c.id ? "ring-2 ring-zv-primary" : "hover:ring-1 hover:ring-zv-bg2",
                        !available && "opacity-40",
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {!available && <span aria-hidden className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-zv-ink/60" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Size */}
          {sizes.length > 1 && (
            <fieldset className="mt-zv-20 flex flex-col">
              <legend className="mb-zv-10 type-body-sm text-zv-bg2">Size</legend>
              <div className="flex flex-wrap gap-zv-10">
                {sizes.map((s) => {
                  const available = sizeInStock(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      aria-pressed={sizeId === s.id}
                      aria-label={`${s.value}${available ? "" : " (sold out)"}`}
                      className={cn(
                        "h-9 min-w-12 rounded-zv-xs border px-zv-10 text-sm transition-colors",
                        sizeId === s.id ? "border-zv-primary bg-zv-primary text-white" : "border-zv-bg2/50 text-zv-ink hover:border-zv-primary",
                        !available && "text-zv-bg2 line-through",
                      )}
                    >
                      {s.value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Availability + quantity */}
          <div className="mt-zv-20 flex flex-wrap items-center gap-zv-20">
            {variant && stock > 0 && maxQty > 0 && (
              <div className="flex h-11 items-center rounded-zv-xs border border-zv-bg2/50" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQuantity(qty - 1)}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="grid h-full w-10 place-items-center text-zv-ink disabled:opacity-30"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(qty + 1)}
                  disabled={qty >= maxQty}
                  aria-label="Increase quantity"
                  className="grid h-full w-10 place-items-center text-zv-ink disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )}
            <p className="type-body-sm" aria-live="polite">
              {!variants.length || !anyInStock ? (
                <span className="text-zv-hover">Sold out</span>
              ) : !variant ? (
                <span className="text-zv-hover">This combination isn’t available</span>
              ) : stock < 1 ? (
                <span className="text-zv-hover">Sold out in this {sizes.length > 1 ? "size" : "finish"}</span>
              ) : stock <= LOW_STOCK ? (
                <span className="text-zv-primary">Only {stock} left</span>
              ) : (
                <span className="text-zv-bg2">In stock</span>
              )}
              {inCart > 0 && <span className="block text-zv-bg2">{inCart} already in your cart</span>}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-zv-20 grid grid-cols-2 gap-zv-10 sm:max-w-[420px]">
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !variant || maxQty < 1}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-leaf border border-zv-primary bg-zv-primary px-zv-20 type-button text-white transition-colors hover:border-zv-hover hover:bg-zv-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding && <Loader2 className="size-4 animate-spin" />}
              {cartLabel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-pressed={saved}
              className="h-11 rounded-leaf border border-zv-primary bg-white px-zv-10 type-button text-zv-primary transition-colors hover:bg-zv-bg disabled:opacity-60"
            >
              {saved ? "Saved ♥" : "Save to Favourites"}
            </button>
          </div>

          {product.productTags?.length > 0 && (
            <ul className="mt-zv-20 flex flex-wrap gap-1.5" aria-label="Tags">
              {product.productTags.map(({ tag }) => (
                <li key={tag.id}>
                  <Link
                    href={`/shop?tag=${tag.slug}`}
                    className="inline-block rounded-full bg-zv-bg px-zv-10 py-1 text-xs text-zv-hover transition-colors hover:bg-zv-hover hover:text-white"
                  >
                    {tag.name.includes(":") ? tag.name.slice(tag.name.indexOf(":") + 1).trim() : tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-zv-30">
            <ZvProductSections
              productId={product.id}
              description={product.description}
              specifications={product.specification ?? []}
              open={openSections}
              onOpenChange={setOpenSections}
            />
          </div>
        </div>
      </div>

      <ZvRelatedProducts productId={product.id} categorySlug={product.category?.slug} />
    </main>
  );
}

function ProductSkeleton() {
  return (
    <main className="flex-1 bg-white" aria-busy>
      <div className="grid lg:grid-cols-2">
        <div className="h-[590px] max-h-[78svh] animate-pulse bg-zv-image-well lg:h-svh lg:max-h-[1121px]" />
        <div className="flex flex-col gap-zv-20 px-zv-20 pt-zv-30 lg:px-zv-40 lg:pt-[140px] xl:px-[80px]">
          {["w-24", "w-3/4 h-10", "w-40", "w-full h-16", "w-60 h-11"].map((c, i) => (
            <div key={i} className={cn("h-5 animate-pulse rounded-zv-xs bg-zv-bg", c)} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-zv-10 bg-white px-zv-20 pb-zv-40 pt-[160px] text-center font-zv-body">
      <h1 className="type-h2 text-zv-ink-brown">We couldn’t find this piece</h1>
      <p className="type-body-sm text-zv-bg2">It may have sold out or been moved.</p>
      <Link href="/shop" className="mt-zv-10 inline-flex h-11 items-center rounded-leaf bg-zv-primary px-zv-30 type-button text-white hover:bg-zv-hover">
        Shop all jewellery
      </Link>
    </main>
  );
}
