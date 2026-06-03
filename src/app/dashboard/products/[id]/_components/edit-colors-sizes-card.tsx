"use client";

import * as React from "react";
import {
  useCreateColorMutation,
  useDeleteColorMutation,
  useCreateSizeMutation,
  useDeleteSizeMutation,
} from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus } from "lucide-react";

interface EditColorsSizesCardProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
}

export function EditColorsSizesCard({
  productId,
  product,
  refetchProduct,
}: EditColorsSizesCardProps) {
  const [createColor, { isLoading: isCreatingColor }] = useCreateColorMutation();
  const [deleteColor] = useDeleteColorMutation();
  const [createSize, { isLoading: isCreatingSize }] = useCreateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();

  // Inputs for Section 2
  const [newColorName, setNewColorName] = React.useState("");
  const [newColorHex, setNewColorHex] = React.useState("#ffd700");
  const [newSizeValue, setNewSizeValue] = React.useState("");

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName || !newColorHex) return;
    try {
      await createColor({
        productId,
        body: { name: newColorName, hex: newColorHex },
      }).unwrap();
      setNewColorName("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    try {
      await deleteColor(colorId).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeValue) return;
    try {
      await createSize({
        productId,
        body: { value: newSizeValue },
      }).unwrap();
      setNewSizeValue("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSize = async (sizeId: string) => {
    try {
      await deleteSize(sizeId).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
              <Check className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-base font-bold">2. Manage Colors & Sizes</CardTitle>
          </div>
          <CardDescription className="text-xs">Define colors and sizes to establish options for stock variants.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors Column */}
          <Card className="bg-background border-border/60">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-sm font-bold">Colors Configured</CardTitle>
              <CardDescription className="text-[11px]">Add distinct colors (e.g. Gold, Silver) for this item.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <form onSubmit={handleAddColor} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground">Color Name</label>
                  <Input
                    placeholder="e.g. Gold"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="h-8 text-xs bg-background border-input"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground">Hex</label>
                  <div className="flex gap-1.5">
                    <Input
                      placeholder="#ffd700"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="h-8 w-16 text-xs bg-background border-input font-mono"
                      required
                    />
                    <input
                      type="color"
                      value={newColorHex.startsWith("#") && newColorHex.length === 7 ? newColorHex : "#ffffff"}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="h-8 w-8 cursor-pointer border border-input rounded p-0.5 bg-background"
                    />
                  </div>
                </div>
                <Button type="submit" size="sm" className="h-8 px-3 gap-1" disabled={isCreatingColor}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </form>

              {product?.colors && product.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {product.colors.map((c: any) => (
                    <Badge
                      key={c.id}
                      variant="outline"
                      className="pl-1.5 pr-1 py-0.5 flex items-center gap-1.5 bg-background border-border text-foreground text-xs rounded-md"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: c.hex || "#cccccc" }}
                      />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteColor(c.id)}
                        className="text-muted-foreground hover:text-destructive rounded-full font-bold ml-1 focus:outline-none"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-3">No colors configured.</p>
              )}
            </CardContent>
          </Card>

          {/* Sizes Column */}
          <Card className="bg-background border-border/60">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-sm font-bold">Sizes Configured</CardTitle>
              <CardDescription className="text-[11px]">Add distinct sizes (e.g. Ring sizes, neck lengths).</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <form onSubmit={handleAddSize} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground">Size Value</label>
                  <Input
                    placeholder="e.g. 6, 7, 18 in"
                    value={newSizeValue}
                    onChange={(e) => setNewSizeValue(e.target.value)}
                    className="h-8 text-xs bg-background border-input"
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="h-8 px-3 gap-1" disabled={isCreatingSize}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </form>

              {product?.sizes && product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {product.sizes.map((s: any) => (
                    <Badge
                      key={s.id}
                      variant="outline"
                      className="pr-1 py-0.5 flex items-center gap-1.5 bg-background border-border text-foreground text-xs rounded-md"
                    >
                      <span>{s.value}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSize(s.id)}
                        className="text-muted-foreground hover:text-destructive rounded-full font-bold ml-1 focus:outline-none"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-3">No sizes configured.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
