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
} from "lucide-react";
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
