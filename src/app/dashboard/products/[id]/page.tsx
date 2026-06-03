"use client";

import * as React from "react";
import Link from "next/link";
import {
  useGetProductByIdQuery,
  useUpdateStatusMutation,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
} from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { EditBasicInfoCard } from "./_components/edit-basic-info-card";
import { EditColorsSizesCard } from "./_components/edit-colors-sizes-card";
import { EditVariantsCard } from "./_components/edit-variants-card";
import { EditMediaCard } from "./_components/edit-media-card";
import { EditSpecsCard } from "./_components/edit-specs-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductEditPage({ params }: PageProps) {
  const { id } = React.use(params);

  // 1. Static Metadata Queries
  const { data: categoriesData, isLoading: isLoadingCats } = useGetCategoriesQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetProductTagsQuery();

  const categories = categoriesData?.data?.items ?? [];
  const brands = brandsData?.data?.items ?? [];
  const tags = tagsData?.data?.items ?? [];

  // 2. Active Product Query
  const { data: productData, isLoading: isLoadingProduct, isError, refetch: refetchProduct } = useGetProductByIdQuery(id);
  const product = productData?.data;

  // 3. API Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();

  // Status Selector Change Handler
  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const isLoadingMeta = isLoadingCats || isLoadingBrands || isLoadingTags;
  const isLoading = isLoadingProduct || isLoadingMeta;

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
          <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-muted animate-pulse rounded-md w-full" />
          <div className="h-40 bg-muted animate-pulse rounded-md w-full" />
          <div className="h-40 bg-muted animate-pulse rounded-md w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The requested product ID does not exist or has been deleted from the database catalog.
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard/products">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section with back nav and status picker */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 bg-background border-input text-foreground hover:bg-accent">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize font-mono text-[10px]">
                {product.status.toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">ID: {product.id}</p>
          </div>
        </div>

        {/* Quick status toggle */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs text-muted-foreground font-medium">Catalog Status:</span>
          <Select value={product.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
            <SelectTrigger className="w-[140px] bg-background border-input text-foreground font-medium h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE" className="cursor-pointer">Active</SelectItem>
              <SelectItem value="DRAFT" className="cursor-pointer">Draft</SelectItem>
              <SelectItem value="INACTIVE" className="cursor-pointer">Inactive</SelectItem>
              <SelectItem value="ARCHIVED" className="cursor-pointer">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stacked Cards Sections */}
      <div className="space-y-6 w-full">
        <EditBasicInfoCard
          productId={id}
          product={product}
          categories={categories}
          brands={brands}
          tags={tags}
          refetchProduct={refetchProduct}
        />

        <EditColorsSizesCard
          productId={id}
          product={product}
          refetchProduct={refetchProduct}
        />

        <EditVariantsCard
          productId={id}
          product={product}
          refetchProduct={refetchProduct}
        />

        <EditMediaCard
          productId={id}
          product={product}
          refetchProduct={refetchProduct}
        />

        <EditSpecsCard
          productId={id}
          product={product}
          refetchProduct={refetchProduct}
        />
      </div>
    </div>
  );
}
