"use client";

import * as React from "react";
import { useState } from "react";
import {
  useGetAllLandingCategoriesQuery,
  useCreateLandingCategoryMutation,
  useUpdateLandingCategoryMutation,
  useUpdateLandingCategoryStatusMutation,
  useDeleteLandingCategoryMutation,
  LandingCategory,
} from "@/services/api/landing-pages/landing-category.api";
import { useGetCategoriesQuery } from "@/services/api/products/products-api";
import ImageUpload from "@/components/landing-page/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function CategoryBannersDashboard() {
  // Fetch landing categories and product categories
  const { data: landingCategoriesData, isLoading: isLoadingBanners } =
    useGetAllLandingCategoriesQuery();
  const { data: categoriesData, isLoading: isLoadingCats } =
    useGetCategoriesQuery();

  const [createBanner, { isLoading: isCreating }] =
    useCreateLandingCategoryMutation();
  const [updateBanner, { isLoading: isUpdating }] =
    useUpdateLandingCategoryMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateLandingCategoryStatusMutation();
  const [deleteBanner, { isLoading: isDeleting }] =
    useDeleteLandingCategoryMutation();

  const banners = landingCategoriesData?.data || [];
  const productCategories = categoriesData?.data?.items || [];

  // Dialog / Edit State
  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<LandingCategory | null>(
    null
  );
  const [targetSlot, setTargetSlot] = useState<number>(1);

  // Form Fields State
  const [categoryId, setCategoryId] = useState("");
  const [label, setLabel] = useState("");
  const [slot, setSlot] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isPending = isCreating || isUpdating;

  // Open modal for Creating
  const handleOpenCreate = (slotNum: number) => {
    setEditingBanner(null);
    setTargetSlot(slotNum);
    setCategoryId("");
    setLabel("");
    setSlot(slotNum);
    setIsActive(true);
    setImageFile(null);
    setErrorMsg("");
    setIsOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (banner: LandingCategory) => {
    setEditingBanner(banner);
    setTargetSlot(banner.slot);
    setCategoryId(banner.categoryId);
    setLabel(banner.label);
    setSlot(banner.slot);
    setIsActive(banner.isActive);
    setImageFile(null);
    setErrorMsg("");
    setIsOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!categoryId) {
      setErrorMsg("Please select a product category.");
      return;
    }
    if (!label.trim()) {
      setErrorMsg("Label is required.");
      return;
    }
    if (!editingBanner && !imageFile) {
      setErrorMsg("Banner image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("label", label.trim());
    formData.append("slot", String(slot));
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner.id, body: formData }).unwrap();
        toast.success("Category banner updated successfully.");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Category banner created successfully.");
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error("Save category banner error:", err);
      setErrorMsg(err?.data?.message || "Failed to save category banner.");
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (banner: LandingCategory, checked: boolean) => {
    try {
      await updateStatus({ id: banner.id, isActive: checked }).unwrap();
      toast.success(`Banner status updated to ${checked ? "Active" : "Inactive"}`);
    } catch (err: any) {
      console.error("Update status error:", err);
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  // Delete Banner Handler
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category banner?")) {
      try {
        await deleteBanner(id).unwrap();
        toast.success("Category banner deleted successfully.");
      } catch (err: any) {
        console.error("Delete category banner error:", err);
        toast.error(err?.data?.message || "Failed to delete category banner.");
      }
    }
  };

  if (isLoadingBanners || isLoadingCats) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading category slots and configurations...
        </p>
      </div>
    );
  }

  // Enforce slot limit of 1 to 4
  const slotNumbers = [1, 2, 3, 4];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Homepage Category Banners
          </h1>
          <p className="text-stone-500 mt-2 text-sm max-w-2xl">
            Configure the promotional banners shown in section 3 of the landing page.
            There are exactly <strong>4 slots</strong> available, ordered sequentially.
          </p>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slotNumbers.map((slotNum) => {
          const banner = banners.find((b) => b.slot === slotNum);

          if (banner) {
            return (
              <div
                key={banner.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group"
              >
                {/* Slot Badge */}
                <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Slot {slotNum}
                </div>

                {/* Banner Image */}
                <div className="h-44 w-full bg-stone-100 relative overflow-hidden border-b border-stone-100">
                  {banner.image ? (
                    <img
                      src={banner.image}
                      alt={banner.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-serif italic text-amber-600 capitalize">
                      {banner.label}
                    </p>
                    <h3 className="font-serif font-bold text-lg text-stone-900 truncate">
                      {banner.category?.name || "Unknown Category"}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      /shop?category={banner.category?.slug || ""}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-600">
                        Active on Website
                      </span>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={(checked) =>
                          handleToggleActive(banner, checked)
                        }
                        disabled={isUpdatingStatus}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs border-stone-200 hover:bg-stone-50"
                        onClick={() => handleOpenEdit(banner)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs border-stone-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100"
                        onClick={() => handleDelete(banner.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Empty Slot State
          return (
            <div
              key={`empty-${slotNum}`}
              className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-80 bg-stone-50/50 hover:bg-amber-50/10 transition-all duration-200"
            >
              <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-stone-700 text-sm">
                Slot {slotNum} Empty
              </h3>
              <p className="text-xs text-stone-400 mt-1 mb-5 max-w-[180px]">
                No category banner configured for this slot yet.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-semibold hover:border-amber-500 hover:text-amber-600"
                onClick={() => handleOpenCreate(slotNum)}
              >
                Assign Banner
              </Button>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-white border border-stone-200 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-serif text-stone-900 border-b pb-3">
              {editingBanner ? `Edit Slot ${slot} Banner` : `Assign Slot ${targetSlot} Banner`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs border border-red-200 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Product Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">
                Target Product Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150"
                required
              >
                <option value="">Select a category...</option>
                {productCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-stone-400">
                Links this banner to the chosen category on the shop page.
              </p>
            </div>

            {/* Label Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">
                Banner Label / Subtitle
              </label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. New Arrivals, Beautiful, 15% Off"
                required
                className="h-10 rounded-lg border-stone-200 focus-visible:ring-amber-500/20 focus-visible:ring-2 focus-visible:border-amber-500"
              />
              <p className="text-[10px] text-stone-400">
                Small text displayed above the category name (e.g. "Beautiful").
              </p>
            </div>

            {/* Slot Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600">
                  Target Layout Slot
                </label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none cursor-not-allowed"
                  disabled
                >
                  <option value={1}>Slot 1</option>
                  <option value={2}>Slot 2</option>
                  <option value={3}>Slot 3</option>
                  <option value={4}>Slot 4</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end pb-2">
                <div className="flex items-center space-x-2.5">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    id="modal-active"
                  />
                  <label
                    htmlFor="modal-active"
                    className="text-xs font-semibold text-stone-600 cursor-pointer"
                  >
                    Active on website
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-t border-stone-100 pt-4">
              <ImageUpload
                value={editingBanner?.image || ""}
                onChange={setImageFile}
              />
            </div>

            {/* Footer buttons */}
            <DialogFooter className="border-t border-stone-100 pt-4 flex gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-lg border-stone-200 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : editingBanner ? (
                  "Save Changes"
                ) : (
                  "Create Banner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
