"use client";

import * as React from "react";
import {
  useGetOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useToggleOfferStatusMutation,
  useDeleteOfferMutation,
} from "@/services/api/promotions/promotions-api";
import {
  useGetProductListingQuery,
  useGetCategoriesQuery,
} from "@/services/api/products/products-api";
import { IOffer } from "@/services/api/promotions/promotions-api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Tag,
  ShoppingBag,
} from "lucide-react";

// Lightweight helper utilities for date formatting
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatInputDate = (dateString: string | Date) => {
  const d = new Date(dateString);
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function OffersPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data: offersData, isLoading, isError, refetch } = useGetOffersQuery({ page, limit });
  const offers = offersData?.data?.items ?? [];
  const totalPages = offersData?.data?.totalPages ?? 1;

  // Products and Categories queries for target assignment selection
  const { data: categoriesData } = useGetCategoriesQuery();
  const allCategories = categoriesData?.data?.items ?? [];

  const { data: productsData } = useGetProductListingQuery({ page: 1, limit: 1000 });
  const allProducts = productsData?.data?.items ?? [];

  // Mutations
  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const [toggleOfferStatus] = useToggleOfferStatusMutation();
  const [deleteOffer, { isLoading: isDeleting }] = useDeleteOfferMutation();

  // State for Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingOffer, setEditingOffer] = React.useState<IOffer | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [offerToDelete, setOfferToDelete] = React.useState<IOffer | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = React.useState("");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [priority, setPriority] = React.useState("0");
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([]);
  const [productSearch, setProductSearch] = React.useState("");
  const [categorySearch, setCategorySearch] = React.useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Filtered lists for the dropdown menus
  const filteredCategorySelection = allCategories.filter((c) =>
    !selectedCategoryIds.includes(c.id) &&
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredProductSelection = allProducts.filter((p) => {
    const isAlreadySelected = selectedProductIds.includes(p.id);
    const isCategoryMatched = selectedCategoryIds.length === 0 || selectedCategoryIds.includes(p.categoryId);
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    return !isAlreadySelected && isCategoryMatched && matchesSearch;
  });

  // Search filter for list of campaigns
  const filteredOffers = offers.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Edit action
  const handleEdit = (offer: IOffer) => {
    setEditingOffer(offer);
    setName(offer.name);
    setSlug(offer.slug);
    setDescription(offer.description ?? "");
    setDiscountType(offer.discountType);
    setDiscountValue(offer.discountValue.toString());
    setStartsAt(formatInputDate(offer.startsAt));
    setEndsAt(offer.endsAt ? formatInputDate(offer.endsAt) : "");
    setIsActive(offer.isActive);
    setPriority(offer.priority.toString());
    setSelectedProductIds(offer.products?.map((p) => p.productId) ?? []);
    setSelectedCategoryIds(offer.categories?.map((c) => c.categoryId) ?? []);
    setProductSearch("");
    setCategorySearch("");
    setIsCategoryDropdownOpen(false);
    setIsProductDropdownOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Create action
  const handleCreateOpen = () => {
    setEditingOffer(null);
    setName("");
    setSlug("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setStartsAt(formatInputDate(new Date()));
    setEndsAt("");
    setIsActive(true);
    setPriority("0");
    setSelectedProductIds([]);
    setSelectedCategoryIds([]);
    setProductSearch("");
    setCategorySearch("");
    setIsCategoryDropdownOpen(false);
    setIsProductDropdownOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Status toggle
  const handleStatusToggle = async (offer: IOffer, checked: boolean) => {
    try {
      await toggleOfferStatus({ id: offer.id, isActive: checked }).unwrap();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  // Auto-generate slug from name
  React.useEffect(() => {
    if (!editingOffer) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [name, editingOffer]);

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Offer name is required.");
      return;
    }
    if (!slug.trim() || !/^[a-z0-9-]+$/.test(slug)) {
      setErrorMsg("Offer slug must consist of lowercase letters, numbers, and hyphens.");
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setErrorMsg("Discount value must be greater than 0.");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      discountType,
      discountValue: parseFloat(discountValue),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      isActive,
      priority: parseInt(priority) || 0,
      productIds: selectedProductIds,
      categoryIds: selectedCategoryIds,
    };

    try {
      if (editingOffer) {
        const response = await updateOffer({
          id: editingOffer.id,
          body: payload as any,
        }).unwrap();
        if (response.success) {
          setSuccessMsg("Offer updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        }
      } else {
        const response = await createOffer(payload as any).unwrap();
        if (response.success) {
          setSuccessMsg("Offer created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        }
      }
    } catch (err: any) {
      const message = err?.data?.error
        ? err.data.error.join(", ")
        : err?.data?.message || "Something went wrong.";
      setErrorMsg(message);
    }
  };

  // Delete Action
  const handleDeleteTrigger = (offer: IOffer) => {
    setOfferToDelete(offer);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteOffer(offerToDelete.id).unwrap();
      if (response.success) {
        setIsDeleteOpen(false);
        setOfferToDelete(null);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to delete offer.");
    }
  };

  // Dropdown selection helpers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    setCategorySearch("");
  };

  const handleCategoryRemove = (categoryId: string) => {
    const nextCategories = selectedCategoryIds.filter((id) => id !== categoryId);
    setSelectedCategoryIds(nextCategories);
    
    if (nextCategories.length > 0) {
      // Only keep products that belong to the remaining selected categories
      const remainingProducts = selectedProductIds.filter((pid) => {
        const prod = allProducts.find((p) => p.id === pid);
        return prod && nextCategories.includes(prod.categoryId);
      });
      setSelectedProductIds(remainingProducts);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductIds([...selectedProductIds, productId]);
    setProductSearch("");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Promotional Offers
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Design markdown campaigns, assign priority rules, and bundle percentage or fixed price drops across products or entire collections.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-amber-600 dark:bg-amber-500 dark:text-stone-950 hover:text-white dark:hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search offer campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredOffers.length} campaigns
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching offers...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve offers list. Verify the server is running.
            </p>
            <Button onClick={refetch} variant="outline" className="mt-4 gap-2">
              Try Reconnecting
            </Button>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                <TableRow className="border-b border-stone-200 dark:border-stone-800">
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Targets</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-stone-400">
                      No offers configured.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffers.map((o) => {
                    const starts = formatDate(o.startsAt);
                    const ends = o.endsAt ? formatDate(o.endsAt) : "Forever";
                    const targetsText = [];
                    if (o.products && o.products.length > 0) {
                      targetsText.push(`${o.products.length} Products`);
                    }
                    if (o.categories && o.categories.length > 0) {
                      targetsText.push(`${o.categories.length} Categories`);
                    }
                    if (targetsText.length === 0) {
                      targetsText.push("Storewide");
                    }

                    return (
                      <TableRow
                        key={o.id}
                        className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell>
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {o.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            /{o.slug}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {o.discountType === "PERCENTAGE"
                            ? `${o.discountValue}% Off`
                            : `₹${o.discountValue} Off`}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded font-mono font-bold text-stone-700 dark:text-stone-300">
                            P-{o.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          {targetsText.join(", ")}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400">
                          {starts} - {ends}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={o.isActive}
                            onCheckedChange={(checked) => handleStatusToggle(o, checked)}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(o)}
                            className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                          >
                            <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTrigger(o)}
                            className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400 font-mono">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-4xl w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-950 dark:text-stone-50">
              {editingOffer ? "Edit Offer Campaign" : "Create Promotional Offer"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Set markdown pricing rules, define campaign timing, and assign to specific products or collection categories.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs rounded">
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Basic configuration */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Campaign Title
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Solstice Price Drops"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Campaign URL Slug
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="e.g. summer-solstice"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the terms of this promotional drop..."
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Discount Type
                    </label>
                    <Select
                      value={discountType}
                      onValueChange={(val: any) => setDiscountType(val)}
                    >
                      <SelectTrigger className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Discount Value
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={discountType === "PERCENTAGE" ? "15" : "20"}
                        required
                        min="1"
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500 pl-7"
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-stone-400 font-bold">
                        {discountType === "PERCENTAGE" ? "%" : "₹"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Starts At
                    </label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                        required
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-8"
                      />
                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Ends At (Optional)
                    </label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={endsAt}
                        onChange={(e) => setEndsAt(e.target.value)}
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-8"
                      />
                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Priority Rule Score
                    </label>
                    <Input
                      type="number"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Switch
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className="data-[state=checked]:bg-amber-500"
                    />
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Enable Campaign
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Multi-select lists for Categories & Products */}
              <div className="space-y-6 border-l border-stone-100 dark:border-stone-850 pl-0 lg:pl-6">
                {/* Categories Autocomplete */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Target Categories ({selectedCategoryIds.length} selected)
                  </h3>
                  
                  {/* Selected Categories Badges */}
                  {selectedCategoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-1 bg-stone-50/50 dark:bg-stone-900/10 rounded-md border border-stone-200/60 dark:border-stone-800">
                      {selectedCategoryIds.map((id) => {
                        const cat = allCategories.find((c) => c.id === id);
                        if (!cat) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/30 flex items-center gap-1 py-0.5 px-2 rounded text-xs"
                          >
                            <span>{cat.name}</span>
                            <button
                              type="button"
                              onClick={() => handleCategoryRemove(id)}
                              className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 font-bold focus:outline-none text-[14px] ml-1"
                            >
                              &times;
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Input and suggestions list */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <Input
                        placeholder="Search & add categories..."
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setIsCategoryDropdownOpen(true);
                        }}
                        onFocus={() => setIsCategoryDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                        className="pl-8 h-9 text-xs bg-stone-50 dark:bg-stone-950 focus:border-amber-500"
                      />
                    </div>

                    {isCategoryDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-1 shadow-lg">
                        {filteredCategorySelection.length === 0 ? (
                          <div className="text-[10px] text-stone-400 text-center py-3">
                            {categorySearch ? "No matching categories." : "All categories selected."}
                          </div>
                        ) : (
                          filteredCategorySelection.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleCategorySelect(c.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 transition-colors"
                            >
                              {c.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Autocomplete */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" /> Target Products ({selectedProductIds.length} selected)
                  </h3>

                  {/* Selected Products Badges */}
                  {selectedProductIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-1 bg-stone-50/50 dark:bg-stone-900/10 rounded-md border border-stone-200/60 dark:border-stone-800 max-h-[120px] overflow-y-auto">
                      {selectedProductIds.map((id) => {
                        const prod = allProducts.find((p) => p.id === id);
                        if (!prod) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-800/60 dark:hover:bg-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 flex items-center gap-1 py-0.5 px-2 rounded text-xs max-w-[220px]"
                          >
                            <span className="truncate">{prod.name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedProductIds(selectedProductIds.filter((pid) => pid !== id))}
                              className="text-stone-400 hover:text-stone-600 dark:text-stone-550 dark:hover:text-stone-300 font-bold focus:outline-none text-[14px] shrink-0 ml-1"
                            >
                              &times;
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Input and suggestions list */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <Input
                        placeholder="Search & add products..."
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setIsProductDropdownOpen(true);
                        }}
                        onFocus={() => setIsProductDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                        className="pl-8 h-9 text-xs bg-stone-50 dark:bg-stone-950 focus:border-amber-500"
                      />
                    </div>

                    {isProductDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-1 shadow-lg">
                        {filteredProductSelection.length === 0 ? (
                          <div className="text-[10px] text-stone-400 text-center py-4 px-2">
                            {productSearch
                              ? "No matching products found."
                              : "Type to search products..."}
                          </div>
                        ) : (
                          filteredProductSelection.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleProductSelect(p.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 transition-colors line-clamp-1"
                            >
                              {p.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 italic leading-snug">
                  * If a category is selected and no specific products are chosen from it, the offer is applied to the entire category. If neither categories nor products are selected, the offer applies storewide.
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-stone-950 hover:bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-600 text-xs px-6 font-bold"
              >
                {(isCreating || isUpdating) && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                {editingOffer ? "Save Changes" : "Create Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-950 dark:text-stone-50">
              Confirm Offer Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action is permanent. You are deleting promotion campaign{" "}
              <span className="font-semibold text-amber-600">{offerToDelete?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2 text-xs text-stone-500 leading-relaxed">
            Note: Deleting this campaign will immediately remove all associated markdown price updates across listings.
          </div>

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-6 font-bold"
            >
              {isDeleting && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              Delete Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
