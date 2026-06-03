"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction, Clock, Sparkles } from "lucide-react";

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

export function UnderDevelopment({ title, description }: UnderDevelopmentProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10 min-h-[70vh] bg-background">
      <div className="relative flex flex-col items-center max-w-md w-full text-center p-8 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden group">
        {/* Animated Glow in the background */}
        <div className="absolute -inset-px bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-2xl opacity-70 blur-lg -z-10 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated construction icon badge */}
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 text-violet-500 border border-violet-500/20 shadow-inner">
          <Construction className="h-8 w-8 animate-bounce" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center text-[8px] text-white font-bold">
              <Clock className="h-2 w-2" />
            </span>
          </span>
        </div>

        {/* Text Details */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          {title}
        </h1>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 mb-4 border border-violet-500/20">
          <Sparkles className="h-3 w-3" />
          <span>Feature Under Development</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {description || "Our team is currently building this page and linking it with our high-performance backend APIs. Check back soon for updates!"}
        </p>

        {/* Action Button */}
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="w-full gap-2 rounded-xl h-11 border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Overview</span>
        </Button>
      </div>
    </div>
  );
}
