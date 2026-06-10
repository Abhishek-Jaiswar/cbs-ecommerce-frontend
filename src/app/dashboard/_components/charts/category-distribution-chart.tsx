import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CategorySalesPoint {
  name: string;
  value: number;
  color: string;
}

interface CategoryDistributionChartProps {
  data: CategorySalesPoint[];
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  // Build chart config dynamically based on category data
  const categoryChartConfig = React.useMemo(() => {
    return data.reduce((acc, item) => {
      const key = item.name.toLowerCase().replace(/\s+/g, "-");
      acc[key] = { label: item.name, color: item.color };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [data]);

  const totalSales = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-bold">Category Distribution</CardTitle>
        <CardDescription className="text-xs">
          Distribution of sales volume by sub-categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col justify-center min-h-[220px]">
        <div className="h-[160px] w-full relative flex items-center justify-center">
          <ChartContainer config={categoryChartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono">{totalSales.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Sales</span>
          </div>
        </div>
        {/* Visual Legends */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          {data.map((cat, i) => (
            <div key={i} className="flex items-center gap-1.5 font-medium truncate">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-muted-foreground truncate">{cat.name}:</span>
              <span className="text-foreground shrink-0">{cat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
