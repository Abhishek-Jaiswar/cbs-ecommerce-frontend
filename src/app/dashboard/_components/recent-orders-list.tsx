import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { getInitials } from "./utils/formatters";

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  status: string;
  total: string;
  date: string;
}

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
            <CardDescription className="text-xs">Most recent transaction checkout activity.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs hover:bg-accent">
            <Link href="/dashboard/orders">View All Orders</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No orders found.
          </div>
        ) : (
          orders.map((ord) => (
            <div
              key={ord.id}
              className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-muted/15 transition-colors border border-transparent hover:border-border/30"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                    {getInitials(ord.customer)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{ord.customer}</span>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-1 rounded">
                      {ord.id}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground block truncate max-w-[180px]">
                    {ord.email}
                  </span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-sm font-bold text-foreground block font-mono">{ord.total}</span>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[9px] text-muted-foreground">{ord.date}</span>
                  <Badge
                    variant="outline"
                    className={`text-[8px] tracking-wide py-0 px-1.5 uppercase font-mono ${
                      ord.status === "DELIVERED"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : ord.status === "PROCESSING"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : ord.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    {ord.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
