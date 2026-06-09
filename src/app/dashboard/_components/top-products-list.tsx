import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: string;
  image?: string;
  initials: string;
}

interface TopProductsListProps {
  products: TopProduct[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold">Top Selling Products</CardTitle>
            <CardDescription className="text-xs">Highest generating jewelry listings by sales quantity.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs hover:bg-accent">
            <Link href="/dashboard/products">Manage Inventory</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No top products found.
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id || p.name}
              className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-muted/15 transition-colors border border-transparent hover:border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-semibold text-xs text-muted-foreground">{p.initials}</span>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-sm font-semibold text-foreground block max-w-[180px] sm:max-w-[280px] truncate">
                    {p.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 uppercase font-mono tracking-wider bg-background border-border/80"
                  >
                    {p.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-foreground block">{p.revenue}</span>
                <span className="text-[11px] text-muted-foreground block">{p.sales} sales</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
