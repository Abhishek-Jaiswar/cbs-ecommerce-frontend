"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepPricingFlagsProps {
  price: string;
  setPrice: (v: string) => void;
  originalPrice: string;
  setOriginalPrice: (v: string) => void;
  isNew: boolean;
  setIsNew: (v: boolean) => void;
  isSale: boolean;
  setIsSale: (v: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  forListing: boolean;
  setForListing: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPricingFlags({
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  isNew,
  setIsNew,
  isSale,
  setIsSale,
  isFeatured,
  setIsFeatured,
  forListing,
  setForListing,
  onNext,
  onBack,
}: StepPricingFlagsProps) {
  // Enforces only numeric and single dot inputs
  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    // Strip everything except numbers and dots
    const sanitized = val.replace(/[^0-9.]/g, "");
    
    // Allow at most one decimal point
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      setter(parts[0] + "." + parts.slice(1).join(""));
    } else {
      setter(sanitized);
    }
  };

  // Derive errors dynamically to satisfy React rules
  const errors: Record<string, string> = {};
  if (price && parseFloat(price) <= 0) {
    errors.price = "Price must be a positive number greater than 0.";
  }
  if (price && originalPrice && parseFloat(originalPrice) <= parseFloat(price)) {
    errors.originalPrice = "Original price should typically be greater than the sale price.";
  }

  const isFormValid = price.trim().length > 0 && parseFloat(price) > 0 && !errors.price;

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleNextSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Pricing inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Retail Price (₹) *</label>
            <Input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => handleNumericInput(e.target.value, setPrice)}
              placeholder="e.g. 999.99"
              className={errors.price ? "border-destructive focus-visible:ring-destructive bg-background" : "bg-background border-input"}
              required
            />
            {errors.price && <p className="text-xs text-destructive font-medium">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Original/Compare Price (₹)</label>
            <Input
              type="text"
              inputMode="decimal"
              value={originalPrice}
              onChange={(e) => handleNumericInput(e.target.value, setOriginalPrice)}
              placeholder="e.g. 1199.99 (Optional)"
              className="bg-background border-input"
            />
            {errors.originalPrice && <p className="text-xs text-amber-600 font-medium">{errors.originalPrice}</p>}
          </div>
        </div>

        {/* Feature/catalog switches */}
        <div className="space-y-4 p-4 rounded-xl border border-border/60 bg-muted/20">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">List on Catalog</span>
              <p className="text-xs text-muted-foreground">Appears in search listings and shop indexes.</p>
            </div>
            <input
              type="checkbox"
              checked={forListing}
              onChange={(e) => setForListing(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Mark as New Product</span>
              <p className="text-xs text-muted-foreground">Displays a &apos;New&apos; badge next to the product.</p>
            </div>
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Mark as On Sale</span>
              <p className="text-xs text-muted-foreground">Displays a &apos;Sale&apos; tag and highlights markdown price.</p>
            </div>
            <input
              type="checkbox"
              checked={isSale}
              onChange={(e) => setIsSale(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Featured Product</span>
              <p className="text-xs text-muted-foreground">Promotes product to main home page carousels.</p>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2 border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Previous Step
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid}
          className="gap-2 shadow-sm rounded-lg"
        >
          Next Step <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
