"use client";

import React, { useState } from "react";
import {
  useGetSuppliersQuery,
  useGetInventoryQuery,
  useCreatePurchaseOrderMutation,
} from "@/services/api/inventory/inventory-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CreatePoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePoDialog({ open, onOpenChange, onSuccess }: CreatePoDialogProps) {
  const { data: suppliersRes } = useGetSuppliersQuery();
  const suppliersList = suppliersRes?.data ?? [];

  const { data: stockRes } = useGetInventoryQuery({ page: 1, limit: 100 });
  const allInventoryVariants = stockRes?.data?.items ?? [];

  const [poSupplierId, setPoSupplierId] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [poItems, setPoItems] = useState<
    Array<{ variantId: string; quantityOrdered: number; unitCost: number }>
  >([]);

  const [selectedVariantToAdd, setSelectedVariantToAdd] = useState("");
  const [addQtyOrdered, setAddQtyOrdered] = useState("10");
  const [addUnitCost, setAddUnitCost] = useState("100");

  const [createPurchaseOrder, { isLoading }] = useCreatePurchaseOrderMutation();

  const handleAddPoItem = () => {
    if (!selectedVariantToAdd || !addQtyOrdered || !addUnitCost) return;
    const exists = poItems.some((item) => item.variantId === selectedVariantToAdd);
    if (exists) return;

    setPoItems([
      ...poItems,
      {
        variantId: selectedVariantToAdd,
        quantityOrdered: parseInt(addQtyOrdered, 10),
        unitCost: parseFloat(addUnitCost),
      },
    ]);
    setSelectedVariantToAdd("");
  };

  const handleRemovePoItem = (index: number) => {
    setPoItems(poItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poSupplierId || poItems.length === 0) return;
    try {
      await createPurchaseOrder({
        supplierId: poSupplierId,
        notes: poNotes || undefined,
        items: poItems,
      }).unwrap();
      onOpenChange(false);
      setPoSupplierId("");
      setPoNotes("");
      setPoItems([]);
      onSuccess();
    } catch (err) {
      console.error("Failed to create PO:", err);
    }
  };

  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(String(price)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 overflow-y-auto max-h-[85vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Generate Purchase Order (PO)</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Draft a vendor replenishment order. Approved orders automatically update 'On Order Qty'.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Select Vendor *</label>
              <Select value={poSupplierId} onValueChange={setPoSupplierId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Choose supplier profile" />
                </SelectTrigger>
                <SelectContent>
                  {suppliersList.map((sup: any) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items Panel */}
            <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-3 space-y-3 bg-stone-50/50 dark:bg-stone-900/30">
              <span className="text-xs font-bold block text-stone-400 uppercase">Purchase Line Items</span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-stone-400">Select Variant</label>
                  <Select value={selectedVariantToAdd} onValueChange={setSelectedVariantToAdd}>
                    <SelectTrigger className="bg-background h-8 text-xs">
                      <SelectValue placeholder="SKU Variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {allInventoryVariants.map((v: any) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.product?.name} ({v.sku || "N/A"}) - {v.color?.name}/{v.size?.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400">Qty Ordered</label>
                  <Input
                    type="number"
                    value={addQtyOrdered}
                    onChange={(e) => setAddQtyOrdered(e.target.value)}
                    className="bg-background h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400">Unit Cost (₹)</label>
                  <div className="flex gap-1.5">
                    <Input
                      type="number"
                      value={addUnitCost}
                      onChange={(e) => setAddUnitCost(e.target.value)}
                      className="bg-background h-8 text-xs"
                    />
                    <Button
                      type="button"
                      onClick={handleAddPoItem}
                      className="bg-stone-900 text-white text-xs h-8 px-3 font-bold"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {poItems.length > 0 && (
                <Table className="text-[11px]">
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="py-2 pl-2">Variant/SKU</TableHead>
                      <TableHead className="py-2 text-right">Qty</TableHead>
                      <TableHead className="py-2 text-right">Cost</TableHead>
                      <TableHead className="py-2 text-right pr-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poItems.map((item, idx) => {
                      const v = allInventoryVariants.find((x: any) => x.id === item.variantId);
                      return (
                        <TableRow key={idx} className="border-b hover:bg-stone-100/50">
                          <TableCell className="py-2 pl-2">
                            {v?.sku || "Unknown SKU"}
                          </TableCell>
                          <TableCell className="py-2 text-right font-bold">
                            {item.quantityOrdered}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            {formatPrice(item.unitCost)}
                          </TableCell>
                          <TableCell className="py-2 text-right pr-2">
                            <Button
                              type="button"
                              onClick={() => handleRemovePoItem(idx)}
                              variant="ghost"
                              className="h-6 text-rose-600 hover:text-rose-700 p-0 text-[10px]"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Special Instructions / Notes</label>
              <Input
                type="text"
                placeholder="e.g. Ensure shipping box is moisture-proof for metal jewelry"
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || poItems.length === 0}
              className="bg-stone-900 text-white font-bold"
            >
              {isLoading ? "Creating..." : "Save PO Draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
