"use client";

import React, { useState, useEffect } from "react";
import { useCreateWarehouseMutation, useUpdateWarehouseMutation } from "@/services/api/inventory/inventory-api";
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

interface AddWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  warehouse?: any; // If passed, dialog functions in Edit mode
}

export function AddWarehouseDialog({
  open,
  onOpenChange,
  onSuccess,
  warehouse,
}: AddWarehouseDialogProps) {
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    code: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    status: "ACTIVE",
  });

  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
  const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();

  useEffect(() => {
    if (open) {
      if (warehouse) {
        setWarehouseForm({
          name: warehouse.name || "",
          code: warehouse.code || "",
          addressLine: warehouse.addressLine || "",
          city: warehouse.city || "",
          state: warehouse.state || "",
          postalCode: warehouse.postalCode || "",
          country: warehouse.country || "India",
          status: warehouse.status || "ACTIVE",
        });
      } else {
        setWarehouseForm({
          name: "",
          code: "",
          addressLine: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          status: "ACTIVE",
        });
      }
    }
  }, [warehouse, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: warehouseForm.name,
        code: warehouseForm.code.toUpperCase(),
        addressLine: warehouseForm.addressLine,
        city: warehouseForm.city,
        state: warehouseForm.state,
        postalCode: warehouseForm.postalCode,
        country: warehouseForm.country,
        status: warehouseForm.status,
      };

      if (warehouse) {
        await updateWarehouse({ id: warehouse.id, body: payload }).unwrap();
      } else {
        await createWarehouse(payload).unwrap();
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to save warehouse:", err);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {warehouse ? "Edit Warehouse Hub" : "Register Warehouse Location"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              {warehouse
                ? "Update the physical storage warehouse details and status."
                : "Add a new physical storage warehouse to route orders and track inventory."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-semibold">Warehouse Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Mumbai Main Hub"
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  className="bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Location Code *</label>
                <Input
                  type="text"
                  placeholder="e.g. MUM01"
                  value={warehouseForm.code}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                  className="bg-background text-xs"
                  required
                  disabled={!!warehouse} // Disable code editing in edit mode to preserve references
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Address Line *</label>
              <Input
                type="text"
                placeholder="e.g. Plot No. 15, MIDC Industrial Area"
                value={warehouseForm.addressLine}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, addressLine: e.target.value })}
                className="bg-background text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold">City *</label>
                <Input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={warehouseForm.city}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                  className="bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">State *</label>
                <Input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={warehouseForm.state}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                  className="bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Postal Code *</label>
                <Input
                  type="text"
                  placeholder="e.g. 400001"
                  value={warehouseForm.postalCode}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, postalCode: e.target.value })}
                  className="bg-background text-xs"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold">Country *</label>
                <Input
                  type="text"
                  placeholder="e.g. India"
                  value={warehouseForm.country}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, country: e.target.value })}
                  className="bg-background text-xs"
                  required
                />
              </div>
            </div>

            {warehouse && (
              <div className="space-y-2">
                <label className="text-xs font-semibold">Warehouse Status *</label>
                <Select
                  value={warehouseForm.status}
                  onValueChange={(val) => setWarehouseForm({ ...warehouseForm, status: val })}
                >
                  <SelectTrigger className="w-full bg-background text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="TEMPORARILY_CLOSED">Temporarily Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-stone-900 text-white dark:bg-stone-50 dark:text-stone-950 font-bold">
              {isLoading ? "Saving..." : warehouse ? "Update Warehouse" : "Save Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
