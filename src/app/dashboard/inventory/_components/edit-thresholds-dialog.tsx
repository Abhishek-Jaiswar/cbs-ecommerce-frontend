"use client";

import React, { useState, useEffect } from "react";
import { useUpdateInventoryMutation } from "@/services/api/inventory/inventory-api";
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

interface EditThresholdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: any;
  onSuccess: () => void;
}

export function EditThresholdsDialog({
  open,
  onOpenChange,
  variant,
  onSuccess,
}: EditThresholdsDialogProps) {
  const [editPrice, setEditPrice] = useState("");
  const [editPhysicalQty, setEditPhysicalQty] = useState("");
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();

  useEffect(() => {
    if (variant) {
      setEditPrice(variant.price !== null ? String(variant.price) : "");
      setEditPhysicalQty(String(variant.physicalQty));
    }
  }, [variant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant) return;
    try {
      await updateInventory({
        variantId: variant.id,
        body: {
          price: editPrice ? parseFloat(editPrice) : null,
          stock: parseInt(editPhysicalQty, 10),
        },
      }).unwrap();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to update thresholds:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-50 border-stone-200 dark:border-stone-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Stock & Price Override</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Update core physical quantity or baseline selling prices for SKU variant:{" "}
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {variant?.sku}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-900/40 p-3 rounded-lg border border-stone-100 dark:border-stone-900 text-xs">
              <div>
                <span className="block text-stone-400">Product</span>
                <span className="font-semibold">{variant?.product?.name}</span>
              </div>
              <div>
                <span className="block text-stone-400">Attributes</span>
                <span className="font-semibold">
                  {variant?.color?.name || "—"} / {variant?.size?.value || "—"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Price Override (₹)</label>
              <Input
                type="number"
                step="0.01"
                placeholder={
                  variant
                    ? `Inherit default: ₹${parseFloat(variant.product?.price || "0").toLocaleString(
                        "en-IN"
                      )}`
                    : ""
                }
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Physical Qty *</label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={editPhysicalQty}
                onChange={(e) => setEditPhysicalQty(e.target.value)}
                className="bg-background"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-stone-900 text-white font-bold">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
