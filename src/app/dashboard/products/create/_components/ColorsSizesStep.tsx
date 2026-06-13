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
import { Plus, Lock, Check } from "lucide-react";

interface ColorsSizesStepProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
  activeSection: 1 | 2 | 3 | 4 | 5;
  setActiveSection: (section: 1 | 2 | 3 | 4 | 5) => void;
}

export const ColorsSizesStep: React.FC<ColorsSizesStepProps> = ({
  productId,
  product,
  refetchProduct,
  activeSection,
  setActiveSection,
}) => {
  // Input states
  const [newColorName, setNewColorName] = React.useState("");
  const [newColorHex, setNewColorHex] = React.useState("#ffd700");
  const [newSizeValue, setNewSizeValue] = React.useState("");

  // Mutations
  const [createColor, { isLoading: isCreatingColor }] = useCreateColorMutation();
  const [deleteColor] = useDeleteColorMutation();
  const [createSize, { isLoading: isCreatingSize }] = useCreateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !newColorName || !newColorHex) return;
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
    if (!productId || !newSizeValue) return;
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
    <Card className={`border-border shadow-sm transition-all duration-300 ${!productId ? "opacity-40 select-none pointer-events-none" : "bg-card"} ${activeSection !== 2 && productId ? "bg-muted/10 border-dashed" : ""}`}>
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeSection > 2 ? "bg-green-500/10 text-green-500 border border-green-500/20" : activeSection === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {activeSection > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              2. Manage Colors & Sizes
              {!productId && <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">Define colors and sizes to establish options for stock variants.</CardDescription>
        </div>
        {productId && activeSection !== 2 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs hover:bg-accent"
            onClick={() => setActiveSection(2)}
          >
            Modify Colors/Sizes
          </Button>
        )}
      </CardHeader>

      {productId && activeSection === 2 && (
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Colors Column */}
            <Card className="bg-background border-border/60">
              <CardHeader className="pb-3 p-4">
                <CardTitle className="text-sm font-bold">Colors Configured</CardTitle>
                <CardDescription className="text-[11px]">Add distinct colors (e.g. Gold, Silver, Rose Gold) for this item.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {/* Add color form */}
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
                    {isCreatingColor ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Plus className="h-3 w-3" /> Add
                      </>
                    )}
                  </Button>
                </form>

                {/* Colors list */}
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
                  <p className="text-xs text-muted-foreground italic text-center py-3">No colors configured yet. Please add at least one.</p>
                )}
              </CardContent>
            </Card>

            {/* Product Sizes Column */}
            <Card className="bg-background border-border/60">
              <CardHeader className="pb-3 p-4">
                <CardTitle className="text-sm font-bold">Sizes Configured</CardTitle>
                <CardDescription className="text-[11px]">Add distinct size values (e.g. Ring Sizes 6, 7 or lengths 18 in).</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {/* Add size form */}
                <form onSubmit={handleAddSize} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground">Size Value</label>
                    <Input
                      placeholder="e.g. 6, M, 18 inch"
                      value={newSizeValue}
                      onChange={(e) => setNewSizeValue(e.target.value)}
                      className="h-8 text-xs bg-background border-input"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-8 px-3 gap-1" disabled={isCreatingSize}>
                    {isCreatingSize ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Plus className="h-3 w-3" /> Add
                      </>
                    )}
                  </Button>
                </form>

                {/* Sizes list */}
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
                  <p className="text-xs text-muted-foreground italic text-center py-3">No sizes configured yet. Please add at least one.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              size="sm"
              disabled={!product?.colors?.length || !product?.sizes?.length}
              onClick={() => setActiveSection(3)}
              className="gap-1.5"
            >
              Continue to Variants
            </Button>
          </div>
        </CardContent>
      )}

      {productId && activeSection !== 2 && (
        <CardContent className="p-6">
          <div className="text-sm space-y-1.5">
            <div>
              <span className="text-xs text-muted-foreground">Colors Configured: </span>
              <span className="font-semibold">
                {product?.colors?.length ? product.colors.map((c: any) => c.name).join(", ") : "None"}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Sizes Configured: </span>
              <span className="font-semibold">
                {product?.sizes?.length ? product.sizes.map((s: any) => s.value).join(", ") : "None"}
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

ColorsSizesStep.displayName = "ColorsSizesStep";
