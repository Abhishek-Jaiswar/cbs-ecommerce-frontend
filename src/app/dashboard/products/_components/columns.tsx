"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductListing } from "@/services/api/products/products-api.types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash, Eye, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns = (onDelete?: (id: string) => void): ColumnDef<ProductListing>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent -ml-4 font-semibold text-foreground"
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const slug = row.original.slug as string;

      return (
        <div className="flex flex-col gap-1 py-1">
          <Link
            href={`/products`}
            className="font-medium text-foreground hover:underline hover:text-primary transition-colors line-clamp-1"
          >
            {name}
          </Link>
          <span className="font-mono text-xs text-muted-foreground">{slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "excerpt",
    header: "Description",
    cell: ({ row }) => {
      const excerpt = row.getValue("excerpt") as string;
      return <div className="text-muted-foreground line-clamp-1 max-w-[280px]">{excerpt}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent -ml-4 font-semibold text-foreground"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string);
      const originalPrice = row.original.originalPrice
        ? parseFloat(row.original.originalPrice)
        : null;

      const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price);

      const formattedOriginalPrice = originalPrice
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(originalPrice)
        : null;

      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "badges",
    header: "Attributes",
    cell: ({ row }) => {
      const isNew = row.original.isNew;
      const isFeatured = row.original.isFeatured;
      const isSale = row.original.isSale;

      return (
        <div className="flex flex-wrap gap-1">
          {isNew && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
              New
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
              Featured
            </Badge>
          )}
          {isSale && (
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0">
              Sale
            </Badge>
          )}
          {!isNew && !isFeatured && !isSale && (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
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
              <Link href={`/products`}>
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
      );
    },
  },
];
