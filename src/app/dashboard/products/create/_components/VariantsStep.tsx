"use client";

import * as React from "react";
import {
  useCreateVariantMutation,
  useDeleteVariantMutation,
} from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash, Lock, Check } from "lucide-react";

interface VariantsStepProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
  activeSection: 1 | 2 | 3 | 4 | 5;
  setActiveSection: (section: 1 | 2 | 3 | 4 | 5) => void;
  basePrice: string;
}

export const VariantsStep: React.FC<VariantsStepProps> = ({
  productId,
  product,
  refetchProduct,
  activeSection,
  setActiveSection,
  basePrice,
}) => {
  // Input states
  const [selectedColorId, setSelectedColorId] = React.useState("");
  const [selectedSizeId, setSelectedSizeId] = React.useState("");
  const [variantPrice, setVariantPrice] = React.useState("");
  const [variantStock, setVariantStock] = React.useState("");
  const [isVariantDialogOpen, setIsVariantDialogOpen] = React.useState(false);

  // Mutations
  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !selectedColorId || !selectedSizeId || !variantStock) return;

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

  const handleDeleteVariant = async (variantId: string) => {
    try {
      await deleteVariant(variantId).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className={`border-border shadow-sm transition-all duration-300 ${!productId || activeSection < 3 ? "opacity-40 select-none pointer-events-none" : "bg-card"} ${activeSection !== 3 && productId && activeSection > 3 ? "bg-muted/10 border-dashed" : ""}`}>
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeSection > 3 ? "bg-green-500/10 text-green-500 border border-green-500/20" : activeSection === 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {activeSection > 3 ? <Check className="h-3.5 w-3.5" /> : "3"}
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              3. Stock Variants
              {(activeSection < 3 || !productId) && <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">Create specific inventory variants with unique stock quantities and price overrides.</CardDescription>
        </div>
        {productId && activeSection > 3 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs hover:bg-accent"
            onClick={() => setActiveSection(3)}
          >
            Modify Variants
          </Button>
        )}
      </CardHeader>

      {productId && activeSection === 3 && (
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <h3 className="text-sm font-bold">Variants Inventory</h3>

            {/* Variant Add Dialog Modal */}
            <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1.5">
                  <Plus className="h-4 w-4" /> Add Variant
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card text-foreground border-border">
                <form onSubmit={handleCreateVariant}>
                  <DialogHeader>
                    <DialogTitle>Add Product Variant</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Color Dropdown Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Select Color Option *</label>
                      <Select value={selectedColorId} onValueChange={setSelectedColorId} required>
                        <SelectTrigger className="w-full bg-background border-input text-foreground">
                          <SelectValue placeholder="Choose Color" />
                        </SelectTrigger>
                        <SelectContent>
                          {product?.colors?.map((c: any) => (
                            <SelectItem key={c.id} value={c.id} className="cursor-pointer">
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Size Dropdown Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Select Size Option *</label>
                      <Select value={selectedSizeId} onValueChange={setSelectedSizeId} required>
                        <SelectTrigger className="w-full bg-background border-input text-foreground">
                          <SelectValue placeholder="Choose Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product?.sizes?.map((s: any) => (
                            <SelectItem key={s.id} value={s.id} className="cursor-pointer">
                              {s.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Variant Price Override */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Price Override (₹)</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={`Inherit default: ₹${basePrice}`}
                        value={variantPrice}
                        onChange={(e) => setVariantPrice(e.target.value)}
                        className="bg-background border-input text-sm"
                      />
                    </div>

                    {/* Stock levels */}
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
                    <Button type="submit" disabled={isCreatingVariant}>
                      {isCreatingVariant ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Creating...
                        </>
                      ) : (
                        "Create Variant"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table of active variants */}
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
                    const colorDetails = product.colors.find((c: any) => c.id === v.colorId);
                    const sizeDetails = product.sizes.find((s: any) => s.id === v.sizeId);

                    return (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-mono text-muted-foreground">{v.sku || "Auto-Generated"}</td>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                            onClick={() => handleDeleteVariant(v.id)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground italic">
                      No stock SKU variants created yet. Create a combination above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              size="sm"
              onClick={() => setActiveSection(4)}
              className="gap-1.5"
            >
              Continue to Media
            </Button>
          </div>
        </CardContent>
      )}

      {productId && activeSection !== 3 && activeSection > 3 && (
        <CardContent className="p-6">
          <span className="text-sm font-semibold">
            {product?.variants?.length ?? 0} variants configured in catalog.
          </span>
        </CardContent>
      )}
    </Card>
  );
};

VariantsStep.displayName = "VariantsStep";
