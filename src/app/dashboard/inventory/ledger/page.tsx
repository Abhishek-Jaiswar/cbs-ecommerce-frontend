"use client";

import React from "react";
import { AuditLedgerTab } from "../_components/audit-ledger-tab";

export default function AdminInventoryLedgerPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-955 dark:text-stone-50">
            Audit Ledger
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Review the immutable chronological transaction logs of all stock additions, deductions, and allocations.
          </p>
        </div>
      </div>

      <AuditLedgerTab />
    </div>
  );
}
