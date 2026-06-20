"use client";

import React, { useState } from "react";
import { PurchaseOrdersTab } from "../_components/purchase-orders-tab";
import { CreatePoDialog } from "../_components/create-po-dialog";
import { ReceivePoDialog } from "../_components/receive-po-dialog";

export default function AdminPurchaseOrdersPage() {
  const [isPoDialogOpen, setIsPoDialogOpen] = useState(false);
  const [receivingPo, setReceivingPo] = useState<any>(null);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);

  const [poRefetchTrigger, setPoRefetchTrigger] = useState(0);

  const handleReceivePoClick = (po: any) => {
    setReceivingPo(po);
    setIsReceiveDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-955 dark:text-stone-50">
            Purchase Orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Draft, approve, and track vendor replenishment orders, and check in goods receipt.
          </p>
        </div>
      </div>

      <PurchaseOrdersTab
        onCreatePoClick={() => setIsPoDialogOpen(true)}
        onReceivePoClick={handleReceivePoClick}
        refetchTrigger={poRefetchTrigger}
      />

      <CreatePoDialog
        open={isPoDialogOpen}
        onOpenChange={setIsPoDialogOpen}
        onSuccess={() => setPoRefetchTrigger((prev) => prev + 1)}
      />

      <ReceivePoDialog
        open={isReceiveDialogOpen}
        onOpenChange={setIsReceiveDialogOpen}
        po={receivingPo}
        onSuccess={() => setPoRefetchTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
