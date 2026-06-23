"use client";

import React from "react";
import { useGetSuppliersQuery, useUpdateSupplierMutation } from "@/services/api/inventory/inventory-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, RefreshCw, MoreHorizontal, Pencil, ShieldAlert, Ban, Power } from "lucide-react";

interface SuppliersTabProps {
  onAddSupplierClick: () => void;
  onEditSupplierClick: (supplier: any) => void;
  refetchTrigger?: number;
}

export function SuppliersTab({
  onAddSupplierClick,
  onEditSupplierClick,
  refetchTrigger = 0,
}: SuppliersTabProps) {
  const {
    data: suppliersRes,
    isLoading: isSuppliersLoading,
    isFetching: isSuppliersFetching,
    refetch: refetchSuppliers,
  } = useGetSuppliersQuery();

  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  React.useEffect(() => {
    if (refetchTrigger > 0) {
      refetchSuppliers();
    }
  }, [refetchTrigger, refetchSuppliers]);

  const handleStatusChange = async (supplier: any, newStatus: string) => {
    try {
      await updateSupplier({
        id: supplier.id,
        body: {
          name: supplier.name,
          email: supplier.email,
          status: newStatus,
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const suppliersList = suppliersRes?.data ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 font-semibold">
            Active
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-900/40 dark:text-stone-400 dark:border-stone-800 font-medium">
            Inactive
          </Badge>
        );
      case "TEMPORARILY_CLOSED":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 font-medium">
            Temporarily Closed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-stone-50 text-stone-600 border-stone-200 font-medium">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">Supplier Directory</h2>
        <div className="flex gap-2">
          <Button
            onClick={onAddSupplierClick}
            className="bg-stone-900 hover:bg-stone-850 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold gap-2 shadow-sm transition-all duration-200 hover:-translate-y-[1px]"
          >
            <Plus size={16} /> Add Supplier
          </Button>
          <Button
            onClick={() => refetchSuppliers()}
            variant="outline"
            className="bg-white dark:bg-stone-950"
            disabled={isSuppliersFetching}
          >
            <RefreshCw size={14} className={`${isSuppliersFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm transition-all duration-300">
        {isSuppliersLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : suppliersList.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No suppliers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/70 dark:bg-stone-900/40">
                <TableRow className="border-b border-stone-200 dark:border-stone-800">
                  <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Vendor / Company
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Contact Person
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Email Address
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Phone Number
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Status
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                {suppliersList.map((sup: any) => (
                  <TableRow
                    key={sup.id}
                    className="border-b hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                  >
                    <TableCell className="py-4 pl-6 font-semibold text-xs text-stone-900 dark:text-stone-50">
                      {sup.name}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {sup.contactName || "—"}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {sup.email}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {sup.phone || "—"}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(sup.status || "ACTIVE")}
                    </TableCell>
                    <TableCell className="py-4 text-center pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                          <DropdownMenuLabel className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
                          <DropdownMenuItem
                            onClick={() => onEditSupplierClick(sup)}
                            className="cursor-pointer text-xs flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
                          <DropdownMenuLabel className="text-[9px] text-stone-400 uppercase tracking-widest px-2 py-1">
                            Set Status
                          </DropdownMenuLabel>
                          
                          <DropdownMenuItem
                            disabled={sup.status === "ACTIVE"}
                            onClick={() => handleStatusChange(sup, "ACTIVE")}
                            className="cursor-pointer text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            <Power className="h-3.5 w-3.5" />
                            Mark Active
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            disabled={sup.status === "TEMPORARILY_CLOSED"}
                            onClick={() => handleStatusChange(sup, "TEMPORARILY_CLOSED")}
                            className="cursor-pointer text-xs flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Temporarily Closed
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            disabled={sup.status === "INACTIVE"}
                            onClick={() => handleStatusChange(sup, "INACTIVE")}
                            className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Mark Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
