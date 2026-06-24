"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetOffersQuery } from "@/services/api/promotions/promotions-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles, Percent } from "lucide-react";

export function OfferModal() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const { data: offersData, isLoading } = useGetOffersQuery(
    { page: 1, limit: 10 },
    { skip: isDashboard }
  );
  const [open, setOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<any>(null);

  useEffect(() => {
    if (isLoading || !offersData?.data?.items) return;

    const offers = offersData.data.items;
    
    // Find the highest priority active offer within valid dates
    const now = new Date();
    const activeOffer = offers
      .filter((offer) => {
        if (!offer.isActive) return false;
        if (offer.startsAt && new Date(offer.startsAt) > now) return false;
        if (offer.endsAt && new Date(offer.endsAt) < now) return false;
        return true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];

    if (activeOffer) {
      // Check session storage to see if they've already seen this specific offer
      const sessionKey = `seen-offer-${activeOffer.id}`;
      const hasSeen = sessionStorage.getItem(sessionKey);
      
      if (!hasSeen) {
        setCurrentOffer(activeOffer);
        // Show after a brief delay (1.5 seconds) to let page load first (feels premium)
        const timer = setTimeout(() => {
          setOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [offersData, isLoading]);

  const handleClose = () => {
    setOpen(false);
    if (currentOffer) {
      sessionStorage.setItem(`seen-offer-${currentOffer.id}`, "true");
    }
  };

  const handleCta = () => {
    handleClose();
    if (currentOffer?.categories && currentOffer.categories.length > 0) {
      // Link to first category slug if available
      const catSlug = currentOffer.categories[0].category?.slug;
      if (catSlug) {
        router.push(`/shop?category=${catSlug}`);
        return;
      }
    }
    router.push("/shop");
  };

  if (isDashboard) return null;
  if (!currentOffer) return null;

  const isPercentage = currentOffer.discountType === "PERCENTAGE";
  const displayDiscount = isPercentage 
    ? `${currentOffer.discountValue}% OFF` 
    : `$${currentOffer.discountValue} OFF`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden border border-[#e8dcc4] rounded-2xl bg-white shadow-2xl animate-in fade-in-50 zoom-in-95 duration-300 [&_button.absolute]:text-white/80 [&_button.absolute]:hover:text-white [&_button.absolute]:hover:bg-white/10">
        
        {/* Banner Accent Header */}
        <div className="bg-[#111111] text-white p-6 relative overflow-hidden text-center flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#332a1b] via-[#111111] to-[#111111] opacity-70 pointer-events-none" />
          <div className="relative z-10 bg-[#c29958]/20 p-3 rounded-full border border-[#c29958]/40 mb-3 animate-bounce">
            <Gift className="h-6 w-6 text-[#c29958]" />
          </div>
          <p className="relative z-10 text-xs font-semibold tracking-[0.25em] text-[#c29958] uppercase font-sans mb-1">
            Exclusive Deal
          </p>
          <DialogTitle className="relative z-10 text-2xl font-serif font-medium text-white tracking-wide leading-tight">
            {currentOffer.name}
          </DialogTitle>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-center bg-gradient-to-b from-[#faf8f5] to-white">
          
          {/* Big Discount Value Display */}
          <div className="py-2">
            <div className="inline-flex items-center justify-center bg-white border border-[#f0e6d2] px-6 py-4 rounded-3xl shadow-sm">
              <span className="text-4xl md:text-5xl font-serif font-bold text-[#c29958] tracking-tight">
                {displayDiscount}
              </span>
              <Sparkles className="h-5 w-5 text-[#c29958] ml-2 animate-pulse" />
            </div>
          </div>

          <DialogDescription className="text-sm font-sans text-gray-600 leading-relaxed max-w-sm mx-auto">
            {currentOffer.description || "Take advantage of our limited-time special promotional pricing on selected items."}
          </DialogDescription>

          {/* Applicable categories or products list */}
          {(currentOffer.categories?.length > 0 || currentOffer.products?.length > 0) && (
            <div className="space-y-2 border-t border-[#f2eae1] pt-4">
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase font-sans">
                Applicable On
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto px-2">
                {currentOffer.categories?.map((cat: any) => (
                  <Badge key={cat.categoryId} variant="secondary" className="bg-[#c29958]/10 text-[#a07a3c] border border-[#c29958]/20 hover:bg-[#c29958]/20 rounded-full text-xs py-0.5 px-3">
                    {cat.category?.name || "Category"}
                  </Badge>
                ))}
                {currentOffer.products?.map((prod: any) => (
                  <Badge key={prod.productId} variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs py-0.5 px-3">
                    {prod.product?.name || "Product"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleCta}
              className="h-12 w-full rounded-xl bg-[#222222] text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#c29958] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Percent className="h-4 w-4" />
              Claim Offer & Shop Now
            </Button>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              className="h-10 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
            >
              No thanks, continue browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
