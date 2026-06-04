"use client";

import * as React from "react";
import { useUpdateBasicInfoMutation } from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, Save } from "lucide-react";

interface EditBasicInfoCardProps {
  productId: string;
  product: any;
  categories: any[];
  brands: any[];
  tags: any[];
  refetchProduct: () => void;
}

export function EditBasicInfoCard({
  productId,
  product,
  categories,
  brands,
  tags,
  refetchProduct,
}: EditBasicInfoCardProps) {
  const [updateBasicInfo, { isLoading: isUpdatingInfo }] = useUpdateBasicInfoMutation();

  // Basic Info Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [originalPrice, setOriginalPrice] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [brandId, setBrandId] = React.useState("");
  const [tagIds, setTagIds] = React.useState<string[]>([]);
  const [isSale, setIsSale] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [forListing, setForListing] = React.useState(true);

  const [isEditingBasic, setIsEditingBasic] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  // Form search state for searchable tags
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isTagsOpen, setIsTagsOpen] = React.useState(false);
  const tagsContainerRef = React.useRef<HTMLDivElement>(null);

  // Initialize form state once product data is loaded/updated
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setPrice(String(product.price));
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
      setExcerpt(product.excerpt);
      setDescription(product.description);
      setIsSale(product.isSale);
      setIsNew(product.isNew);
      setIsFeatured(product.isFeatured);
      setForListing(product.forListing);
      setCategoryId(product.categoryId);
      setBrandId(product.brandId || "none");
      setTagIds(product.productTags?.map((pt: any) => pt.tagId) ?? []);
    }
  }, [product]);

  // Click outside listener for tags combobox
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsContainerRef.current && !tagsContainerRef.current.contains(event.target as Node)) {
        setIsTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save Section 1 Basic Info Handler
  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaveStatus("idle");

    const payload = {
      name,
      slug,
      excerpt,
      description,
      brandId: brandId && brandId !== "none" ? brandId : null,
      categoryId,
      tagIds,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      isNew,
      isSale,
      isFeatured,
      forListing,
    };

    try {
      await updateBasicInfo({ id: productId, body: payload }).unwrap();
      setSaveStatus("success");
      setIsEditingBasic(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
      refetchProduct();
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      const errorPayload = err as { data?: { message?: string }; message?: string };
      setErrorMessage(errorPayload?.data?.message || errorPayload?.message || "Failed to update basic info.");
    }
  };

  // Tags filter helper
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setTagIds([...tagIds, tagId]);
    } else {
      setTagIds(tagIds.filter((tid) => tid !== tagId));
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Update Failed</p>
            <p className="mt-0.5 text-xs opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      <Card className={`border-border shadow-sm transition-all duration-300 ${!isEditingBasic ? "bg-muted/10 border-dashed" : "bg-card"}`}>
        <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                <Check className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-base font-bold">1. Basic Info & Classification</CardTitle>
            </div>
            <CardDescription className="text-xs">Update catalog details, categorization, and baseline price.</CardDescription>
          </div>
          {!isEditingBasic && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs hover:bg-accent"
              onClick={() => setIsEditingBasic(true)}
            >
              Edit Details
            </Button>
          )}
        </CardHeader>

        {isEditingBasic ? (
          <form onSubmit={handleSaveBasicInfo}>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Product Name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Diamond Halo Ring"
                      className="bg-background border-input text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">URL Slug *</label>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="diamond-halo-ring"
                      className="bg-background border-input text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Retail Price (₹) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2999"
                        className="bg-background border-input text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Original Price (₹)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="Optional"
                        className="bg-background border-input text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Short Excerpt *</label>
                    <Input
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A brief snippet shown in cards and summaries."
                      className="bg-background border-input text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Category *</label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="w-full bg-background border-input text-sm text-foreground">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c: any) => (
                            <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Brand (Optional)</label>
                      <Select value={brandId} onValueChange={setBrandId}>
                        <SelectTrigger className="w-full bg-background border-input text-sm text-foreground">
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="italic cursor-pointer text-muted-foreground">None (No Brand)</SelectItem>
                          {brands.map((b: any) => (
                            <SelectItem key={b.id} value={b.id} className="cursor-pointer">{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags selector */}
                  <div className="space-y-2" ref={tagsContainerRef}>
                    <label className="text-xs font-semibold text-foreground">Tags</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={tags.length > 0 ? "Search and map tags..." : "No tags available"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsTagsOpen(true)}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {isTagsOpen && tags.length > 0 && (
                        <div className="absolute z-50 w-full mt-1.5 max-h-40 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-50">
                          <div className="p-1 space-y-0.5">
                            {filteredTags.map((tag: any) => {
                              const isSelected = tagIds.includes(tag.id);
                              return (
                                <button
                                  key={tag.id}
                                  type="button"
                                  onClick={() => handleTagToggle(tag.id, !isSelected)}
                                  className="flex items-center justify-between w-full px-2 py-1.5 text-xs rounded hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                >
                                  <span className="font-semibold">{tag.name}</span>
                                  {isSelected && <Check className="h-3 w-3 text-primary shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {tagIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tagIds.map((tid) => {
                          const found = tags.find((t: any) => t.id === tid);
                          return found ? (
                            <Badge key={tid} variant="secondary" className="gap-1 text-[10px] py-0 px-2 rounded-full font-semibold">
                              {found.name}
                              <button type="button" onClick={() => handleTagToggle(tid, false)} className="hover:text-destructive text-muted-foreground font-bold">×</button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground font-medium">Catalog Flags</label>
                    <div className="grid grid-cols-2 gap-2 border border-border/60 rounded-lg p-3 bg-muted/10 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4 rounded border-input cursor-pointer" />
                        <span>New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isSale} onChange={(e) => setIsSale(e.target.checked)} className="h-4 w-4 rounded border-input cursor-pointer" />
                        <span>On Sale</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-input cursor-pointer" />
                        <span>Featured Item</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={forListing} onChange={(e) => setForListing(e.target.checked)} className="h-4 w-4 rounded border-input cursor-pointer" />
                        <span>Visible in Shop</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Detailed Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed markdown description of elements..."
                  className="bg-background border-input min-h-[100px] text-sm"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-6 flex items-center justify-between">
              <span className="text-xs">
                {saveStatus === "success" && <span className="text-green-600 font-medium">Changes saved successfully</span>}
                {saveStatus === "error" && <span className="text-destructive font-medium">Failed to save details</span>}
              </span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingBasic(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="gap-1.5" disabled={isUpdatingInfo}>
                  <Save className="h-4 w-4" /> Save Details
                </Button>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Product Name</span>
                <span className="font-semibold">{name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Base Retail Price</span>
                <span className="font-semibold font-mono">₹{parseFloat(price || "0").toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Category</span>
                <span className="font-semibold">{categories.find((c: any) => c.id === categoryId)?.name || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Brand</span>
                <span className="font-semibold">{brands.find((b: any) => b.id === brandId)?.name || "No Brand"}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}
