"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductListing } from "@/services/api/products/products-api.types";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash,
  Eye,
  Copy,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetProductByIdQuery, useCreateVariantMutation } from "@/services/api/products/products-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200",
  INACTIVE: "bg-amber-50 text-amber-700 border-amber-200",
  ARCHIVED: "bg-red-50 text-red-600 border-red-200",
};

interface AddVariantDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddVariantDialog: React.FC<AddVariantDialogProps> = ({
  productId,
  productName,
  open,
  onOpenChange,
}) => {
  const { data: productRes, isLoading, isError } = useGetProductByIdQuery(productId, { skip: !open });
  const [createVariant, { isLoading: isCreating }] = useCreateVariantMutation();

  const [colorId, setColorId] = React.useState("");
  const [sizeId, setSizeId] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setColorId("");
      setSizeId("");
      setPrice("");
      setStock("");
      setErrorMsg(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorId || !sizeId || !stock) {
      setErrorMsg("Color, Size and Stock quantity are required.");
      return;
    }
    setErrorMsg(null);
    try {
      await createVariant({
        productId,
        body: {
          colorId,
          sizeId,
          price: price ? parseFloat(price) : null,
          stock: parseInt(stock, 10),
        },
      }).unwrap();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || "Failed to create product variant");
    }
  };

  const productDetails = productRes?.data;
  const colors = productDetails?.colors ?? [];
  const sizes = productDetails?.sizes ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Variant: {productName}</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs text-muted-foreground">Loading options...</span>
            </div>
          ) : isError ? (
            <div className="text-sm text-destructive py-4 text-center">
              Failed to load product colors and sizes.
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {errorMsg && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md font-semibold">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Color Option *</label>
                <Select value={colorId} onValueChange={setColorId} required>
                  <SelectTrigger className="w-full bg-background border-input text-foreground">
                    <SelectValue placeholder={colors.length ? "Choose Color" : "No colors available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!colors.length && (
                  <p className="text-[10px] text-amber-600 font-medium">Please add colors in Edit Product page first.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Size Option *</label>
                <Select value={sizeId} onValueChange={setSizeId} required>
                  <SelectTrigger className="w-full bg-background border-input text-foreground">
                    <SelectValue placeholder={sizes.length ? "Choose Size" : "No sizes available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s: any) => (
                      <SelectItem key={s.id} value={s.id} className="cursor-pointer">{s.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!sizes.length && (
                  <p className="text-[10px] text-amber-600 font-medium">Please add sizes in Edit Product page first.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Price Override (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={`Inherit default: ₹${productDetails?.price || "0"}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-background border-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Stock Quantity *</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  min="0"
                  className="bg-background border-input text-sm"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating || isLoading || !colors.length || !sizes.length}
              className="min-w-[100px]"
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                "Add Variant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ActionsCellProps {
  product: ProductListing;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  product,
  onDelete,
  onStatusChange,
}) => {
  const [status, setStatus] = React.useState<string>(product.status ?? "DRAFT");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (onStatusChange) {
      setIsSaving(true);
      try {
        await onStatusChange(product.id, status);
        setIsOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/shop/${product.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                View Public
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/dashboard/products/${product.id}`}>
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                Edit Product
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsAddVariantOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
              Add Variant
            </DropdownMenuItem>

            {onStatusChange && (
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                  Change Status
                </DropdownMenuItem>
              </DialogTrigger>
            )}

            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[400px] bg-card text-foreground border-border">
          <DialogHeader>
            <DialogTitle>Change Product Status</DialogTitle>
            <div className="text-xs text-muted-foreground mt-1">
              Update the catalog visibility for{" "}
              <span className="font-semibold text-foreground">
                {product.name}
              </span>
              .
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Status Selection</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full bg-background border-input text-foreground">
                  <SelectValue placeholder="Choose Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[100px]"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                "Save Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddVariantDialog
        productId={product.id}
        productName={product.name}
        open={isAddVariantOpen}
        onOpenChange={setIsAddVariantOpen}
      />
    </>
  );
};

export const columns = (
  onDelete?: (id: string) => void,
  onStatusChange?: (id: string, status: string) => void,
): ColumnDef<ProductListing>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-accent -ml-4 font-semibold text-foreground"
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const slug = row.original.slug;

      return (
        <div className="flex flex-col gap-0.5 py-1">
          <Link
            href={`/shop/${slug}`}
            target="_blank"
            className="font-medium text-foreground hover:underline hover:text-primary transition-colors line-clamp-1"
          >
            {name}
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            {slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-accent -ml-4 font-semibold text-foreground"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string);
      const originalPrice = row.original.originalPrice
        ? parseFloat(row.original.originalPrice)
        : null;
      const costPrice = row.original.costPrice
        ? parseFloat(row.original.costPrice)
        : null;
      const profitMarginPercentage = row.original.profitMarginPercentage ?? null;

      const fmt = (n: number) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(n);

      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{fmt(price)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {fmt(originalPrice)}
              </span>
            )}
          </div>
          {costPrice !== null && (
            <div className="text-[10px] text-muted-foreground flex flex-col gap-0.5">
              <span>Cost: {fmt(costPrice)}</span>
              {profitMarginPercentage !== null && (
                <span className={profitMarginPercentage >= 30 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                  Margin: {profitMarginPercentage}%
                </span>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "DRAFT";
      const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;

      return (
        <Badge
          variant="outline"
          className={`${style} capitalize text-[10px] px-2 py-0.5 font-semibold`}
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: "badges",
    header: "Attributes",
    cell: ({ row }) => {
      const { isNew, isFeatured, isSale, forListing } = row.original;

      return (
        <div className="flex flex-wrap gap-1">
          {forListing && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0"
            >
              Listed
            </Badge>
          )}
          {isNew && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0"
            >
              New
            </Badge>
          )}
          {isFeatured && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0"
            >
              Featured
            </Badge>
          )}
          {isSale && (
            <Badge
              variant="outline"
              className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0"
            >
              Sale
            </Badge>
          )}
          {!forListing && !isNew && !isFeatured && !isSale && (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },
  {
    id: "published",
    header: "Published At",
    cell: ({ row }) => {
      const publishedAt = row.original.createdAt as Date;

      return <span>{new Date(publishedAt).toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell
        product={row.original}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    ),
  },
];
