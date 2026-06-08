"use client";

import React, { useState, useEffect } from "react";
import {
  useGetVariantsQuery,
  useUpdateVariantMutation,
} from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  AlertCircle,
  Package,
  Layers,
} from "lucide-react";

export default function AdminInventoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("ALL");

  // Edit Variant states
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Debounce search state
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchVal);
      setPage(1);
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchVal]);

  const {
    data: variantsRes,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetVariantsQuery({
    page,
    limit,
    search: search || undefined,
    stockStatus: stockStatus === "ALL" ? undefined : stockStatus,
  });

  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateVariantMutation();

  const variantsData = variantsRes?.data;
  const items = variantsData?.items ?? [];
  const totalPages = variantsData?.totalPages ?? 1;
  const insights = variantsData?.insights ?? {
    totalStock: 0,
    totalVariants: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
  };

  const handleEditClick = (variant: any) => {
    setEditingVariant(variant);
    setEditPrice(
      variant.price !== null && variant.price !== undefined ? String(variant.price) : ""
    );
    setEditStock(String(variant.stock));
    setIsEditDialogOpen(true);
  };

  const handleUpdateVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant || editStock === "") return;

    try {
      await updateVariant({
        variantId: editingVariant.id,
        body: {
          price: editPrice ? parseFloat(editPrice) : null,
          stock: parseInt(editStock, 10),
        },
      }).unwrap();
      setIsEditDialogOpen(false);
      setEditingVariant(null);
      setEditPrice("");
      setEditStock("");
      refetch();
    } catch (err) {
      console.error("Failed to update product variant stock", err);
    }
  };

  const handleStatusChange = (val: string) => {
    setStockStatus(val);
    setPage(1);
  };

  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(String(price)));
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Inventory & Variants
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Monitor product variant stock counts, view low stock alerts, and apply instant price overrides.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-auto shadow-sm gap-2 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-950 dark:text-stone-50 text-xs font-bold uppercase tracking-wider h-10 px-4 flex items-center justify-center bg-white dark:bg-stone-950 transition-colors"
        >
          <RefreshCw size={14} className={`${isFetching ? "animate-spin" : ""}`} />
          Refresh Stats
        </Button>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-stone-500 dark:bg-stone-600" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Total Stock Units</span>
              <p className="text-3xl text-stone-950 dark:text-stone-50 font-extrabold">{insights.totalStock}</p>
            </div>
            <div className="h-10 w-10 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg flex items-center justify-center">
              <Boxes size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Active SKU Variants</span>
              <p className="text-3xl text-stone-955 dark:text-stone-50 font-extrabold">{insights.totalVariants}</p>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center">
              <Layers size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Out of Stock SKU</span>
              <p className="text-3xl text-rose-600 dark:text-rose-450 font-extrabold">{insights.outOfStockCount}</p>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-600" />
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Low Stock Alerts</span>
              <p className="text-3xl text-amber-650 dark:text-amber-500 font-extrabold">{insights.lowStockCount}</p>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <Input
            placeholder="Search by product name or SKU..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="pl-9 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus-visible:ring-stone-500"
          />
        </div>
        <div className="w-[180px]">
          <Select value={stockStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
              <SelectItem value="ALL">All Stock Levels</SelectItem>
              <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table card */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400 dark:text-stone-600" />
          </div>
        ) : isError ? (
          <div className="h-64 flex justify-center items-center flex-col gap-2 p-6 text-center">
            <p className="text-sm font-medium text-rose-600">Failed to load variant inventory logs.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-stone-300">Retry Connection</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No SKU variants found matching the criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b border-stone-200 dark:border-stone-800">
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4 pl-6">SKU Code</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Product Name</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Color Option</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Size Option</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Baseline Price</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Override Price</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4">Stock Level</TableHead>
                    <TableHead className="font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] py-4 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {items.map((v: any) => {
                    let stockBadge = (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850 rounded-md">
                        {v.stock} units
                      </Badge>
                    );
                    if (v.stock === 0) {
                      stockBadge = (
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-800 rounded-md font-bold">
                          Out of Stock
                        </Badge>
                      );
                    } else if (v.stock <= 10) {
                      stockBadge = (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 rounded-md">
                          Low Stock: {v.stock}
                        </Badge>
                      );
                    }

                    return (
                      <TableRow key={v.id} className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                        <TableCell className="font-mono text-xs text-stone-500 dark:text-stone-400 py-4 pl-6">
                          {v.sku || "—"}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            <Package size={12} className="text-stone-400 dark:text-stone-500" />
                            {v.product?.name || "Unknown Product"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-300">
                          <div className="flex items-center gap-1.5">
                            {v.color?.hex && (
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-stone-200 dark:border-stone-850"
                                style={{ backgroundColor: v.color.hex }}
                              />
                            )}
                            <span>{v.color?.name || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-stone-750 dark:text-stone-300">
                          {v.size?.value || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-mono text-stone-500 dark:text-stone-400">
                          {formatPrice(v.product?.price) || "—"}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-mono font-bold text-stone-900 dark:text-stone-50">
                          {formatPrice(v.price) ? (
                            <span className="text-amber-600 dark:text-amber-550">{formatPrice(v.price)}</span>
                          ) : (
                            <span className="text-stone-400 dark:text-stone-600 italic text-[10px]">Inherited</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {stockBadge}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(v)}
                            className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md"
                          >
                            <Pencil size={14} className="text-stone-500 dark:text-stone-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400 font-mono">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="h-8 w-8 rounded-md border-stone-200 dark:border-stone-800 disabled:opacity-35"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-8 w-8 rounded-md border-stone-200 dark:border-stone-800 disabled:opacity-35"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Variant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-50 border-stone-200 dark:border-stone-800">
          <form onSubmit={handleUpdateVariantSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-stone-950 dark:text-stone-50">Edit Variant Inventory</DialogTitle>
              <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
                Update stock units and custom price overrides for SKU variant: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{editingVariant?.sku}</span>
              </CardDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-900/40 p-3 rounded-lg border border-stone-100 dark:border-stone-900 text-xs">
                <div>
                  <span className="block text-stone-400 dark:text-stone-500">Product</span>
                  <span className="font-semibold">{editingVariant?.product?.name}</span>
                </div>
                <div>
                  <span className="block text-stone-400 dark:text-stone-500">Attributes</span>
                  <span className="font-semibold">
                    {editingVariant?.color?.name || "—"} / {editingVariant?.size?.value || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Price Override (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={editingVariant ? `Inherit default: ₹${parseFloat(editingVariant.product?.price || "0").toLocaleString("en-IN")}` : ""}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="bg-background border-stone-200 dark:border-stone-800 text-sm"
                />
                <span className="text-[10px] text-stone-400 dark:text-stone-500">Leave blank to use default baseline product price.</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Stock Quantity *</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="bg-background border-stone-200 dark:border-stone-800 text-sm"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-stone-200 dark:border-stone-800"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingVariant} className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold">
                {isUpdatingVariant ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
