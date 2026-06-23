"use client";

import React, { useState } from "react";
import { SuppliersTab } from "../_components/suppliers-tab";
import { AddSupplierDialog } from "../_components/add-supplier-dialog";

export default function AdminSuppliersPage() {
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [suppliersRefetchTrigger, setSuppliersRefetchTrigger] = useState(0);

  const handleEditSupplierClick = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const handleAddSupplierClick = () => {
    setEditingSupplier(null);
    setIsSupplierDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-955 dark:text-stone-50">
            Suppliers
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Register and manage vendor contacts and company information for restocking items.
          </p>
        </div>
      </div>

      <SuppliersTab
        onAddSupplierClick={handleAddSupplierClick}
        onEditSupplierClick={handleEditSupplierClick}
        refetchTrigger={suppliersRefetchTrigger}
      />

      <AddSupplierDialog
        open={isSupplierDialogOpen}
        onOpenChange={setIsSupplierDialogOpen}
        supplier={editingSupplier}
        onSuccess={() => setSuppliersRefetchTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
