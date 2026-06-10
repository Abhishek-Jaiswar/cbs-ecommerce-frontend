"use client";

import * as React from "react";
import { useGetAdminProductListingQuery, useDeleteProductMutation } from "@/services/api/products/products-api";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

const AllProducts = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data, isLoading, isError, refetch } = useGetAdminProductListingQuery({
    page,
    limit,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data.items ?? [];
  const pageCount = data?.data.totalPages ?? 1;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-80 sm:w-96 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="h-10 w-36 bg-muted animate-pulse rounded-md self-start sm:self-auto" />
        </div>
        <div className="border border-border bg-card rounded-md p-4 space-y-4">
          <div className="h-10 bg-muted/60 animate-pulse rounded-md" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/40 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Error Loading Products</h2>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          There was an issue fetching the product listings. Please ensure your backend server is active and connected.
        </p>
        <Button onClick={refetch} variant="outline" className="gap-2 mt-2">
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const cols = columns(handleDelete);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{data?.data.total ?? 0}</span> total products — including drafts, inactive, and archived.
          </p>
        </div>
        <Button asChild className="self-start sm:self-auto shadow-sm gap-2">
          <Link href="/dashboard/products/create">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <DataTable
        columns={cols}
        data={products}
        pageCount={pageCount}
        currentPage={page}
        pageSize={limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default AllProducts;
