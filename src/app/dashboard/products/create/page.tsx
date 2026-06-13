"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useGetProductByIdQuery } from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle } from "lucide-react";

// Static import for Step 1 so it loads immediately
import { BasicInfoStep, BasicInfoStepRef } from "./_components/BasicInfoStep";

// Dynamic lazy imports for Steps 2 to 5 to optimize bundle sizes
const ColorsSizesStep = dynamic(
  () => import("./_components/ColorsSizesStep").then((mod) => mod.ColorsSizesStep),
  { ssr: false }
);

const VariantsStep = dynamic(
  () => import("./_components/VariantsStep").then((mod) => mod.VariantsStep),
  { ssr: false }
);

const MediaStep = dynamic(
  () => import("./_components/MediaStep").then((mod) => mod.MediaStep),
  { ssr: false }
);

const SpecificationsStep = dynamic(
  () => import("./_components/SpecificationsStep").then((mod) => mod.SpecificationsStep),
  { ssr: false }
);

export default function ProgressiveCreateProductPage() {
  // 1. Basic Navigation & Creation States
  const [productId, setProductId] = React.useState<string | null>(null);
  const [activeSection, setActiveSection] = React.useState<1 | 2 | 3 | 4 | 5>(1);
  const [isEditingBasic, setIsEditingBasic] = React.useState(true);
  const [basePrice, setBasePrice] = React.useState("");

  // Feedback states
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasDraftLoaded, setHasDraftLoaded] = React.useState(false);

  // Ref to Step 1 component for draft actions
  const basicInfoRef = React.useRef<BasicInfoStepRef | null>(null);

  // 2. Dynamic Product Fetch (enabled once productId is generated)
  const { data: productData, refetch: refetchProduct } = useGetProductByIdQuery(
    productId ?? "",
    { skip: !productId }
  );
  const product = productData?.data;

  // Sync basePrice if product details are fetched
  React.useEffect(() => {
    if (product?.price) {
      setBasePrice(String(product.price));
    }
  }, [product?.price]);

  const handleSaveSuccess = (newProductId: string, price: string) => {
    setProductId(newProductId);
    setBasePrice(price);
  };

  const handleDiscardDraft = () => {
    basicInfoRef.current?.discardDraft();
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section */}
      <div className="flex items-center justify-between gap-3 w-full border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 bg-background border-input text-foreground hover:bg-accent">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
              {hasDraftLoaded && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  Draft Loaded
                </span>
              )}
              {productId && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize font-mono text-[10px]">
                  Draft Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Configure product details, variants, media, and specifications step-by-step.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasDraftLoaded && !productId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDiscardDraft}
              className="hover:bg-destructive hover:text-destructive-foreground border-border text-muted-foreground hover:text-foreground h-8 text-xs font-semibold"
            >
              Discard Draft
            </Button>
          )}
          {productId && (
            <Button asChild variant="default" size="sm" className="h-8 font-semibold shadow-sm">
              <Link href="/dashboard/products">
                Complete Listing
              </Link>
            </Button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Operation Failed</p>
            <p className="mt-0.5 text-xs opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Stacked Cards Sections */}
      <div className="space-y-6 w-full">
        {/* Step 1: Basic Info */}
        <BasicInfoStep
          ref={basicInfoRef}
          productId={productId}
          product={product}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isEditingBasic={isEditingBasic}
          setIsEditingBasic={setIsEditingBasic}
          onSaveSuccess={handleSaveSuccess}
          onDraftStatusChange={setHasDraftLoaded}
          setErrorMessage={setErrorMessage}
        />

        {/* Step 2: Colors & Sizes */}
        <ColorsSizesStep
          productId={productId ?? ""}
          product={product}
          refetchProduct={refetchProduct}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Step 3: Stock Variants */}
        <VariantsStep
          productId={productId ?? ""}
          product={product}
          refetchProduct={refetchProduct}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          basePrice={basePrice}
        />

        {/* Step 4: Media & Gallery */}
        <MediaStep
          productId={productId ?? ""}
          product={product}
          refetchProduct={refetchProduct}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Step 5: Specifications */}
        <SpecificationsStep
          productId={productId ?? ""}
          product={product}
          refetchProduct={refetchProduct}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
}
