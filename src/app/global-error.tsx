"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to console or error-reporting service
    console.error("Critical root layout error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-50 font-sans">
        <div className="relative flex max-w-md w-full flex-col items-center p-8 rounded-2xl border border-red-500/20 bg-red-950/20 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute -inset-px bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-75 blur-lg -z-10 animate-pulse" />

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner">
            <AlertOctagon className="h-7 w-7" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Critical App Error
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            A critical system error occurred in the core application engine. We have logged the trace details. Please try restoring.
          </p>

          <Button
            onClick={() => reset()}
            className="w-full gap-2 rounded-xl h-11 bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/20 hover:scale-[1.01]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restore Application</span>
          </Button>
        </div>
      </body>
    </html>
  );
}
