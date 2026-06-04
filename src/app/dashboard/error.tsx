"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const router = useRouter();

  React.useEffect(() => {
    // Log the error to console
    console.error("Dashboard route error boundary caught:", error);
  }, [error]);

  const handleReturnOverview = () => {
    router.push("/dashboard");
    // Force a router refresh to re-attempt loading state
    router.refresh();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 min-h-[70vh] bg-background text-foreground">
      <div className="relative flex flex-col items-center max-w-md w-full text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-md shadow-xl overflow-hidden group">
        {/* Animated Subtle Glow in the background */}
        <div className="absolute -inset-px bg-gradient-to-br from-destructive/10 to-red-500/10 rounded-2xl opacity-70 blur-lg -z-10" />
        
        {/* Warning icon badge */}
        <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Text Details */}
        <h1 className="text-xl font-bold tracking-tight text-foreground mb-2">
          Dashboard Error Occurred
        </h1>
        
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg mb-6 max-w-full font-mono break-all leading-tight">
          {error.message || "An unexpected error occurred inside the dashboard."}
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The dashboard encountered a layout or loading issue. You can try recovering the state by hitting retry, or navigating back to the overview panel.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={() => reset()}
            className="flex-1 gap-2 rounded-xl h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-350 shadow-md shadow-destructive/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
          <Button
            onClick={handleReturnOverview}
            variant="outline"
            className="flex-1 gap-2 rounded-xl h-11 border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
