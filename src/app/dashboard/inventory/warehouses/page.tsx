"use client";

import React, { useState } from "react";
import { WarehousesTab } from "../_components/warehouses-tab";
import { AddWarehouseDialog } from "../_components/add-warehouse-dialog";

export default function AdminWarehousesPage() {
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);
  const [warehouseRefetchTrigger, setWarehouseRefetchTrigger] = useState(0);

  const handleEditWarehouseClick = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    setIsWarehouseDialogOpen(true);
  };

  const handleAddWarehouseClick = () => {
    setEditingWarehouse(null);
    setIsWarehouseDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-955 dark:text-stone-50">
            Warehouses
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Register and manage physical inventory storage facilities.
          </p>
        </div>
      </div>

      <WarehousesTab
        onAddWarehouseClick={handleAddWarehouseClick}
        onEditWarehouseClick={handleEditWarehouseClick}
        refetchTrigger={warehouseRefetchTrigger}
      />

      <AddWarehouseDialog
        open={isWarehouseDialogOpen}
        onOpenChange={setIsWarehouseDialogOpen}
        warehouse={editingWarehouse}
        onSuccess={() => setWarehouseRefetchTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
