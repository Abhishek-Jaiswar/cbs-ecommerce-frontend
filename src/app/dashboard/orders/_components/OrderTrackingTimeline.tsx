"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingTimelineProps {
  status: string;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ status }) => {
  const steps = [
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
  ];

  const isCancelled = status === "CANCELLED";
  const isFailed = status === "FAILED";

  if (isCancelled || isFailed) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 mb-6">
        <AlertCircle size={16} />
        This order was {status === "CANCELLED" ? "Cancelled" : "Failed"}.
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.value === status);

  return (
    <div className="mb-6 pt-2 pb-4 border-b">
      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-4">
        Fulfillment Timeline
      </div>
      <div className="flex items-center justify-between relative w-full px-2">
        {/* Progress bar line - container spans exactly between centers of first and last circles */}
        <div className="absolute left-[18px] right-[18px] top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-stone-850 z-0">
          {/* Active progress bar - matches parent width exactly up to current step */}
          <div
            className="h-full bg-[#c29958] transition-all duration-300"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div
              key={step.value}
              className="flex flex-col items-center z-10 relative"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all border",
                  isCompleted
                    ? "bg-[#c29958] text-white border-[#c29958] shadow-[0_0_8px_rgba(194,153,88,0.4)]"
                    : "bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800",
                )}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 font-semibold transition-colors",
                  isActive
                    ? "text-[#c29958]"
                    : isCompleted
                      ? "text-stone-700 dark:text-stone-300"
                      : "text-stone-400",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

OrderTrackingTimeline.displayName = "OrderTrackingTimeline";
