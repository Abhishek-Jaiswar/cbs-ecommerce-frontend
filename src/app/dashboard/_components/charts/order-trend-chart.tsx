import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface OrderTrendPoint {
  date: string;
  orders: number;
  target: number;
}

interface OrderTrendChartProps {
  data: OrderTrendPoint[];
}

const orderChartConfig = {
  orders: { label: "Completed Orders", color: "hsl(var(--primary))" },
  target: { label: "Target Orders", color: "hsl(var(--muted-foreground)/0.3)" },
};

function CheckCircle2(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function OrderTrendChart({ data }: OrderTrendChartProps) {
  // Calculate fulfillment rate
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const fulfillmentRate = totalTarget > 0 ? Math.round((totalOrders / totalTarget) * 100) : 0;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold">Order Trends & Performance</CardTitle>
            <CardDescription className="text-xs">
              Wide interactive log tracking order fulfillment rates vs monthly targets.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-xs font-semibold">
            <span className="px-2 py-0.5 rounded bg-background shadow-xs text-foreground">12 Months</span>
            <span className="px-2 py-0.5 text-muted-foreground">30 Days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <ChartContainer config={orderChartConfig} className="h-[280px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOrders)"
              name="orders"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted-foreground)/0.4)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
              name="target"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t border-border/60 p-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          Target fulfillment rate: <strong className="text-foreground">{fulfillmentRate}%</strong> overall
        </span>
        <span className="flex items-center gap-1 text-emerald-500 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" /> High volume holiday season
        </span>
      </CardFooter>
    </Card>
  );
}
