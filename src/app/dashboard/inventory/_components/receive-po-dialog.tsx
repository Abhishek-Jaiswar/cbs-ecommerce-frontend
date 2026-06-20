"use client";

import React, { useState, useEffect } from "react";
import { useReceivePurchaseOrderMutation } from "@/services/api/inventory/inventory-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface ReceivePoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: any;
  onSuccess: () => void;
}

export function ReceivePoDialog({
  open,
  onOpenChange,
  po,
  onSuccess,
}: ReceivePoDialogProps) {
  const [receivedQtys, setReceivedQtys] = useState<{ [key: string]: number }>({});
  const [receivePurchaseOrder, { isLoading }] = useReceivePurchaseOrderMutation();

  useEffect(() => {
    if (po) {
      const initialQtys: { [key: string]: number } = {};
      po.items?.forEach((item: any) => {
        initialQtys[item.variantId] = item.quantityOrdered - item.quantityReceived;
      });
      setReceivedQtys(initialQtys);
    }
  }, [po]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!po) return;
    const payloadItems = Object.keys(receivedQtys).map((variantId) => ({
      variantId,
      quantityReceived: receivedQtys[variantId] || 0,
    }));

    try {
      await receivePurchaseOrder({
        poId: po.id,
        items: payloadItems,
      }).unwrap();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to receive goods:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Receive Vendor Shipment</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Confirm receipt of items for Purchase Order:{" "}
              <span className="font-bold">{po?.poNumber}</span>. Items will be automatically
              added to warehouse physical stock.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto pr-1">
            {po?.items?.map((item: any) => {
              const maxRemaining = item.quantityOrdered - item.quantityReceived;
              return (
                <div
                  key={item.id}
                  className="border border-stone-100 dark:border-stone-900 p-3 rounded-lg space-y-2.5 bg-stone-50/50"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold block text-stone-900 dark:text-stone-100">
                        {item.variant?.product?.name}
                      </span>
                      <span className="text-stone-400 text-[10px]">
                        {item.variant?.sku}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-stone-100 dark:bg-stone-800 text-stone-850 dark:text-stone-200 font-semibold"
                    >
                      Ordered: {item.quantityOrdered} | Recvd: {item.quantityReceived}
                    </Badge>
                  </div>

                  {maxRemaining <= 0 ? (
                    <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} /> All items received
                    </span>
                  ) : (
                    <div className="flex items-center gap-4 justify-between">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                        Received Quantity:
                      </label>
                      <Input
                        type="number"
                        max={maxRemaining}
                        min={0}
                        value={receivedQtys[item.variantId] || 0}
                        onChange={(e) =>
                          setReceivedQtys({
                            ...receivedQtys,
                            [item.variantId]: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-[100px] h-8 bg-background text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isLoading ? "Processing..." : "Confirm Receipt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
