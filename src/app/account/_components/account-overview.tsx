"use client";

import React from "react";
import { useGetMyOrdersQuery } from "@/services/api/checkout-api";
import { useGetMyAddressesQuery } from "@/services/api/addresses/addresses-api";
import { ShoppingBag, MapPin, Shield, Calendar, Truck, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AccountOverviewProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  setActiveTab: (tab: "overview" | "orders" | "addresses" | "profile" | "settings") => void;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({ user, setActiveTab }) => {
  // Fetch orders and addresses
  const { data: ordersRes, isLoading: ordersLoading } = useGetMyOrdersQuery({ page: 1, limit: 5 });
  const { data: addressesRes, isLoading: addressesLoading } = useGetMyAddressesQuery();

  const orders = ordersRes?.data?.items ?? [];
  const addresses = addressesRes?.data ?? [];
  const latestOrder = orders[0];

  const defaultShippingAddress = addresses.find((addr) => addr.isDefaultShipping) || addresses[0];

  // Helper to determine order status color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 uppercase text-[9px] font-bold">Pending</Badge>;
      case "PROCESSING":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 uppercase text-[9px] font-bold">Processing</Badge>;
      case "SHIPPED":
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 uppercase text-[9px] font-bold">Shipped</Badge>;
      case "DELIVERED":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 uppercase text-[9px] font-bold">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-stone-50 text-stone-500 border-stone-205 uppercase text-[9px] font-bold">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-stone-100 text-stone-800 border-stone-300 uppercase text-[9px] font-bold">{status}</Badge>;
    }
  };

  // Mini timeline indices
  const getTimelineIndex = (status: string) => {
    switch (status) {
      case "PENDING": return 0;
      case "PROCESSING": return 1;
      case "SHIPPED": return 2;
      case "DELIVERED": return 3;
      default: return -1;
    }
  };

  const timelineIndex = latestOrder ? getTimelineIndex(latestOrder.status) : -1;
  const isCancelled = latestOrder?.status === "CANCELLED";

  return (
    <div className="space-y-6 font-[var(--font-sans)]">
      {/* Welcome Card */}
      <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-none shadow-sm space-y-2">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
          Hello, {user.name}!
        </h2>
        <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
          From your account dashboard, you can easily check and track your recent orders, manage shipping and billing addresses, and edit your profile and account settings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-stone-200 bg-white rounded-none shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Orders</span>
              <p className="text-2xl font-bold text-stone-900">{ordersRes?.data?.total ?? 0}</p>
            </div>
            <div className="h-10 w-10 bg-stone-50 border border-stone-100 text-stone-500 flex items-center justify-center rounded-none">
              <ShoppingBag size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white rounded-none shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Saved Addresses</span>
              <p className="text-2xl font-bold text-stone-900">{addresses.length}</p>
            </div>
            <div className="h-10 w-10 bg-stone-50 border border-stone-100 text-stone-500 flex items-center justify-center rounded-none">
              <MapPin size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white rounded-none shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Security Access</span>
              <p className="text-base font-bold text-emerald-600 uppercase tracking-wide">Active Verified</p>
            </div>
            <div className="h-10 w-10 bg-stone-50 border border-stone-100 text-stone-500 flex items-center justify-center rounded-none">
              <Shield size={18} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Order Card */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block px-1">
            Recent Order Status
          </span>
          <Card className="border-stone-200 bg-white rounded-none shadow-sm h-full flex flex-col justify-between">
            {ordersLoading ? (
              <CardContent className="p-6 space-y-4">
                <div className="h-4 w-48 bg-stone-100 animate-pulse rounded" />
                <div className="h-10 bg-stone-50 animate-pulse rounded" />
              </CardContent>
            ) : latestOrder ? (
              <>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-sm font-bold text-stone-900 font-mono">
                        #{latestOrder.orderNumber}
                      </CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">
                        Placed on {new Date(latestOrder.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(latestOrder.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Item preview */}
                  <div className="flex gap-4 items-center bg-stone-50/40 border border-stone-100 p-3">
                    <div className="h-12 w-12 bg-stone-100 border relative shrink-0">
                      <img
                        src={latestOrder.orderItems?.[0]?.image || "/placeholder-item.jpg"}
                        alt="Order preview"
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {latestOrder.orderItems?.[0]?.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {latestOrder.orderItems?.length > 1
                          ? `and ${latestOrder.orderItems.length - 1} other item(s)`
                          : `Quantity: ${latestOrder.orderItems?.[0]?.quantity}`}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#c29958]">
                      ₹{parseFloat(latestOrder.totalAmount).toFixed(2)}
                    </div>
                  </div>

                  {/* Mini Stepper Line */}
                  {!isCancelled && timelineIndex >= 0 ? (
                    <div className="space-y-3 px-2">
                      <div className="flex justify-between text-[9px] uppercase font-bold text-stone-400">
                        <span>Placed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="flex items-center justify-between relative w-full px-1">
                        <div className="absolute left-[8px] right-[8px] top-1/2 -translate-y-1/2 h-0.5 bg-stone-100 z-0">
                          <div
                            className="h-full bg-[#c29958] transition-all"
                            style={{ width: `${(timelineIndex / 3) * 100}%` }}
                          />
                        </div>
                        {[0, 1, 2, 3].map((step) => {
                          const done = step <= timelineIndex;
                          return (
                            <div
                              key={step}
                              className={`h-3 w-3 rounded-full z-10 flex items-center justify-center border transition-all ${
                                done ? "bg-[#c29958] border-[#c29958]" : "bg-white border-stone-200"
                              }`}
                            >
                              {done && <Check className="text-white h-2 w-2" size={8} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : isCancelled ? (
                    <div className="text-xs text-rose-600 bg-rose-50/50 p-3 border border-rose-100 font-semibold flex items-center gap-1">
                      ⚠️ This order was cancelled.
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 italic">
                      Tracking data is currently loading...
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0 border-t border-stone-100 mt-4 bg-stone-50/10 flex justify-between items-center">
                  <span className="text-[10px] text-stone-400 font-light font-mono">
                    {latestOrder.trackingNumber ? `Carrier Code: ${latestOrder.trackingNumber}` : "Pending carrier lookup"}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold hover:text-[#c29958] gap-1 p-0 h-auto hover:bg-transparent"
                  >
                    View All Orders
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-4">
                <p className="text-xs text-stone-400 font-light">No recent orders found.</p>
                <Button
                  onClick={() => setActiveTab("orders")}
                  className="bg-stone-950 hover:bg-[#c29958] text-white text-[10px] font-bold uppercase rounded-none px-4 py-2"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Saved Address Widget */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block px-1">
            Primary Address
          </span>
          <Card className="border-stone-200 bg-white rounded-none shadow-sm h-full flex flex-col justify-between">
            {addressesLoading ? (
              <CardContent className="p-6 space-y-3">
                <div className="h-4 w-32 bg-stone-100 animate-pulse rounded" />
                <div className="h-8 bg-stone-50 animate-pulse rounded" />
              </CardContent>
            ) : defaultShippingAddress ? (
              <>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Default Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 leading-relaxed">
                  <p className="font-bold text-stone-900">{defaultShippingAddress.fullname}</p>
                  <p className="text-stone-500">{defaultShippingAddress.phoneNumber}</p>
                  <p className="text-stone-700">
                    {defaultShippingAddress.addressLine1}
                    {defaultShippingAddress.addressLine2 ? `, ${defaultShippingAddress.addressLine2}` : ""}
                    <br />
                    {defaultShippingAddress.city}, {defaultShippingAddress.state} - {defaultShippingAddress.postalCode}
                    <br />
                    {defaultShippingAddress.country}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 border-t border-stone-100 mt-4 bg-stone-50/10 flex justify-between items-center">
                  <span className="text-[10px] text-stone-400 font-light">
                    Default active address
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("addresses")}
                    className="text-xs font-bold hover:text-[#c29958] gap-1 p-0 h-auto hover:bg-transparent"
                  >
                    Manage
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-4">
                <p className="text-xs text-stone-400 font-light">No saved addresses found.</p>
                <Button
                  onClick={() => setActiveTab("addresses")}
                  className="bg-stone-950 hover:bg-[#c29958] text-white text-[10px] font-bold uppercase rounded-none px-4 py-2"
                >
                  Add Address
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
