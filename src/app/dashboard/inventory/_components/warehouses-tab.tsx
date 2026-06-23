"use client";

import React from "react";
import { useGetWarehousesQuery, useUpdateWarehouseMutation } from "@/services/api/inventory/inventory-api";
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

interface WarehousesTabProps {
  onAddWarehouseClick: () => void;
  onEditWarehouseClick: (warehouse: any) => void;
  refetchTrigger?: number;
}

export function WarehousesTab({
  onAddWarehouseClick,
  onEditWarehouseClick,
  refetchTrigger = 0,
}: WarehousesTabProps) {
  const {
    data: warehousesRes,
    isLoading: isWarehousesLoading,
    isFetching: isWarehousesFetching,
    refetch: refetchWarehouses,
  } = useGetWarehousesQuery();

  const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();

  React.useEffect(() => {
    if (refetchTrigger > 0) {
      refetchWarehouses();
    }
  }, [refetchTrigger, refetchWarehouses]);

  const handleStatusChange = async (warehouse: any, newStatus: string) => {
    try {
      await updateWarehouse({
        id: warehouse.id,
        body: {
          name: warehouse.name,
          code: warehouse.code,
          addressLine: warehouse.addressLine,
          city: warehouse.city,
          state: warehouse.state,
          postalCode: warehouse.postalCode,
          country: warehouse.country,
          status: newStatus,
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update warehouse status:", err);
    }
  };

  const warehousesList = warehousesRes?.data ?? [];

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
        <h2 className="text-lg font-bold text-stone-955 dark:text-stone-50">Physical Locations (Warehouses)</h2>
        <div className="flex gap-2">
          <Button
            onClick={onAddWarehouseClick}
            className="bg-stone-900 hover:bg-stone-850 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold gap-2 shadow-sm transition-all duration-200 hover:-translate-y-[1px]"
          >
            <Plus size={16} /> Add Warehouse
          </Button>
          <Button
            onClick={() => refetchWarehouses()}
            variant="outline"
            className="bg-white dark:bg-stone-950"
            disabled={isWarehousesFetching}
          >
            <RefreshCw size={14} className={`${isWarehousesFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm transition-all duration-300">
        {isWarehousesLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : warehousesList.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No warehouses registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/70 dark:bg-stone-900/40">
                <TableRow className="border-b border-stone-200 dark:border-stone-800">
                  <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Location Code
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Warehouse Name
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Address Line
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    City / State
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Postal Code
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
                {warehousesList.map((wh: any) => (
                  <TableRow
                    key={wh.id}
                    className="border-b hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                  >
                    <TableCell className="py-4 pl-6 font-bold text-xs text-stone-900 dark:text-stone-50">
                      <span className="font-mono bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        {wh.code}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-xs text-stone-900 dark:text-stone-50">
                      {wh.name}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {wh.addressLine}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {wh.city}, {wh.state}
                    </TableCell>
                    <TableCell className="py-4 text-xs text-stone-600 dark:text-stone-400">
                      {wh.postalCode}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(wh.status || "ACTIVE")}
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
                            onClick={() => onEditWarehouseClick(wh)}
                            className="cursor-pointer text-xs flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Warehouse
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
                          <DropdownMenuLabel className="text-[9px] text-stone-400 uppercase tracking-widest px-2 py-1">
                            Set Status
                          </DropdownMenuLabel>
                          
                          <DropdownMenuItem
                            disabled={wh.status === "ACTIVE"}
                            onClick={() => handleStatusChange(wh, "ACTIVE")}
                            className="cursor-pointer text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            <Power className="h-3.5 w-3.5" />
                            Mark Active
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            disabled={wh.status === "TEMPORARILY_CLOSED"}
                            onClick={() => handleStatusChange(wh, "TEMPORARILY_CLOSED")}
                            className="cursor-pointer text-xs flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Temporarily Closed
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            disabled={wh.status === "INACTIVE"}
                            onClick={() => handleStatusChange(wh, "INACTIVE")}
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
