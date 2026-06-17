"use client";

import * as React from "react";
import {
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
  useCreateProductMutation,
  useUpdateBasicInfoMutation,
} from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Save } from "lucide-react";

const DRAFT_STORAGE_KEY = "cbs_product_wizard_draft";

export interface BasicInfoStepRef {
  discardDraft: () => void;
}

interface BasicInfoStepProps {
  productId: string | null;
  product: any;
  activeSection: 1 | 2 | 3 | 4 | 5;
  setActiveSection: (section: 1 | 2 | 3 | 4 | 5) => void;
  isEditingBasic: boolean;
  setIsEditingBasic: (isEditing: boolean) => void;
  onSaveSuccess: (productId: string, price: string) => void;
  onDraftStatusChange: (hasDraft: boolean) => void;
  setErrorMessage: (msg: string) => void;
}

export const BasicInfoStep = React.forwardRef<BasicInfoStepRef, BasicInfoStepProps>(
  (
    {
      productId,
      product,
      activeSection,
      setActiveSection,
      isEditingBasic,
      setIsEditingBasic,
      onSaveSuccess,
      onDraftStatusChange,
      setErrorMessage,
    },
    ref
  ) => {
    // Fetch static metadata
    const { data: categoriesData, isLoading: isLoadingCats } = useGetCategoriesQuery();
    const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();
    const { data: tagsData, isLoading: isLoadingTags } = useGetProductTagsQuery();

    const categories = categoriesData?.data?.items ?? [];
    const brands = brandsData?.data?.items ?? [];
    const tags = tagsData?.data?.items ?? [];

    const isLoadingMeta = isLoadingCats || isLoadingBrands || isLoadingTags;

    // Basic Info Form State
    const [name, setName] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [brandId, setBrandId] = React.useState("");
    const [categoryId, setCategoryId] = React.useState("");
    const [tagIds, setTagIds] = React.useState<string[]>([]);
    const [price, setPrice] = React.useState("");
    const [originalPrice, setOriginalPrice] = React.useState("");
    const [costPrice, setCostPrice] = React.useState("0");
    const [isNew, setIsNew] = React.useState(true);
    const [isSale, setIsSale] = React.useState(false);
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [forListing, setForListing] = React.useState(true);

    // Form search state for searchable tags
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isTagsOpen, setIsTagsOpen] = React.useState(false);
    const tagsContainerRef = React.useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Mutations
    const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
    const [updateBasicInfo, { isLoading: isUpdatingInfo }] = useUpdateBasicInfoMutation();

    // Auto-generate slug from name
    React.useEffect(() => {
      if (productId) return;
      const generated = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }, [name, productId]);

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

    // Load basic info draft on mount (only before product creation)
    React.useEffect(() => {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft && !productId) {
          const draft = JSON.parse(savedDraft);
          if (draft.name) setName(draft.name);
          if (draft.slug) setSlug(draft.slug);
          if (draft.excerpt) setExcerpt(draft.excerpt);
          if (draft.description) setDescription(draft.description);
          if (draft.brandId) setBrandId(draft.brandId);
          if (draft.categoryId) setCategoryId(draft.categoryId);
          if (draft.tagIds) setTagIds(draft.tagIds);
          if (draft.price) setPrice(draft.price);
          if (draft.originalPrice) setOriginalPrice(draft.originalPrice);
          if (draft.costPrice) setCostPrice(draft.costPrice);
          if (draft.isNew !== undefined) setIsNew(draft.isNew);
          if (draft.isSale !== undefined) setIsSale(draft.isSale);
          if (draft.isFeatured !== undefined) setIsFeatured(draft.isFeatured);
          if (draft.forListing !== undefined) setForListing(draft.forListing);

          const hasContent = (draft.name && draft.name.trim() !== "") || (draft.price && draft.price !== "");
          if (hasContent) {
            onDraftStatusChange(true);
          }
        }
      } catch (e) {
        console.error("Failed to load draft from localStorage", e);
      } finally {
        setIsLoaded(true);
      }
    }, [productId, onDraftStatusChange]);

    // Sync basic info draft to local storage (only before product creation)
    React.useEffect(() => {
      if (!isLoaded || productId) return;

      const draftData = {
        name,
        slug,
        excerpt,
        description,
        brandId,
        categoryId,
        tagIds,
        price,
        originalPrice,
        costPrice,
        isNew,
        isSale,
        isFeatured,
        forListing,
      };

      const hasContent =
        name.trim() !== "" ||
        slug.trim() !== "" ||
        categoryId !== "" ||
        price !== "" ||
        costPrice !== "0";

      try {
        if (hasContent) {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
          onDraftStatusChange(true);
        } else {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          onDraftStatusChange(false);
        }
      } catch (e) {
        console.error("Failed to save draft to localStorage", e);
      }
    }, [
      name,
      slug,
      excerpt,
      description,
      brandId,
      categoryId,
      tagIds,
      price,
      originalPrice,
      costPrice,
      isNew,
      isSale,
      isFeatured,
      forListing,
      isLoaded,
      productId,
      onDraftStatusChange,
    ]);

    // Expose discard draft through ref
    React.useImperativeHandle(ref, () => ({
      discardDraft: () => {
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          setName("");
          setSlug("");
          setExcerpt("");
          setDescription("");
          setBrandId("");
          setCategoryId("");
          setTagIds([]);
          setPrice("");
          setOriginalPrice("");
          setCostPrice("0");
          setIsNew(true);
          setIsSale(false);
          setIsFeatured(false);
          setForListing(true);
          onDraftStatusChange(false);
        } catch (e) {
          console.error("Failed to discard draft", e);
        }
      },
    }));

    const handleSaveBasicInfo = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      const payload = {
        name,
        slug,
        excerpt,
        description,
        brandId: brandId && brandId !== "none" ? brandId : null,
        categoryId,
        tagIds,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        costPrice: parseFloat(costPrice || "0"),
        isNew,
        isSale,
        isFeatured,
        forListing,
      };

      try {
        if (productId) {
          // Update mode
          await updateBasicInfo({ id: productId, body: payload }).unwrap();
          setIsEditingBasic(false);
          setActiveSection(2);
        } else {
          // Create mode
          const res = (await createProduct(payload).unwrap()) as {
            success: boolean;
            data: { id: string };
          };

          if (res?.data?.id) {
            onSaveSuccess(res.data.id, price);
            setIsEditingBasic(false);
            setActiveSection(2);

            try {
              localStorage.removeItem(DRAFT_STORAGE_KEY);
              onDraftStatusChange(false);
            } catch (e) {
              console.error("Failed to clear local draft", e);
            }
          }
        }
      } catch (err) {
        console.error(err);
        const errorPayload = err as { data?: { message?: string }; message?: string };
        setErrorMessage(errorPayload?.data?.message || errorPayload?.message || "Failed to save product basic info.");
      }
    };

    const filteredTags = tags.filter((tag: any) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTagToggle = (tagId: string, checked: boolean) => {
      if (checked) {
        setTagIds([...tagIds, tagId]);
      } else {
        setTagIds(tagIds.filter((id) => id !== tagId));
      }
    };

    return (
      <Card className={`border-border shadow-sm transition-all duration-300 ${!isEditingBasic ? "bg-muted/10 border-dashed" : "bg-card"}`}>
        <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${productId ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-primary text-white"}`}>
                {productId ? <Check className="h-3.5 w-3.5" /> : "1"}
              </div>
              <CardTitle className="text-base font-bold">1. Basic Info & Classification</CardTitle>
            </div>
            <CardDescription className="text-xs">Provide catalog details, categorization, and baseline price.</CardDescription>
          </div>
          {productId && !isEditingBasic && (
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Cost Price (₹) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        placeholder="e.g. 1500"
                        className="bg-background border-input text-sm"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">MRP (₹) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="e.g. 3999"
                        className="bg-background border-input text-sm"
                        min="0.01"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Selling Price (₹) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 2999"
                        className={`bg-background border-input text-sm ${price && originalPrice && parseFloat(price) > parseFloat(originalPrice) ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        min="0.01"
                        required
                      />
                      {price && originalPrice && parseFloat(price) > parseFloat(originalPrice) && (
                        <p className="text-[10px] text-destructive font-medium mt-1">Must be ≤ MRP</p>
                      )}
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
                          {isLoadingMeta ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            categories.map((c: any) => (
                              <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                            ))
                          )}
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
                          {isLoadingMeta ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            brands.map((b: any) => (
                              <SelectItem key={b.id} value={b.id} className="cursor-pointer">{b.name}</SelectItem>
                            ))
                          )}
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
                  placeholder="Provide a full-length markdown or text description of materials, craft details, and care guidelines."
                  className="bg-background border-input min-h-[100px] text-sm"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-6 flex justify-end gap-3">
              <Button type="submit" size="sm" className="gap-1.5" disabled={isCreatingProduct || isUpdatingInfo}>
                {isCreatingProduct || isUpdatingInfo ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {productId ? "Save & Continue" : "Create Base Product"}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Product Name</span>
                <span className="font-semibold">{name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Cost Price</span>
                <span className="font-semibold font-mono">₹{parseFloat(costPrice || "0").toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">MRP</span>
                <span className="font-semibold font-mono text-muted-foreground line-through">₹{parseFloat(originalPrice || "0").toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Selling Price</span>
                <span className="font-semibold font-mono text-primary">₹{parseFloat(price || "0").toLocaleString("en-IN")}</span>
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
    );
  }
);

BasicInfoStep.displayName = "BasicInfoStep";
