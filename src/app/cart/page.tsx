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

interface QuantitySelectorProps {
  itemId: string;
  quantity: number;
  stock: number;
  isUpdating: boolean;
  onUpdate: (itemId: string, newQty: number) => void;
}

function QuantitySelector({ itemId, quantity, stock, isUpdating, onUpdate }: QuantitySelectorProps) {
  const [val, setVal] = React.useState(String(quantity));

  React.useEffect(() => {
    setVal(String(quantity));
  }, [quantity]);

  const handleBlur = () => {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) {
      parsed = 1;
    } else if (parsed > stock) {
      parsed = stock;
    }
    setVal(String(parsed));
    if (parsed !== quantity) {
      onUpdate(itemId, parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center border border-stone-200 bg-stone-50 h-8 shrink-0">
      <button
        type="button"
        disabled={quantity <= 1 || isUpdating}
        onClick={() => {
          const next = quantity - 1;
          setVal(String(next));
          onUpdate(itemId, next);
        }}
        className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus size={11} />
      </button>
      {isUpdating ? (
        <div className="w-8 h-full flex items-center justify-center bg-transparent">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-500" />
        </div>
      ) : (
        <input
          type="text"
          value={val}
          onChange={(e) => {
            const inputVal = e.target.value;
            if (/^\d*$/.test(inputVal)) {
              setVal(inputVal);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-8 h-full text-center text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none font-mono"
        />
      )}
      <button
        type="button"
        disabled={quantity >= stock || isUpdating}
        onClick={() => {
          const next = quantity + 1;
          setVal(String(next));
          onUpdate(itemId, next);
        }}
        className="w-8 h-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus size={11} />
      </button>
    </div>
  );
}

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

  const handleQuantityChange = async (itemId: string, newQty: number) => {
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

  const percent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - subtotal;

  return (
    <div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-serif text-stone-850 font-medium tracking-wide">
            Your Shopping Bag
          </h1>
          <p className="mt-2 text-xs text-stone-400 uppercase tracking-widest font-semibold">
            {items.length} {items.length === 1 ? "Item" : "Items"} in your collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CART LIST SECTION */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-white border border-stone-100 p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-3">
                {remaining > 0 ? (
                  <span className="text-stone-600">
                    Add <span className="text-[#c29958] font-bold">₹{remaining.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> more to unlock complimentary delivery
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    🎉 You qualify for complimentary delivery!
                  </span>
                )}
                <span className="text-stone-400 font-mono text-[10px]">{Math.round(percent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-[#c29958] transition-all duration-500 ease-out" 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item) => {
                const product = item.variant.product;
                const imageSrc =
                  product.images && product.images.length > 0
                    ? product.images[0].media.url
                    : "/placeholder-item.jpg";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-5 border border-stone-100 bg-white hover:border-stone-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-all duration-300"
                  >
                    {/* Item Info */}
                    <div className="flex gap-4 items-center">
                      <div className="relative h-24 w-24 bg-[#faf8f5] border border-stone-100 overflow-hidden shrink-0">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="font-serif text-stone-850 font-medium hover:text-[#c29958] transition-colors line-clamp-1 text-base leading-snug"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                          SKU: {item.variant.sku}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-stone-500 font-semibold uppercase tracking-wider mt-2">
                          {item.variant.color && (
                            <span className="flex items-center gap-1.5 bg-stone-50/80 px-2.5 py-1 border border-stone-100/60">
                              {item.variant.color.hex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-stone-200 shadow-sm shrink-0"
                                  style={{ backgroundColor: item.variant.color.hex }}
                                />
                              )}
                              <span>Color: {item.variant.color.name}</span>
                            </span>
                          )}
                          {item.variant.size && (
                            <span className="bg-stone-50/80 px-2.5 py-1 border border-stone-100/60">
                              Size: {item.variant.size.value}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-100">
                      {/* Quantity Selector */}
                      <QuantitySelector
                        itemId={item.id}
                        quantity={item.quantity}
                        stock={item.variant.stock}
                        isUpdating={isUpdating}
                        onUpdate={handleQuantityChange}
                      />

                      {/* Price total */}
                      <div className="text-right min-w-[90px]">
                        <span className="block font-bold text-stone-800 text-sm tracking-wide">
                          ₹
                          {(
                            parseFloat(item.variant.price) * item.quantity
                          ).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          ₹{parseFloat(item.variant.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                        className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-2 transition-all duration-200"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CLEAR CART OPTION */}
            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-xs text-stone-400 hover:text-stone-800 font-bold uppercase tracking-wider gap-2 rounded-none hover:bg-transparent"
              >
                <Trash2 size={14} />
                Clear shopping bag
              </Button>
            </div>
          </div>

          {/* TOTALS SUMMARY SECTION */}
          <div className="space-y-6">
            <div className="bg-white border border-stone-105 p-6 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 font-serif">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-xs text-stone-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-800">
                    ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[9px] bg-emerald-50 px-2.5 py-0.5 border border-emerald-100/60">
                      Complimentary
                    </span>
                  ) : (
                    <span className="font-bold text-stone-800">
                      ₹{shippingCost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-stone-800">
                    ₹{taxCost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-stone-400 italic pt-1 leading-normal">
                    Add ₹{remaining.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more to unlock complimentary delivery.
                  </p>
                )}
              </div>

              <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-stone-900 tracking-wide">
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <Button
                asChild
                disabled={isUpdating || isRemoving || isClearing}
                className="group/btn w-full bg-stone-900 text-white rounded-none hover:bg-[#c29958] hover:text-white py-6 font-bold uppercase tracking-widest text-xs gap-2 transition-all duration-300 shadow-sm disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </Link>
              </Button>
            </div>

            {/* TRUST BADGES */}
            <div className="bg-white border border-stone-100 p-6 space-y-4 text-[9px] font-semibold text-stone-400 uppercase tracking-widest leading-relaxed">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#c29958] shrink-0" />
                <span>Complimentary Shipping over ₹2,000</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-[#c29958] shrink-0" />
                <span>Complimentary 30-day returns</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#c29958] shrink-0" />
                <span>100% Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
