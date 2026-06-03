import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Glowing gradient spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
          <div className="absolute inset-0 rounded-full border-4 border-neutral-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading assets...
        </p>
      </div>
    </div>
  );
}
