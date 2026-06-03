"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useCreateProductMutation,
  useUpdateBasicInfoMutation,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
  useCreateColorMutation,
  useDeleteColorMutation,
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUploadImagesMutation,
  useDeleteImageMutation,
  useCreateSpecificationMutation,
  useDeleteSpecificationMutation,
} from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash,
  Upload,
  PlusCircle,
  AlertCircle,
  FileText,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
} from "lucide-react";

const DRAFT_STORAGE_KEY = "cbs_product_wizard_draft";

export default function ProgressiveCreateProductPage() {
  const router = useRouter();

  // 1. Basic Navigation & Creation States
  const [productId, setProductId] = React.useState<string | null>(null);
  const [activeSection, setActiveSection] = React.useState<1 | 2 | 3 | 4 | 5>(1);
  const [isEditingBasic, setIsEditingBasic] = React.useState(true);

  // 2. Fetch static metadata (categories, brands, tags)
  const { data: categoriesData, isLoading: isLoadingCats } = useGetCategoriesQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetProductTagsQuery();

  const categories = categoriesData?.data?.items ?? [];
  const brands = brandsData?.data?.items ?? [];
  const tags = tagsData?.data?.items ?? [];

  // 3. Dynamic Product Fetch (enabled once productId is generated)
  const { data: productData, refetch: refetchProduct } = useGetProductByIdQuery(
    productId ?? "",
    { skip: !productId }
  );
  const product = productData?.data;

  // 4. API Mutations
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [updateBasicInfo, { isLoading: isUpdatingInfo }] = useUpdateBasicInfoMutation();
  const [createColor, { isLoading: isCreatingColor }] = useCreateColorMutation();
  const [deleteColor] = useDeleteColorMutation();
  const [createSize, { isLoading: isCreatingSize }] = useCreateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();
  const [createVariant, { isLoading: isCreatingVariant }] = useCreateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [uploadImages, { isLoading: isUploadingImages }] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [createSpec, { isLoading: isCreatingSpec }] = useCreateSpecificationMutation();
  const [deleteSpec] = useDeleteSpecificationMutation();

  // 5. Basic Info Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [brandId, setBrandId] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [tagIds, setTagIds] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState("");
  const [originalPrice, setOriginalPrice] = React.useState("");
  const [isNew, setIsNew] = React.useState(true);
  const [isSale, setIsSale] = React.useState(false);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [forListing, setForListing] = React.useState(true);

  // Form search state for searchable tags
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isTagsOpen, setIsTagsOpen] = React.useState(false);
  const tagsContainerRef = React.useRef<HTMLDivElement>(null);

  // 6. Section Specific Input States
  // Colors & Sizes
  const [newColorName, setNewColorName] = React.useState("");
  const [newColorHex, setNewColorHex] = React.useState("#ffd700");
  const [newSizeValue, setNewSizeValue] = React.useState("");

  // Variants
  const [selectedColorId, setSelectedColorId] = React.useState("");
  const [selectedSizeId, setSelectedSizeId] = React.useState("");
  const [variantPrice, setVariantPrice] = React.useState("");
  const [variantStock, setVariantStock] = React.useState("");
  const [isVariantDialogOpen, setIsVariantDialogOpen] = React.useState(false);

  // Images
  const [uploadColorId, setUploadColorId] = React.useState("");
  const [uploadFiles, setUploadFiles] = React.useState<FileList | null>(null);

  // Specifications
  const [newSpecKey, setNewSpecKey] = React.useState("");
  const [newSpecValue, setNewSpecValue] = React.useState("");

  // Feedback states
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasDraftLoaded, setHasDraftLoaded] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Auto-generate slug from name
  React.useEffect(() => {
    if (productId) return; // Don't auto-slug once created
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
        if (draft.isNew !== undefined) setIsNew(draft.isNew);
        if (draft.isSale !== undefined) setIsSale(draft.isSale);
        if (draft.isFeatured !== undefined) setIsFeatured(draft.isFeatured);
        if (draft.forListing !== undefined) setForListing(draft.forListing);

        const hasContent = (draft.name && draft.name.trim() !== "") || (draft.price && draft.price !== "");
        if (hasContent) {
          setHasDraftLoaded(true);
        }
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, [productId]);

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
      isNew,
      isSale,
      isFeatured,
      forListing,
    };

    const hasContent =
      name.trim() !== "" ||
      slug.trim() !== "" ||
      categoryId !== "" ||
      price !== "";

    try {
      if (hasContent) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
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
    isNew,
    isSale,
    isFeatured,
    forListing,
    isLoaded,
    productId,
  ]);

  const handleDiscardDraft = () => {
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
      setIsNew(true);
      setIsSale(false);
      setIsFeatured(false);
      setForListing(true);
      setHasDraftLoaded(false);
    } catch (e) {
      console.error("Failed to discard draft", e);
    }
  };

  // 7. Step 1: Save Basic Info
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
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
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
          setProductId(res.data.id);
          setIsEditingBasic(false);
          setActiveSection(2);

          // Clear local storage draft (saved to DB draft status now)
          try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            setHasDraftLoaded(false);
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

  // 8. Step 2: Manage Colors & Sizes
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

  // 9. Step 3: Create Variants
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

  // 10. Step 4: Images Upload
  const handleUploadImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !uploadColorId || !uploadFiles || uploadFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }
    formData.append("colorId", uploadColorId);
    formData.append("colorIds", uploadColorId);

    try {
      await uploadImages({ productId, formData }).unwrap();
      setUploadColorId("");
      setUploadFiles(null);
      const fileInput = document.getElementById("create-image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!productId) return;
    try {
      await deleteImage({ productId, imageId }).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  // 11. Step 5: Specifications
  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !newSpecKey || !newSpecValue) return;

    try {
      await createSpec({
        productId,
        body: [{ key: newSpecKey, value: newSpecValue }],
      }).unwrap();
      setNewSpecKey("");
      setNewSpecValue("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSpec = async (specId: string) => {
    if (!productId) return;
    try {
      await deleteSpec({ productId, specificationId: specId }).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setTagIds([...tagIds, tagId]);
    } else {
      setTagIds(tagIds.filter((id) => id !== tagId));
    }
  };

  const isLoadingMeta = isLoadingCats || isLoadingBrands || isLoadingTags;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header section */}
      <div className="flex items-center justify-between gap-3 w-full border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 bg-background border-input text-foreground hover:bg-accent">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
              {hasDraftLoaded && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  Draft Loaded
                </span>
              )}
              {productId && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize font-mono text-[10px]">
                  Draft Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Configure product details, variants, media, and specifications step-by-step.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasDraftLoaded && !productId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDiscardDraft}
              className="hover:bg-destructive hover:text-destructive-foreground border-border text-muted-foreground hover:text-foreground h-8 text-xs font-semibold"
            >
              Discard Draft
            </Button>
          )}
          {productId && (
            <Button asChild variant="default" size="sm" className="h-8 font-semibold shadow-sm">
              <Link href="/dashboard/products">
                Complete Listing
              </Link>
            </Button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Operation Failed</p>
            <p className="mt-0.5 text-xs opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Stacked Cards Sections */}
      <div className="space-y-6 w-full">

        {/* SECTION 1: BASIC INFORMATION */}
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
                  <Save className="h-4 w-4" />
                  {productId ? "Save & Continue" : "Create Base Product"}
                </Button>
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
                  <span className="font-semibold font-mono">₹{parseFloat(price).toLocaleString("en-IN")}</span>
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

        {/* SECTION 2: COLORS & SIZES */}
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
                        <Plus className="h-3 w-3" /> Add
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
                        <Plus className="h-3 w-3" /> Add
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

        {/* SECTION 3: INVENTORY VARIANTS */}
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
                            placeholder={`Inherit default: ₹${price}`}
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
                          Create Variant
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

        {/* SECTION 4: PRODUCT IMAGES */}
        <Card className={`border-border shadow-sm transition-all duration-300 ${!productId || activeSection < 4 ? "opacity-40 select-none pointer-events-none" : "bg-card"} ${activeSection !== 4 && productId && activeSection > 4 ? "bg-muted/10 border-dashed" : ""}`}>
          <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${activeSection > 4 ? "bg-green-500/10 text-green-500 border border-green-500/20" : activeSection === 4 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {activeSection > 4 ? <Check className="h-3.5 w-3.5" /> : "4"}
                </div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  4. Media & Gallery
                  {(activeSection < 4 || !productId) && <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">Upload images mapping directly to the configured color codes.</CardDescription>
            </div>
            {productId && activeSection > 4 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-accent"
                onClick={() => setActiveSection(4)}
              >
                Modify Gallery
              </Button>
            )}
          </CardHeader>

          {productId && activeSection === 4 && (
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <Card className="bg-background border-border/60">
                  <CardHeader className="pb-3 p-4">
                    <CardTitle className="text-sm font-bold">Upload Images</CardTitle>
                    <CardDescription className="text-[11px]">Upload photos. Each set maps to an active product color.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUploadImages}>
                    <CardContent className="p-4 pt-0 space-y-4">
                      {/* Select associated color */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Associate Color Mapping *</label>
                        <Select value={uploadColorId} onValueChange={setUploadColorId} required>
                          <SelectTrigger className="w-full bg-background border-input text-xs text-foreground h-8">
                            <SelectValue placeholder="Choose color to map" />
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

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Select File Assets *</label>
                        <Input
                          id="create-image-input"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setUploadFiles(e.target.files)}
                          className="h-9 text-xs bg-background border-input cursor-pointer"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-4 flex justify-end">
                      <Button type="submit" size="sm" className="h-8 gap-1" disabled={isUploadingImages || !uploadColorId || !uploadFiles}>
                        <Upload className="h-3.5 w-3.5" /> Upload File(s)
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                {/* Previews grid */}
                <div className="lg:col-span-2">
                  <Card className="bg-background border-border/60 h-full">
                    <CardHeader className="pb-3 p-4">
                      <CardTitle className="text-sm font-bold">Image Gallery</CardTitle>
                      <CardDescription className="text-[11px]">Media uploaded in system catalog for this product.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {product?.images && product.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {product.images.map((img: any) => (
                            <div
                              key={img.id}
                              className="relative aspect-square border border-border rounded-lg overflow-hidden group shadow-sm bg-muted/20"
                            >
                              <img
                                src={img.media?.url}
                                alt={img.media?.altText || "Product photo"}
                                className="object-cover w-full h-full"
                              />
                              {img.isPrimary && (
                                <Badge className="absolute top-1.5 left-1.5 bg-primary text-white shadow-sm text-[8px] py-0 px-1">
                                  Primary
                                </Badge>
                              )}
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-250 shadow rounded-md"
                                onClick={() => handleDeleteImage(img.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-white text-[9px] truncate text-center font-medium">
                                {product.colors.find((c: any) => c.id === img.colorId)?.name || "Default"}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-xl min-h-[140px]">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                          <p className="text-xs font-semibold">No media uploaded</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Configure and upload images using the uploader.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  size="sm"
                  onClick={() => setActiveSection(5)}
                  className="gap-1.5"
                >
                  Continue to Specifications
                </Button>
              </div>
            </CardContent>
          )}

          {productId && activeSection !== 4 && activeSection > 4 && (
            <CardContent className="p-6">
              <span className="text-sm font-semibold">
                {product?.images?.length ?? 0} media assets uploaded to gallery.
              </span>
            </CardContent>
          )}
        </Card>

        {/* SECTION 5: TECHNICAL SPECIFICATIONS */}
        <Card className={`border-border shadow-sm transition-all duration-300 ${!productId || activeSection < 5 ? "opacity-40 select-none pointer-events-none" : "bg-card"}`}>
          <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${productId && activeSection === 5 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  5
                </div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  5. Specifications
                  {(activeSection < 5 || !productId) && <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">Add specifications parameters (e.g. Metal Carat, Gemstone Weight, Dimensions).</CardDescription>
            </div>
          </CardHeader>

          {productId && activeSection === 5 && (
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form column */}
                <Card className="bg-background border-border/60">
                  <CardHeader className="pb-3 p-4">
                    <CardTitle className="text-sm font-bold">Add Specification</CardTitle>
                    <CardDescription className="text-[11px]">Define specification attributes displayed on listing details.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleAddSpec}>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground">Parameter Key</label>
                        <Input
                          placeholder="e.g. Carat Weight, Metal"
                          value={newSpecKey}
                          onChange={(e) => setNewSpecKey(e.target.value)}
                          className="h-8 text-xs bg-background border-input"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground">Parameter Value</label>
                        <Input
                          placeholder="e.g. 18K Yellow Gold, 1.2ct"
                          value={newSpecValue}
                          onChange={(e) => setNewSpecValue(e.target.value)}
                          className="h-8 text-xs bg-background border-input"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-4 flex justify-end">
                      <Button type="submit" size="sm" className="h-8 gap-1" disabled={isCreatingSpec}>
                        <Plus className="h-3.5 w-3.5" /> Add Attribute
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                {/* Specs list column */}
                <div className="lg:col-span-2">
                  <Card className="bg-background border-border/60 h-full">
                    <CardHeader className="pb-3 p-4">
                      <CardTitle className="text-sm font-bold">Specifications Added</CardTitle>
                      <CardDescription className="text-[11px]">Dynamic attributes configured in the details table.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 border-t border-border/60">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse text-left">
                          <thead>
                            <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                              <th className="p-3">Attribute Key</th>
                              <th className="p-3">Value</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product?.specification && product.specification.length > 0 ? (
                              product.specification.map((spec: any) => (
                                <tr key={spec.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                  <td className="p-3 font-semibold text-foreground">{spec.key}</td>
                                  <td className="p-3 text-muted-foreground">{spec.value}</td>
                                  <td className="p-3 text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                      onClick={() => handleDeleteSpec(spec.id)}
                                    >
                                      <Trash className="h-3.5 w-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-6 text-center text-muted-foreground italic">
                                  No specifications added yet. Add them in the form.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <Button asChild size="default" className="shadow-md">
                  <Link href="/dashboard/products">
                    Finish & Publish Listing
                  </Link>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
