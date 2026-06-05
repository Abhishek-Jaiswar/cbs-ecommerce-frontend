"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "@/services/api/wishlist/wishlist-api";
import { useAddToCartMutation } from "@/services/api/cart/cart-api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Heart,
  Eye,
  Plus,
} from "lucide-react";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  price: string;
  variants?: Array<{ id: string; sku: string; stock: number }>;
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // API hooks
  const { data: wishlistRes, isLoading, isError, refetch } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [removeItem, { isLoading: isRemoving }] = useRemoveWishlistItemMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const wishlist = wishlistRes?.data;
  const items = wishlist?.items ?? [];

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId).unwrap();
    } catch (err) {
      console.error("Failed to remove wishlist item", err);
    }
  };

  const handleAddToBag = async (product: WishlistProduct) => {
    // Check if product has variants
    if (!product.variants || product.variants.length === 0) {
      // If no pre-generated variants, redirect to product details
      router.push(`/shop/${product.slug}`);
      return;
    }

    // Add the first available variant to the cart
    const primaryVariant = product.variants[0];
    try {
      await addToCart({ variantId: primaryVariant.id, quantity: 1 }).unwrap();
      // Optionally redirect or show success toast (navbar count will update automatically)
    } catch (err) {
      console.error("Failed to add wishlisted item to bag", err);
      // Fallback: redirect to product page
      router.push(`/shop/${product.slug}`);
    }
  };

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="text-sm text-stone-500 italic">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
          <div className="bg-rose-50 h-16 w-16 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 font-bold">Failed to load wishlist</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            There was an issue fetching your wishlist collection. Make sure the backend server is active.
          </p>
          <Button onClick={refetch} variant="outline" className="border-stone-300 hover:border-stone-950 font-bold">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6 bg-white border border-stone-200 p-10 shadow-sm">
          <div className="h-16 w-16 bg-stone-50 flex items-center justify-center text-stone-400 mx-auto border border-stone-100">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">Your Wishlist is empty</h2>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            Keep track of masterfully designed jewelry. Save your favorite rings, earrings, and pendants here.
          </p>
          <Button asChild className="bg-stone-950 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 w-full py-6 font-bold uppercase tracking-wider text-xs transition-colors duration-200">
            <Link href="/shop">Start Exploring</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif text-stone-900 font-medium mb-10 text-center sm:text-left">
          My Wishlist Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const product = item.product;
            const imageSrc =
              product.images && product.images.length > 0
                ? product.images[0].media.url
                : "/placeholder-item.jpg";

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200 shadow-sm group flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full bg-stone-50 overflow-hidden border-b border-stone-100">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white text-stone-800 hover:bg-amber-500 hover:text-stone-950 h-10 w-10 shadow-md"
                    >
                      <Link href={`/shop/${product.slug}`} title="View Product">
                        <Eye size={16} />
                      </Link>
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={isRemoving}
                      onClick={() => handleRemoveItem(item.id)}
                      className="rounded-full bg-white text-stone-800 hover:bg-rose-500 hover:text-white h-10 w-10 shadow-md"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="font-serif text-stone-900 text-base font-medium hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-stone-400 font-light line-clamp-2">
                      {product.excerpt || "No description provided."}
                    </p>
                    <p className="font-serif text-amber-600 font-semibold pt-1">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Add to Bag Shortcut Button */}
                  <Button
                    onClick={() => handleAddToBag(product)}
                    disabled={isAddingToCart}
                    className="w-full bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white rounded-none py-5 font-bold uppercase tracking-wider text-[10px] gap-2 transition-colors duration-200"
                  >
                    <Plus size={12} />
                    Add to Bag
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
