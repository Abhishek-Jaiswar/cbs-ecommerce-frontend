"use client";

import React, { useState, useEffect } from "react";
import { useCreateSupplierMutation, useUpdateSupplierMutation } from "@/services/api/inventory/inventory-api";
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

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  supplier?: any; // If passed, dialog functions in Edit mode
}

export function AddSupplierDialog({
  open,
  onOpenChange,
  onSuccess,
  supplier,
}: AddSupplierDialogProps) {
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    status: "ACTIVE",
  });

  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  useEffect(() => {
    if (open) {
      if (supplier) {
        setSupplierForm({
          name: supplier.name || "",
          contactName: supplier.contactName || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          status: supplier.status || "ACTIVE",
        });
      } else {
        setSupplierForm({
          name: "",
          contactName: "",
          email: "",
          phone: "",
          address: "",
          status: "ACTIVE",
        });
      }
    }
  }, [supplier, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: supplierForm.name,
        email: supplierForm.email,
        contactName: supplierForm.contactName || null,
        phone: supplierForm.phone || null,
        address: supplierForm.address || null,
        status: supplierForm.status,
      };

      if (supplier) {
        await updateSupplier({ id: supplier.id, body: payload }).unwrap();
      } else {
        await createSupplier(payload).unwrap();
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to save supplier:", err);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {supplier ? "Edit Supplier Profile" : "Register Vendor Profile"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              {supplier
                ? "Update the supplier information and status details."
                : "Add a supplier profile to Zenvora's supply-chain database."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Supplier Name *</label>
              <Input
                type="text"
                placeholder="e.g. Shine Delhi Jewelry Manufacturer"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Contact Person Name</label>
              <Input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={supplierForm.contactName}
                onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Email Address *</label>
              <Input
                type="email"
                placeholder="e.g. vendor@shinedelhi.com"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Phone Number</label>
              <Input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Company Address</label>
              <Input
                type="text"
                placeholder="e.g. Chandni Chowk, Delhi, India"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                className="bg-background"
              />
            </div>
            
            {supplier && (
              <div className="space-y-2">
                <label className="text-xs font-semibold">Supplier Status *</label>
                <Select
                  value={supplierForm.status}
                  onValueChange={(val) => setSupplierForm({ ...supplierForm, status: val })}
                >
                  <SelectTrigger className="w-full bg-background">
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
              {isLoading ? "Saving..." : supplier ? "Update Supplier" : "Save Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
