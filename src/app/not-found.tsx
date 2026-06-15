import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center bg-[#f9f5f0] font-[var(--font-corano)] text-[#222222]">
      <div className="relative flex max-w-md w-full flex-col items-center p-8 border border-[#e4dfd7] bg-white shadow-sm overflow-hidden">
        
        <div className="mb-6 flex h-14 w-14 items-center justify-center bg-[#f9f5f0] border border-[#e4dfd7] text-[#c29958]">
          <HelpCircle className="h-7 w-7" />
        </div>
        
        <h1 className="text-4xl font-serif font-medium text-[#222222] mb-2">
          404
        </h1>
        <p className="text-sm font-bold uppercase tracking-wider text-[#c29958] mb-3">
          Design or Collection Not Found
        </p>
        <p className="text-xs text-[#777777] leading-relaxed mb-8">
          The jewelry design or page you are looking for is currently not available, or the address may have changed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            asChild
            className="flex-1 bg-[#222222] text-white hover:bg-[#c29958] rounded-none h-11 text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-[#e4dfd7] text-[#555] hover:border-[#222] hover:text-[#222] rounded-none h-11 text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-white"
          >
            <Link href="/">
              <span>Go Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
