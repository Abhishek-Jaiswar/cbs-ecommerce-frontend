"use client";

import React, { useState } from "react";
import { StockLevelsTab } from "./_components/stock-levels-tab";
import { EditThresholdsDialog } from "./_components/edit-thresholds-dialog";
import { AdjustStockDialog } from "./_components/adjust-stock-dialog";

export default function AdminStockLevelsPage() {
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [adjustingVariant, setAdjustingVariant] = useState<any>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);

  const [stockRefetchTrigger, setStockRefetchTrigger] = useState(0);

  const handleEditClick = (variant: any) => {
    setEditingVariant(variant);
    setIsEditDialogOpen(true);
  };

  const handleAdjustClick = (variant: any) => {
    setAdjustingVariant(variant);
    setIsAdjustDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Stock Levels
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Control Zenvora stock levels across physical locations and log adjustments.
          </p>
        </div>
      </div>

      <StockLevelsTab
        key={stockRefetchTrigger}
        onEditClick={handleEditClick}
        onAdjustClick={handleAdjustClick}
      />

      <EditThresholdsDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        variant={editingVariant}
        onSuccess={() => setStockRefetchTrigger((prev) => prev + 1)}
      />

      <AdjustStockDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        variant={adjustingVariant}
        onSuccess={() => setStockRefetchTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
