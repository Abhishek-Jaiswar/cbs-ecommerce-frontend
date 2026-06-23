"use client";

import React, { useState } from "react";
import { useGetTransactionsQuery } from "@/services/api/inventory/inventory-api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export function AuditLedgerTab() {
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerLimit] = useState(10);
  const [ledgerType, setLedgerType] = useState("ALL");

  const {
    data: ledgerRes,
    isLoading: isLedgerLoading,
    refetch: refetchLedger,
  } = useGetTransactionsQuery({
    page: ledgerPage,
    limit: ledgerLimit,
    type: ledgerType === "ALL" ? undefined : ledgerType,
  });

  const ledgerData = ledgerRes?.data;
  const ledgerItems = ledgerData?.items ?? [];
  const ledgerTotalPages = ledgerData?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
          Tamper-Proof Stock Transaction Ledger
        </h2>
        <div className="flex gap-2">
          <Select
            value={ledgerType}
            onValueChange={(val) => {
              setLedgerType(val);
              setLedgerPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] bg-white dark:bg-stone-950">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Transactions</SelectItem>
              <SelectItem value="ORDER_RESERVED">ORDER_RESERVED</SelectItem>
              <SelectItem value="ORDER_SHIPPED">ORDER_SHIPPED</SelectItem>
              <SelectItem value="ORDER_CANCELLED">ORDER_CANCELLED</SelectItem>
              <SelectItem value="REPLENISHMENT">REPLENISHMENT</SelectItem>
              <SelectItem value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT</SelectItem>
              <SelectItem value="SHRINKAGE">SHRINKAGE</SelectItem>
              <SelectItem value="CUSTOMER_RETURN">CUSTOMER_RETURN</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetchLedger()} variant="outline" className="bg-white dark:bg-stone-950">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isLedgerLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : ledgerItems.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No ledger transactions logged.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b">
                    <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Timestamp
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Variant/SKU
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Type
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center">
                      Change
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      Prev Available
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">
                      New Available
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 pr-6">
                      Reason
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {ledgerItems.map((tx: any) => {
                    let changeBadge = (
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200">
                        +{tx.qtyChange}
                      </Badge>
                    );
                    if (tx.qtyChange < 0) {
                      changeBadge = (
                        <Badge className="bg-rose-50 text-rose-800 border-rose-200">
                          {tx.qtyChange}
                        </Badge>
                      );
                    } else if (tx.qtyChange === 0) {
                      changeBadge = (
                        <Badge variant="outline" className="bg-stone-50 text-stone-850">
                          0
                        </Badge>
                      );
                    }

                    return (
                      <TableRow
                        key={tx.id}
                        className="border-b text-xs hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell className="pl-6 py-3 text-stone-400">
                          {new Date(tx.createdAt).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="font-semibold text-stone-950 dark:text-stone-50">
                            {tx.variant?.product?.name}
                          </span>
                          <span className="block text-[10px] text-stone-400">
                            {tx.variant?.sku}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="text-[10px] font-bold tracking-wider">
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-center">{changeBadge}</TableCell>
                        <TableCell className="py-3 text-right text-stone-500">
                          {tx.previousQty}
                        </TableCell>
                        <TableCell className="py-3 text-right font-bold">
                          {tx.newQty}
                        </TableCell>
                        <TableCell className="py-3 text-stone-500 pr-6">{tx.reason || "N/A"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {ledgerTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400">
                  Page {ledgerPage} of {ledgerTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={ledgerPage <= 1}
                    onClick={() => setLedgerPage(ledgerPage - 1)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={ledgerPage >= ledgerTotalPages}
                    onClick={() => setLedgerPage(ledgerPage + 1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
