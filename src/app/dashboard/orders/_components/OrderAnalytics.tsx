"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, RefreshCw, Truck, DollarSign } from "lucide-react";
import { Order } from "@/services/api/checkout-api";

interface OrderAnalyticsProps {
  items: Order[];
}

export const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ items }) => {
  const totalOrders = items.length;
  const pendingOrders = items.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING"
  ).length;
  const deliveredOrders = items.filter((o) => o.status === "DELIVERED").length;
  const grossRevenue = items
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
    .toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Total Orders
            </span>
            <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
              {totalOrders}
            </p>
          </div>
          <div className="h-10 w-10 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Pending Processing
            </span>
            <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
              {pendingOrders}
            </p>
          </div>
          <div className="h-10 w-10 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <RefreshCw size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Delivered Total
            </span>
            <p className="text-3xl text-emerald-600 dark:text-emerald-400 font-extrabold">
              {deliveredOrders}
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
            <Truck size={20} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Gross Revenue
            </span>
            <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
              ₹{parseFloat(grossRevenue).toFixed(2)}
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

OrderAnalytics.displayName = "OrderAnalytics";
