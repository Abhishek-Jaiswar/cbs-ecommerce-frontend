"use client";

import React, { useState, useEffect } from "react";
import { useAdjustStockMutation } from "@/services/api/inventory/inventory-api";
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

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: any;
  onSuccess: () => void;
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  variant,
  onSuccess,
}: AdjustStockDialogProps) {
  const [adjustQtyChange, setAdjustQtyChange] = useState("");
  const [adjustType, setAdjustType] = useState("MANUAL_ADJUSTMENT");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustStock, { isLoading }] = useAdjustStockMutation();

  useEffect(() => {
    if (open) {
      setAdjustQtyChange("");
      setAdjustType("MANUAL_ADJUSTMENT");
      setAdjustReason("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant || !adjustQtyChange) return;
    try {
      await adjustStock({
        variantId: variant.id,
        qtyChange: parseInt(adjustQtyChange, 10),
        type: adjustType,
        reason: adjustReason || undefined,
      }).unwrap();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Manual Stock Adjustment</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Log a stock correction or shrinkage for SKU:{" "}
              <span className="font-bold">{variant?.sku}</span>. This will write a
              permanent entry in the transaction ledger.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-900/40 p-3 rounded-lg text-xs">
              <div>
                <span className="block text-stone-400">Current Physical</span>
                <span className="font-semibold">{variant?.physicalQty} units</span>
              </div>
              <div>
                <span className="block text-stone-400">Current Committed</span>
                <span className="font-semibold">{variant?.committedQty} units</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Quantity Change *</label>
              <Input
                type="number"
                placeholder="e.g. -5 for damage, +15 for recount"
                value={adjustQtyChange}
                onChange={(e) => setAdjustQtyChange(e.target.value)}
                className="bg-background"
                required
              />
              <span className="text-[10px] text-stone-400 block">
                Use negative numbers to decrement (shrinkage), positive numbers to increment.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Adjustment Type *</label>
              <Select value={adjustType} onValueChange={setAdjustType}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL_ADJUSTMENT">
                    MANUAL_ADJUSTMENT (Recount correction)
                  </SelectItem>
                  <SelectItem value="SHRINKAGE">SHRINKAGE (Theft, damage, wastage)</SelectItem>
                  <SelectItem value="REPLENISHMENT">REPLENISHMENT (Manual restocking)</SelectItem>
                  <SelectItem value="CUSTOMER_RETURN">CUSTOMER_RETURN (Returned goods)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Reason / Notes</label>
              <Input
                type="text"
                placeholder="e.g. Damaged during package picking"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
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
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isLoading ? "Adjusting..." : "Submit Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
