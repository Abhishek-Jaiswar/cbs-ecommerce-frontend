"use client";

import React from "react";
import {
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
} from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { IBrands, ICategories, ITag } from "@/services/api/products/products-api.types";

interface StepReviewProps {
  formData: {
    name: string;
    slug: string;
    excerpt: string;
    description: string;
    brandId: string;
    categoryId: string;
    tagIds: string[];
    price: string;
    originalPrice: string;
    isNew: boolean;
    isSale: boolean;
    isFeatured: boolean;
    forListing: boolean;
  };
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function StepReview({
  formData,
  onSubmit,
  onBack,
  isSubmitting,
}: StepReviewProps) {
  // Queries (instant cache resolution)
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const { data: tagsData } = useGetProductTagsQuery();

  const brandName =
    !formData.brandId || formData.brandId === "none"
      ? "None (No Brand)"
      : brandsData?.data?.items?.find((b: IBrands) => b.id === formData.brandId)?.name ?? "Unknown Brand";
  const categoryName =
    categoriesData?.data?.items?.find((c: ICategories) => c.id === formData.categoryId)?.name ?? "Unknown Category";
  
  const tagNames = formData.tagIds
    .map((tagId) => tagsData?.data?.items?.find((t: ITag) => t.id === tagId)?.name)
    .filter(Boolean);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(parseFloat(formData.price || "0"));

  const formattedOriginalPrice = formData.originalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(parseFloat(formData.originalPrice))
    : null;

  return (
    <div className="space-y-6 text-foreground">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-2">
          Verify Product Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-muted/20 p-4 sm:p-6 rounded-2xl border border-border/60">
          {/* Title */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Product Name</span>
            <p className="text-sm font-semibold text-foreground">{formData.name}</p>
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">URL Slug</span>
            <p className="text-sm font-mono text-foreground">{formData.slug}</p>
          </div>

          {/* Excerpt */}
          <div className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted-foreground font-medium">Short Excerpt</span>
            <p className="text-sm text-foreground leading-relaxed">{formData.excerpt}</p>
          </div>

          {/* Classification */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Category / Brand</span>
            <p className="text-sm font-medium text-foreground">
              {categoryName} / {brandName}
            </p>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Retail Pricing</span>
            <p className="text-sm font-medium text-foreground">
              {formattedPrice}
              {formattedOriginalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formattedOriginalPrice}
                </span>
              )}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center mb-1">Tags</span>
            <div className="flex flex-wrap gap-1">
              {tagNames.length > 0 ? (
                tagNames.map((name, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0">
                    {name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No tags selected</span>
              )}
            </div>
          </div>

          {/* Visibility and Flags */}
          <div className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted-foreground font-medium mb-1 flex">Attributes</span>
            <div className="flex flex-wrap gap-1.5">
              {formData.forListing && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-2 py-0">
                  Visible in Search
                </Badge>
              )}
              {formData.isNew && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-2 py-0">
                  New Product
                </Badge>
              )}
              {formData.isSale && (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-2 py-0">
                  On Sale
                </Badge>
              )}
              {formData.isFeatured && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2 py-0">
                  Featured Home
                </Badge>
              )}
              {!formData.forListing && !formData.isNew && !formData.isSale && !formData.isFeatured && (
                <span className="text-xs text-muted-foreground italic">Standard product settings</span>
              )}
            </div>
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
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" /> Previous Step
        </Button>
        
        <Button
          onClick={onSubmit}
          className="gap-2 shadow-sm rounded-lg min-w-[140px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" /> Submit & Publish
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
