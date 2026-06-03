import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-background">
      <div className="relative flex max-w-md w-full flex-col items-center p-8 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-xl overflow-hidden group">
        {/* Subtle glowing card glow */}
        <div className="absolute -inset-px bg-gradient-to-br from-muted/5 to-transparent rounded-2xl opacity-70 blur-lg -z-10" />

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground border border-border/30 shadow-inner">
          <FileQuestion className="h-7 w-7" />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          404
        </h1>
        <p className="text-base font-semibold text-foreground mb-2">
          Page Not Found
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The page you are looking for does not exist or has been relocated to another address.
        </p>

        <Button
          asChild
          className="w-full gap-2 rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
        >
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
