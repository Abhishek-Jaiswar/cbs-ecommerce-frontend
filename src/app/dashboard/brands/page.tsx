"use client";

import * as React from "react";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/services/api/products/products-api";
import { IBrands } from "@/services/api/products/products-api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Search,
  AlertCircle,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function BrandsPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useGetBrandsQuery({
    page,
    limit,
  });

  const brands = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  // State for Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<IBrands | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [brandToDelete, setBrandToDelete] = React.useState<IBrands | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [altText, setAltText] = React.useState("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Search filter local display items
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Edit Action
  const handleEdit = (brand: IBrands) => {
    setEditingBrand(brand);
    setName(brand.name);
    setAltText(brand.altText ?? "");
    setImageFile(null);
    setImagePreview(brand.image || null);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Handle Open Create Dialog
  const handleCreateOpen = () => {
    setEditingBrand(null);
    setName("");
    setAltText("");
    setImageFile(null);
    setImagePreview(null);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Brand name is required.");
      return;
    }
    if (!editingBrand && !imageFile) {
      setErrorMsg("A logo file is required for new brands.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("altText", altText.trim() || name.trim());

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      if (editingBrand) {
        const response = await updateBrand({
          id: editingBrand.id,
          formData,
        }).unwrap() as { success: boolean; message?: string };
        
        if (response.success) {
          setSuccessMsg("Brand updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to update brand.");
        }
      } else {
        const response = await createBrand(formData).unwrap() as { success: boolean; message?: string };
        if (response.success) {
          setSuccessMsg("Brand created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to create brand.");
        }
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string; error?: string[] } };
      const message = errorData?.data?.error
        ? errorData.data.error.join(", ")
        : errorData?.data?.message || "Something went wrong. Please check fields.";
      setErrorMsg(message);
    }
  };

  // Delete Action
  const handleDeleteTrigger = (brand: IBrands) => {
    setBrandToDelete(brand);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteBrand(brandToDelete.id).unwrap() as { success: boolean; message?: string };
      if (response.success) {
        setIsDeleteOpen(false);
        setBrandToDelete(null);
      } else {
        setErrorMsg(response.message || "Failed to delete brand.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(
        errorData?.data?.message ||
          "Could not delete brand. Verify no products are currently associated with this brand."
      );
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Product Brands
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Configure product brands and upload their logo assets. This helps filter and display collections by manufacturing house.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-amber-600 dark:bg-amber-500 dark:text-stone-950 hover:text-white dark:hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search brand names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredBrands.length} brands
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching brands database...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve brands list. Verify the server is running and database configuration is correct.
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
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Alt Text</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-stone-400">
                      No brands found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((b) => (
                    <TableRow
                      key={b.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell>
                        {b.image ? (
                          <div className="relative h-10 w-16 overflow-hidden rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 flex items-center justify-center p-1">
                            <img
                              src={b.image}
                              alt={b.altText || b.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-16 items-center justify-center rounded bg-stone-100 dark:bg-stone-850 text-stone-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-stone-900 dark:text-stone-50">
                        {b.name}
                      </TableCell>
                      <TableCell className="text-stone-500 dark:text-stone-400 text-xs">
                        {b.altText || <span className="italic text-stone-300">-</span>}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(b)}
                          className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(b)}
                          className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
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

      {/* CREATE & EDIT FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-stone-950 dark:text-stone-50">
              {editingBrand ? "Edit Brand Details" : "Create New Brand"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Provide manufacturing house name, alt text representations, and corporate vector logo graphic.
            </DialogDescription>
          </DialogHeader>

          {/* Success/Error displays */}
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

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Brand Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Brand Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ZenVora Couture"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
                  />
                </div>

                {/* Alt Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Alt Text (For screen readers / SEO)
                  </label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Logo graphic alt description..."
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Brand Logo Graphic
                  </label>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative group border border-stone-200 dark:border-stone-800 rounded overflow-hidden h-[105px] bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-2">
                    <img
                      src={imagePreview}
                      alt="Brand Preview"
                      className="max-h-full max-w-full object-contain opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white border-white bg-transparent hover:bg-white hover:text-black gap-2"
                      >
                        <UploadCloud className="h-4 w-4" />
                        Swap Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded h-[105px] text-center cursor-pointer hover:border-amber-500 transition-colors flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950/20"
                  >
                    <UploadCloud className="h-7 w-7 text-stone-400 mb-1" />
                    <span className="text-xs text-stone-500 font-semibold">
                      Click to upload logo
                    </span>
                    <span className="text-[9px] text-stone-400">
                      PNG, JPG, SVG, WEBP (Max 2MB)
                    </span>
                  </div>
                )}
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
                {editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-serif font-bold text-stone-950 dark:text-stone-50">
              Confirm Brand Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action is permanent. You are deleting brand <span className="font-semibold text-stone-850 dark:text-stone-200">{brandToDelete?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2 text-xs text-stone-500 leading-relaxed">
            Note: The system validates that this brand does not have active products configured before completing deletion.
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
              Delete Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
