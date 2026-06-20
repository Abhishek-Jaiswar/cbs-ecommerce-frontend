"use client";

import React, { useState } from "react";
import {
  useGetPurchaseOrdersQuery,
  useUpdatePurchaseOrderStatusMutation,
  useGetPurchaseOrderByIdQuery,
} from "@/services/api/inventory/inventory-api";
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
import { Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PurchaseOrdersTabProps {
  onCreatePoClick: () => void;
  onReceivePoClick: (po: any) => void;
  refetchTrigger?: number;
}

export function PurchaseOrdersTab({
  onCreatePoClick,
  onReceivePoClick,
  refetchTrigger = 0,
}: PurchaseOrdersTabProps) {
  const [poPage, setPoPage] = useState(1);
  const [poLimit] = useState(10);

  const {
    data: poRes,
    isLoading: isPoLoading,
    refetch: refetchPo,
  } = useGetPurchaseOrdersQuery({
    page: poPage,
    limit: poLimit,
  });

  // React to parent refresh triggers
  React.useEffect(() => {
    if (refetchTrigger > 0) {
      refetchPo();
    }
  }, [refetchTrigger, refetchPo]);

  const [updatePurchaseOrderStatus] = useUpdatePurchaseOrderStatusMutation();

  const poData = poRes?.data;
  const poList = poData?.items ?? [];
  const poTotalPages = poData?.totalPages ?? 1;

  // Dialog states for "Approve & Send"
  const [selectedPoIdForSend, setSelectedPoIdForSend] = useState<string | null>(null);
  const [supplierEmail, setSupplierEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch full PO details when opening dialog
  const { data: poDetailsRes, isLoading: isDetailsLoading } = useGetPurchaseOrderByIdQuery(
    selectedPoIdForSend ?? "",
    { skip: !selectedPoIdForSend }
  );

  const poDetails = poDetailsRes?.data;

  // Prefill fields when details load
  React.useEffect(() => {
    if (poDetails) {
      setSupplierEmail(poDetails.supplier?.email ?? "");
      setEmailSubject(`Purchase Order ${poDetails.poNumber} - ZenVoraa`);
      setCustomNotes(poDetails.notes ?? "");
    }
  }, [poDetails]);

  const handleOpenSendDialog = (poId: string) => {
    setSelectedPoIdForSend(poId);
    setSupplierEmail("");
    setEmailSubject("");
    setCustomNotes("");
  };

  const handleConfirmSendPO = async () => {
    if (!selectedPoIdForSend) return;
    setIsSending(true);
    try {
      await updatePurchaseOrderStatus({
        id: selectedPoIdForSend,
        status: "SENT",
        email: supplierEmail,
        subject: emailSubject,
        customNotes: customNotes,
      }).unwrap();
      refetchPo();
      setSelectedPoIdForSend(null);
    } catch (err) {
      console.error("Failed to send PO:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelPO = async (poId: string) => {
    try {
      await updatePurchaseOrderStatus({ id: poId, status: "CANCELLED" }).unwrap();
      refetchPo();
    } catch (err) {
      console.error("Failed to cancel PO:", err);
    }
  };

  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(String(price)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
          Vendor Replenishment (Purchase Orders)
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={onCreatePoClick}
            className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold gap-2"
          >
            <Plus size={16} /> Create PO
          </Button>
          <Button onClick={() => refetchPo()} variant="outline" className="bg-white dark:bg-stone-950">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isPoLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : poList.length === 0 ? (
          <div className="h-64 flex justify-center items-center italic text-stone-400 text-sm">
            No replenishment orders recorded.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b">
                    <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      PO Number
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Supplier
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Status
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Total Value
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Created Date
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {poList.map((po: any) => {
                    let statusColor = "bg-stone-100 text-stone-850";
                    if (po.status === "SENT") statusColor = "bg-blue-50 text-blue-800 border-blue-200";
                    if (po.status === "PARTIALLY_RECEIVED")
                      statusColor = "bg-amber-50 text-amber-800 border-amber-200";
                    if (po.status === "RECEIVED")
                      statusColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    if (po.status === "CANCELLED")
                      statusColor = "bg-rose-50 text-rose-800 border-rose-200";

                    const isDraft = po.status === "DRAFT";
                    const canReceive = po.status === "SENT" || po.status === "PARTIALLY_RECEIVED";

                    return (
                      <TableRow
                        key={po.id}
                        className="border-b text-xs hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell className="pl-6 py-4 font-bold text-stone-950 dark:text-stone-50">
                          {po.poNumber}
                        </TableCell>
                        <TableCell className="py-4">{po.supplier?.name || "—"}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={`${statusColor} rounded-md font-semibold`}>
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 font-semibold">
                          {formatPrice(po.totalAmount)}
                        </TableCell>
                        <TableCell className="py-4 text-stone-400">
                          {new Date(po.createdAt).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="py-4 text-center pr-6 flex justify-center gap-1.5">
                          {isDraft && (
                            <>
                              <Button
                                onClick={() => handleOpenSendDialog(po.id)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-7 px-2.5 text-[10px] uppercase"
                              >
                                Approve & Send
                              </Button>
                              <Button
                                onClick={() => handleCancelPO(po.id)}
                                size="sm"
                                variant="ghost"
                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-7 px-2.5 text-[10px] uppercase"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {canReceive && (
                            <Button
                              onClick={() => onReceivePoClick(po)}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 px-2.5 text-[10px] uppercase"
                            >
                              Receive Items
                            </Button>
                          )}
                          {!isDraft && !canReceive && (
                            <span className="text-stone-400 italic text-[10px]">Closed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {poTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400">
                  Page {poPage} of {poTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={poPage <= 1}
                    onClick={() => setPoPage(poPage - 1)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={poPage >= poTotalPages}
                    onClick={() => setPoPage(poPage + 1)}
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

      {/* Approve & Send Dialog */}
      <Dialog
        open={!!selectedPoIdForSend}
        onOpenChange={(open) => {
          if (!open && !isSending) {
            setSelectedPoIdForSend(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900 dark:text-stone-50">
              Approve & Send Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 dark:text-stone-400">
              Review order details, verify the supplier's contact email, and add custom notes before sending.
            </DialogDescription>
          </DialogHeader>

          {isDetailsLoading ? (
            <div className="py-12 flex flex-col justify-center items-center gap-2">
              <RefreshCw size={24} className="animate-spin text-stone-400" />
              <span className="text-xs text-stone-500">Loading order details...</span>
            </div>
          ) : poDetails ? (
            <div className="space-y-4 my-2 text-xs">
              {/* Email Form Fields */}
              <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/20 border border-stone-100 dark:border-stone-800 rounded-lg">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Recipient Supplier Email
                  </label>
                  <Input
                    type="email"
                    placeholder="supplier@example.com"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="bg-white dark:bg-stone-900 h-9"
                  />
                  <p className="text-[10px] text-stone-400">
                    Order details will be sent directly to this email address.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Email Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Purchase Order Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="bg-white dark:bg-stone-900 h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Additional Instructions / Notes
                  </label>
                  <Textarea
                    placeholder="Enter any delivery instructions, terms, or other custom text to include in the email body..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="bg-white dark:bg-stone-900 min-h-[80px]"
                  />
                </div>
              </div>

              {/* Order Summary Preview */}
              <div className="border border-stone-200 dark:border-stone-850 rounded-lg overflow-hidden">
                <div className="bg-stone-50 dark:bg-stone-900/50 p-3 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {poDetails.poNumber}
                  </span>
                  <span className="text-stone-400 text-[10px]">
                    Supplier: {poDetails.supplier?.name}
                  </span>
                </div>
                <div className="p-3 max-h-[160px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-900">
                  {poDetails.items?.map((item: any) => (
                    <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {item.variant?.product?.name || "Product"}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {item.variant?.color ? `Color: ${item.variant.color.name}` : ""}
                          {item.variant?.size ? ` Size: ${item.variant.size.value}` : ""}
                          {item.variant?.sku ? ` | SKU: ${item.variant.sku}` : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <div>Qty: {item.quantityOrdered}</div>
                        <div className="text-[10px] text-stone-400">
                          {formatPrice(item.unitCost)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-stone-50/50 dark:bg-stone-900/20 p-3 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center font-bold text-stone-900 dark:text-stone-50">
                  <span>Total Order Value</span>
                  <span className="text-stone-950 dark:text-stone-50">
                    {formatPrice(poDetails.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-500 italic">
              Failed to load order details.
            </div>
          )}

          <DialogFooter className="border-t border-stone-150 dark:border-stone-850 pt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={isSending}
              onClick={() => setSelectedPoIdForSend(null)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              disabled={isSending || isDetailsLoading || !supplierEmail}
              onClick={handleConfirmSendPO}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 uppercase"
            >
              {isSending ? "Sending..." : "Approve & Send PO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
