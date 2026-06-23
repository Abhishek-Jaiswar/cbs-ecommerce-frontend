"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-stone-500 hover:text-[#c29958] transition-colors bg-transparent border-0 cursor-pointer"
      onClick={handleShare}
    >
      <Share2 className="h-3.5 w-3.5" />
      Share
    </button>
  );
}
