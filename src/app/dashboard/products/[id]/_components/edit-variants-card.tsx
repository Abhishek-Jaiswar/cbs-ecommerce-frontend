"use client";

import * as React from "react";
import {
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
} from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Check, Plus, Trash, Pencil } from "lucide-react";

interface EditVariantsCardProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
}

export function EditVariantsCard({
  productId,
  product,
  refetchProduct,
}: EditVariantsCardProps) {
  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] = useUpdateVariantMutation();

  // Variants Input States
  const [selectedColorId, setSelectedColorId] = React.useState("");
  const [selectedSizeId, setSelectedSizeId] = React.useState("");
  const [variantPrice, setVariantPrice] = React.useState("");
  const [variantStock, setVariantStock] = React.useState("");
  const [isVariantDialogOpen, setIsVariantDialogOpen] = React.useState(false);

  // Edit Variants States
  const [editVariantId, setEditVariantId] = React.useState<string | null>(null);
  const [editPrice, setEditPrice] = React.useState("");
  const [editStock, setEditStock] = React.useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColorId || !selectedSizeId || !variantStock) return;

    try {
      await createVariant({
        productId,
        body: {
          colorId: selectedColorId,
          sizeId: selectedSizeId,
          price: variantPrice ? parseFloat(variantPrice) : null,
          stock: parseInt(variantStock, 10),
        },
      }).unwrap();
      setIsVariantDialogOpen(false);
      setSelectedColorId("");
      setSelectedSizeId("");
      setVariantPrice("");
      setVariantStock("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (variant: any) => {
    setEditVariantId(variant.id);
    setEditPrice(variant.price !== null && variant.price !== undefined ? String(variant.price) : "");
    setEditStock(String(variant.stock));
    setIsEditDialogOpen(true);
  };

  const handleUpdateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVariantId || !editStock) return;

    try {
      await updateVariant({
        variantId: editVariantId,
        body: {
          price: editPrice ? parseFloat(editPrice) : null,
          stock: parseInt(editStock, 10),
        },
      }).unwrap();
      setIsEditDialogOpen(false);
      setEditVariantId(null);
      setEditPrice("");
      setEditStock("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      await deleteVariant(variantId).unwrap();
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
            <CardTitle className="text-base font-bold">3. Stock Variants</CardTitle>
          </div>
          <CardDescription className="text-xs">Create inventory variants with stock details and price overrides.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-border/60">
          <h3 className="text-sm font-bold">Variants Inventory</h3>

          <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5" disabled={!product?.colors?.length || !product?.sizes?.length}>
                <Plus className="h-4 w-4" /> Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card text-foreground border-border">
              <form onSubmit={handleCreateVariant}>
                <DialogHeader>
                  <DialogTitle>Add Product Variant</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Select Color Option *</label>
                    <Select value={selectedColorId} onValueChange={setSelectedColorId} required>
                      <SelectTrigger className="w-full bg-background border-input text-foreground">
                        <SelectValue placeholder="Choose Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product?.colors?.map((c: any) => (
                          <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Select Size Option *</label>
                    <Select value={selectedSizeId} onValueChange={setSelectedSizeId} required>
                      <SelectTrigger className="w-full bg-background border-input text-foreground">
                        <SelectValue placeholder="Choose Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product?.sizes?.map((s: any) => (
                          <SelectItem key={s.id} value={s.id} className="cursor-pointer">{s.value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Price Override (₹)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Inherit default: ₹${product?.price || "0"}`}
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      className="bg-background border-input text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Stock Quantity *</label>
                    <Input
                      type="number"
                      placeholder="e.g. 50"
                      value={variantStock}
                      onChange={(e) => setVariantStock(e.target.value)}
                      className="bg-background border-input text-sm"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreatingVariant}>Create Variant</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-hidden border border-border rounded-xl">
          <table className="w-full text-xs border-collapse text-left">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                <th className="p-3">SKU Code</th>
                <th className="p-3">Color Mapping</th>
                <th className="p-3">Size Value</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {product?.variants && product.variants.length > 0 ? (
                product.variants.map((v: any) => {
                  const colorDetails = product.colors?.find((c: any) => c.id === v.colorId);
                  const sizeDetails = product.sizes?.find((s: any) => s.id === v.sizeId);

                  return (
                    <tr key={v.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono text-muted-foreground">{v.sku || "—"}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          {colorDetails?.hex && (
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-border"
                              style={{ backgroundColor: colorDetails.hex }}
                            />
                          )}
                          <span>{colorDetails?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{sizeDetails?.value || "Unknown"}</td>
                      <td className="p-3 font-mono">
                        {v.price ? `₹${parseFloat(String(v.price)).toLocaleString("en-IN")}` : <span className="text-muted-foreground italic text-[10px]">Baseline Price</span>}
                      </td>
                      <td className="p-3 font-medium">{v.stock} units</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-muted/80 rounded-lg"
                            onClick={() => handleEditClick(v)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                            onClick={() => handleDeleteVariant(v.id)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground italic">
                    No stock SKU variants created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card text-foreground border-border">
            <form onSubmit={handleUpdateVariant}>
              <DialogHeader>
                <DialogTitle>Edit Variant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Price Override (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={`Inherit default: ₹${product?.price || "0"}`}
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="bg-background border-input text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Stock Quantity *</label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="bg-background border-input text-sm"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdatingVariant}>Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
