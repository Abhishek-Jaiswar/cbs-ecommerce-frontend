"use client";

import React, { useState, useEffect } from "react";
import { useGetInventoryQuery } from "@/services/api/inventory/inventory-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Boxes,
  AlertTriangle,
  Pencil,
  Package,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockLevelsTabProps {
  onEditClick: (variant: any) => void;
  onAdjustClick: (variant: any) => void;
}

export function StockLevelsTab({ onEditClick, onAdjustClick }: StockLevelsTabProps) {
  const [stockPage, setStockPage] = useState(1);
  const [stockLimit] = useState(10);
  const [stockSearchVal, setStockSearchVal] = useState("");
  const [stockSearch, setStockSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("ALL");

  // Debounce stock search
  useEffect(() => {
    const handler = setTimeout(() => {
      setStockSearch(stockSearchVal);
      setStockPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [stockSearchVal]);

  const {
    data: stockRes,
    isLoading: isStockLoading,
    isFetching: isStockFetching,
    refetch: refetchStock,
  } = useGetInventoryQuery({
    page: stockPage,
    limit: stockLimit,
    search: stockSearch || undefined,
    stockStatus: stockStatus === "ALL" ? undefined : stockStatus,
  });

  const stockData = stockRes?.data;
  const stockItems = stockData?.items ?? [];
  const stockTotalPages = stockData?.totalPages ?? 1;
  const insights = stockData?.insights ?? {
    totalStock: 0,
    totalCommitted: 0,
    totalAvailable: 0,
    totalVariants: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
  };

  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(String(price)));
  };

  return (
    <div className="space-y-6">
      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-stone-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Physical Qty
              </span>
              <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">
                {insights.totalStock}
              </p>
            </div>
            <div className="h-10 w-10 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center">
              <Boxes size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Committed Stock
              </span>
              <p className="text-3xl text-amber-600 dark:text-amber-500 font-extrabold">
                {insights.totalCommitted}
              </p>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600">
              <Package size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Available Stock
              </span>
              <p className="text-3xl text-emerald-600 dark:text-emerald-500 font-extrabold">
                {insights.totalAvailable}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Low Stock Alert SKU
              </span>
              <p className="text-3xl text-rose-600 font-extrabold">{insights.lowStockCount}</p>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-600">
              <AlertTriangle size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search by product name or SKU..."
            value={stockSearchVal}
            onChange={(e) => setStockSearchVal(e.target.value)}
            className="pl-9 bg-white dark:bg-stone-950"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={stockStatus}
            onValueChange={(val) => {
              setStockStatus(val);
              setStockPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-stone-950">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stock Levels</SelectItem>
              <SelectItem value="LOW_STOCK">Low Stock Alert</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetchStock()} variant="outline" className="bg-white dark:bg-stone-950">
            <RefreshCw size={14} className={`${isStockFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isStockLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : stockItems.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No variants found matching the criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b border-stone-200 dark:border-stone-800">
                    <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      SKU Code
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Product Name
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Attributes
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Base Price
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      Physical
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      Committed
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      Available
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      On Order
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {stockItems.map((v: any) => {
                    const available = v.physicalQty - v.committedQty;
                    const isLow = available > 0 && available <= v.reorderPoint;
                    const isOut = available <= 0;

                    return (
                      <TableRow
                        key={v.id}
                        className="border-b hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell className="text-xs text-stone-500 pl-6 py-4">
                          {v.sku || "—"}
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-xs text-stone-955 dark:text-stone-50">
                          {v.product?.name || "Unknown Product"}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                          {v.color?.name || "—"} / {v.size?.value || "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatPrice(v.price || v.product?.price)}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold">
                          {v.physicalQty}
                        </TableCell>
                        <TableCell className="text-xs text-right text-amber-600 dark:text-amber-500">
                          {v.committedQty}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          {isOut ? (
                            <Badge variant="outline" className="bg-rose-50 text-rose-805 border-rose-200 font-bold">
                              Out of Stock
                            </Badge>
                          ) : isLow ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-805 border-amber-200 font-semibold">
                              Low: {available}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-805 border-emerald-200">
                              {available} units
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-right text-stone-500">
                          {v.onOrderQty}
                        </TableCell>
                        <TableCell className="py-4 text-center pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                              <DropdownMenuLabel className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
                              <DropdownMenuItem
                                onClick={() => onEditClick(v)}
                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Stock & Price
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onAdjustClick(v)}
                                className="cursor-pointer text-xs flex items-center gap-2 text-amber-600 dark:text-amber-500 hover:bg-stone-50 dark:hover:bg-stone-900"
                              >
                                <Boxes className="h-3.5 w-3.5" />
                                Manual Stock Adjustment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {stockTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400">
                  Page {stockPage} of {stockTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={stockPage <= 1}
                    onClick={() => setStockPage(stockPage - 1)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={stockPage >= stockTotalPages}
                    onClick={() => setStockPage(stockPage + 1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
