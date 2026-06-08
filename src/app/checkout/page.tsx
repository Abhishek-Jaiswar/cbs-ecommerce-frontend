/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetCartQuery } from "@/services/api/cart/cart-api";
import {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  type Address,
} from "@/services/api/addresses/addresses-api";
import {
  usePlaceOrderMutation,
  useVerifyPaymentMutation,
} from "@/services/api/checkout-api";
import AddressForm from "./_components/address";
import CouponField from "./_components/coupon-field";
import PaymentSelector from "./_components/payment-selector";
import CheckoutSummary from "./_components/checkout-summary";
import { Loader2, ArrowLeft, MapPin, Plus, Check } from "lucide-react";

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // API hooks
  const { data: cartRes, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: addressesRes, isLoading: isAddressesLoading } = useGetMyAddressesQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation();
  const [createAddress] = useCreateAddressMutation();

  // State variables
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [saveAddressCheckbox, setSaveAddressCheckbox] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [addressValues, setAddressValues] = useState({
    fullname: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentProvider, setPaymentProvider] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  // Load Razorpay checkout script
  useEffect(() => {
    loadRazorpayScript().then((success) => {
      setRazorpayLoaded(success);
    });
  }, []);

  const fillAddressState = (addr: Address) => {
    setAddressValues({
      fullname: addr.fullname || "",
      phoneNumber: addr.phoneNumber || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
    });
    setErrors({});
  };

  // Sync address form when user changes pre-filled selection
  const savedAddresses = useMemo(() => addressesRes?.data ?? [], [addressesRes?.data]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (savedAddresses.length > 0 && !selectedAddressId && !isNewAddress) {
      // Find default shipping or just use first one
      const defaultAddr = savedAddresses.find((a) => a.isDefaultShipping) ?? savedAddresses[0];
      timerId = setTimeout(() => {
        setSelectedAddressId(defaultAddr.id);
        fillAddressState(defaultAddr);
      }, 0);
    } else if (savedAddresses.length === 0 && !isNewAddress) {
      timerId = setTimeout(() => {
        setIsNewAddress(true);
      }, 0);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [savedAddresses, selectedAddressId, isNewAddress]);

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    setIsNewAddress(false);
    const addr = savedAddresses.find((a) => a.id === addrId);
    if (addr) fillAddressState(addr);
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId(null);
    setIsNewAddress(true);
    setAddressValues({
      fullname: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });
    setErrors({});
  };

  const handleAddressFieldChange = (field: string, value: string) => {
    setAddressValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  const cart = cartRes?.data;
  const items = useMemo(() => cart?.items ?? [], [cart?.items]);
  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item.variant.price) * item.quantity,
    0
  );

  useEffect(() => {
    if (!isCartLoading && isAuthenticated && items.length === 0) {
      router.push("/cart");
    }
  }, [items, isCartLoading, isAuthenticated, router]);

  if (!isAuthenticated || isCartLoading || isAddressesLoading) {
    return (
      <div className="min-h-screen bg-stone-50/50 py-16 flex justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="text-sm text-stone-500 italic">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // Cost calculations
  const shippingThreshold = 2000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 25;
  const taxCost = 0; // Tax is set to 0 everywhere as requested
  const total = Math.max(0, subtotal + shippingCost + taxCost - discountAmount);

  // Address validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!addressValues.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!addressValues.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (addressValues.phoneNumber.replace(/\D/g, "").length < 10) {
      newErrors.phoneNumber = "Valid 10-digit phone number is required";
    }
    if (!addressValues.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!addressValues.city.trim()) newErrors.city = "City is required";
    if (!addressValues.state.trim()) newErrors.state = "State is required";
    
    const cleanPin = addressValues.postalCode.trim();
    if (!cleanPin) {
      newErrors.postalCode = "Postal code is required";
    } else if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      newErrors.postalCode = "Postal code must be exactly 6 digits";
    }
    if (!addressValues.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    setGlobalError(null);

    // If new address form is active or there are no saved addresses, validate inputs
    if (isNewAddress) {
      const isValid = validateForm();
      if (!isValid) {
        setGlobalError("Please correct the validation errors in the shipping form.");
        return;
      }
    }

    try {
      // If user selected "Save address" and it is a new address, save it first
      let activeAddressId = selectedAddressId;
      if (isNewAddress && saveAddressCheckbox) {
        try {
          const newAddrRes = await createAddress(addressValues).unwrap();
          if (newAddrRes.success && newAddrRes.data) {
            activeAddressId = newAddrRes.data.id;
          }
        } catch (addrErr) {
          console.error("Failed to save address locally:", addrErr);
          // Don't fail the checkout just because address saving failed
        }
      }

      // Build order payload
      interface OrderPayload {
        paymentMethod: "CARD" | "COD";
        paymentProvider: "RAZORPAY" | "COD";
        couponCode: string | null;
        addressId?: string;
        shippingAddress?: typeof addressValues;
      }

      const orderPayload: OrderPayload = {
        paymentMethod: paymentProvider === "RAZORPAY" ? "CARD" : "COD",
        paymentProvider,
        couponCode: appliedCoupon,
        ...(activeAddressId
          ? { addressId: activeAddressId }
          : { shippingAddress: addressValues }),
      };

      const orderRes = await placeOrder(orderPayload).unwrap();
      
      if (!orderRes.success || !orderRes.data) {
        setGlobalError(orderRes.message || "Failed to place order.");
        return;
      }

      const { order, razorpayOrder } = orderRes.data;

      // Handle COD path
      if (paymentProvider === "COD") {
        router.push(`/checkout/success?orderId=${order.id}`);
        return;
      }

      // Handle Razorpay path
      if (paymentProvider === "RAZORPAY") {
        if (!razorpayLoaded || !window.Razorpay) {
          setGlobalError("Razorpay SDK is not loaded. Please reload the page and try again.");
          return;
        }

        if (!razorpayOrder) {
          setGlobalError("Server did not generate Razorpay order credentials.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SyDc09vyTwRIfO",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ZenVora Jewelry",
          description: `Order ${order.orderNumber}`,
          order_id: razorpayOrder.id,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyRes = await verifyPayment({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }).unwrap();

              if (verifyRes.success) {
                router.push(`/checkout/success?orderId=${order.id}`);
              } else {
                setGlobalError("Payment verification failed. Please contact support.");
              }
            } catch (err: unknown) {
              const error = err as { data?: { message?: string } };
              setGlobalError(error?.data?.message || "Payment verification failed.");
            }
          },
          prefill: {
            name: addressValues.fullname,
            contact: addressValues.phoneNumber,
          },
          theme: {
            color: "#1c1917", // stone-900 theme color
          },
          modal: {
            ondismiss: function () {
              setGlobalError(
                "Payment window closed. You can complete payment inside your Orders History."
              );
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err: unknown) {
      console.error("Failed to place order:", err);
      const error = err as { data?: { message?: string }; message?: string };
      setGlobalError(
        error?.data?.message || error?.message || "An error occurred while placing your order."
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest font-bold mb-8"
        >
          <ArrowLeft size={14} />
          Back to bag
        </Link>

        <h1 className="text-3xl font-serif text-stone-900 font-medium mb-10 text-center sm:text-left">
          Secure Checkout
        </h1>

        {globalError && (
          <div className="p-4 text-xs font-semibold mb-8 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-800">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <p>{globalError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-8 bg-white border border-stone-200 shadow-sm p-6 sm:p-8">
            {/* Address Selection Section */}
            {savedAddresses.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
                  Select Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id && !isNewAddress;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr.id)}
                        className={`p-4 border cursor-pointer relative transition-all group ${
                          isSelected
                            ? "border-stone-950 bg-stone-50/50"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 text-stone-950 bg-stone-200 p-0.5 rounded-full">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                        <p className="text-xs font-bold text-stone-800 flex items-center gap-1">
                          <MapPin size={12} className="text-stone-500" />
                          {addr.fullname}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          {addr.landmark ? `, Near ${addr.landmark}` : ""}
                          <br />
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[10px] text-stone-400 font-medium mt-2">
                          Phone: {addr.phoneNumber}
                        </p>
                      </div>
                    );
                  })}

                  {/* Add New Address Card */}
                  <div
                    onClick={handleSelectNewAddress}
                    className={`p-4 border border-dashed cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                      isNewAddress
                        ? "border-stone-950 bg-stone-50/50 text-stone-800"
                        : "border-stone-200 hover:border-stone-300 bg-white text-stone-400 hover:text-stone-800"
                    }`}
                  >
                    <Plus size={20} className="mb-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Add New Address
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Address Form Inputs */}
            {isNewAddress && (
              <div className="space-y-4">
                <AddressForm
                  values={addressValues}
                  onChange={handleAddressFieldChange}
                  errors={errors}
                />
                
                {/* Save Address Checkbox */}
                {isAuthenticated && (
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={saveAddressCheckbox}
                      onChange={(e) => setSaveAddressCheckbox(e.target.checked)}
                      className="accent-stone-950 h-3.5 w-3.5 border-stone-200 rounded-none"
                    />
                    Save this address to my profile
                  </label>
                )}
              </div>
            )}

            {/* Payment Selection Section */}
            <PaymentSelector
              selectedProvider={paymentProvider}
              onChange={setPaymentProvider}
            />
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            {/* Promo Code Widget */}
            <div className="bg-white border border-stone-200 shadow-sm p-6">
              <CouponField
                orderAmount={subtotal}
                onCouponApplied={(code, amt) => {
                  setAppliedCoupon(code);
                  setDiscountAmount(amt);
                }}
                onCouponRemoved={() => {
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                }}
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
              />
            </div>

            {/* Order Review Widget */}
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              taxCost={taxCost}
              discountAmount={discountAmount}
              total={total}
              isPlacingOrder={isPlacingOrder || isVerifyingPayment}
              onPlaceOrder={handlePlaceOrder}
              paymentProvider={paymentProvider}
            />
          </div>
        </div>
      </div>
    </div>
  );
}