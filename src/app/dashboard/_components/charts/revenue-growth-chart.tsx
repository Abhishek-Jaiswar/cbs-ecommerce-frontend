import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface RevenueTrendPoint {
  month: string;
  revenue: number;
  target: number;
}

interface RevenueGrowthChartProps {
  data: RevenueTrendPoint[];
}

const revenueChartConfig = {
  revenue: { label: "Revenue Actual", color: "#10b981" },
  target: { label: "Revenue Target", color: "rgba(16,185,129,0.2)" },
};

export function RevenueGrowthChart({ data }: RevenueGrowthChartProps) {
  return (
    <Card className="bg-card border-border shadow-sm lg:col-span-2">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-bold">Revenue Growth</CardTitle>
        <CardDescription className="text-xs">
          Compare monthly target goals with actual sales revenue.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <ChartContainer config={revenueChartConfig} className="h-[220px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="revenue" />
            <Bar dataKey="target" fill="rgba(16,185,129,0.15)" radius={[4, 4, 0, 0]} name="target" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
