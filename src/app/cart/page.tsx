"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetCartQuery,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/services/api/cart/cart-api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Cart API hooks
  const {
    data: cartRes,
    isLoading,
    isError,
    refetch,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateQuantity, { isLoading: isUpdating }] =
    useUpdateCartItemQuantityMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const cart = cartRes?.data;
  const items = cart?.items ?? [];

  // Subtotal Calculation
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.variant.price);
    return acc + price * item.quantity;
  }, 0);

  // Shipping Calculation (Free over ₹2000, otherwise ₹25)
  const shippingThreshold = 2000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 25;

  // Tax Calculation (Estimated 0%)
  const taxRate = 0.0;
  const taxCost = subtotal * taxRate;

  // Grand Total
  const total = subtotal + shippingCost + taxCost;

  const handleQuantityChange = async (
    itemId: string,
    currentQty: number,
    change: number,
  ) => {
    const newQty = currentQty + change;
    try {
      await updateQuantity({ cartItemId: itemId, quantity: newQty }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId).unwrap();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
    } catch (err) {
      console.error("Failed to clear cart", err);
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
          <p className="text-sm text-stone-500 italic">
            Preparing your shopping bag...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
          <div className="bg-rose-50 h-16 w-16 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 font-bold">
            Failed to load bag
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            There was an issue fetching your shopping cart details. Make sure
            your local servers are running.
          </p>
          <Button
            onClick={refetch}
            variant="outline"
            className="border-stone-300 hover:border-stone-950 font-bold"
          >
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
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 font-medium">
            Your shopping bag is empty
          </h2>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            Explore our curated catalog of masterfully crafted jewelry and add
            items to your collection.
          </p>
          <Button
            asChild
            className="bg-stone-950 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 w-full py-6 font-bold uppercase tracking-wider text-xs transition-colors duration-200"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif text-stone-900 font-medium mb-10 text-center sm:text-left">
          Your Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CART LIST SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 shadow-sm p-6 space-y-6">
              {items.map((item) => {
                const product = item.variant.product;
                const imageSrc =
                  product.images && product.images.length > 0
                    ? product.images[0].media.url
                    : "/placeholder-item.jpg";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-stone-100 last:border-b-0 last:pb-0"
                  >
                    {/* Item Info */}
                    <div className="flex gap-4 items-center">
                      <div className="relative h-20 w-20 bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="font-serif text-stone-900 font-medium hover:text-amber-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-stone-400 font-mono uppercase tracking-wide">
                          SKU: {item.variant.sku}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-stone-500 font-semibold uppercase tracking-wider mt-1">
                          {item.variant.color && (
                            <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 border border-stone-100">
                              {item.variant.color.hex && (
                                <span
                                  className="w-3 h-3 rounded-full border border-stone-200 shrink-0"
                                  style={{ backgroundColor: item.variant.color.hex }}
                                />
                              )}
                              <span>Color: {item.variant.color.name}</span>
                            </span>
                          )}
                          {item.variant.size && (
                            <span className="bg-stone-50 px-2 py-0.5 border border-stone-100">
                              Size: {item.variant.size.value}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 bg-stone-50 h-9 shrink-0">
                        <button
                          disabled={item.quantity <= 1 || isUpdating}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, -1)
                          }
                          className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-150 transition-colors disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-stone-800 flex items-center justify-center">
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-500" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          disabled={
                            item.quantity >= item.variant.stock || isUpdating
                          }
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity, 1)
                          }
                          className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-150 transition-colors disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price total */}
                      <div className="text-right">
                        <span className="block font-medium text-stone-900 text-sm">
                          ₹
                          {(
                            parseFloat(item.variant.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          ₹{parseFloat(item.variant.price).toFixed(2)} each
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CLEAR CART OPTION */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-xs text-stone-500 hover:text-stone-950 font-bold uppercase tracking-wider gap-2 rounded-none"
              >
                <Trash2 size={14} />
                Clear shopping bag
              </Button>
            </div>
          </div>

          {/* TOTALS SUMMARY SECTION */}
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 shadow-sm p-6 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 border border-emerald-100">
                      Complimentary
                    </span>
                  ) : (
                    <span className="font-semibold text-stone-900">
                      ₹{shippingCost.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-stone-900">
                    ₹{taxCost.toFixed(2)}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-stone-400 italic pt-1">
                    Add ₹{(shippingThreshold - subtotal).toFixed(2)} more to
                    unlock complimentary delivery.
                  </p>
                )}
              </div>

              <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900 uppercase">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-stone-900">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <Button
                asChild
                disabled={isUpdating || isRemoving || isClearing}
                className="w-full bg-stone-950 text-white rounded-none hover:bg-amber-500 hover:text-stone-950 py-6 font-bold uppercase tracking-widest text-xs gap-2 transition-colors duration-200 shadow-sm disabled:opacity-50"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>

            {/* TRUST BADGES */}
            <div className="bg-stone-50 border border-stone-200 p-6 space-y-4 text-[10px] text-stone-500 uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-stone-400 shrink-0" />
                <span>Complimentary Shipping over ₹2000</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-stone-400 shrink-0" />
                <span>Complimentary 30-day returns</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-stone-400 shrink-0" />
                <span>100% Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
