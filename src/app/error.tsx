"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to console or error-reporting service
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center p-6 text-center bg-background">
      <div className="relative flex max-w-md w-full flex-col items-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-md shadow-xl overflow-hidden group">
        <div className="absolute -inset-px bg-gradient-to-br from-destructive/5 to-orange-500/5 rounded-2xl opacity-70 blur-lg -z-10" />

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
          <AlertTriangle className="h-7 w-7" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          An unexpected error occurred while loading this page. Our logs have been updated automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={() => reset()}
            className="flex-1 gap-2 rounded-xl h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-350 shadow-md shadow-destructive/25"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
            className="flex-1 gap-2 rounded-xl h-11 border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
