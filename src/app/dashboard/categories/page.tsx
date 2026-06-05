"use client";

import * as React from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/api/products/products-api";
import { ICategories } from "@/services/api/products/products-api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
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

export default function CategoriesPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery({
    page,
    limit,
  });

  // Retrieve flat categories for parent selection (no pagination)
  const { data: allCategoriesData } = useGetCategoriesQuery();

  const categories = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // State for Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ICategories | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<ICategories | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [parentId, setParentId] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [altText, setAltText] = React.useState("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Filter local categories for searching
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Edit Action
  const handleEdit = (category: ICategories) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setExcerpt(category.excerpt ?? "");
    setParentId(category.parentId ?? "");
    setIsActive(category.isActive);
    setAltText(category.altText ?? "");
    setImageFile(null);
    setImagePreview(category.image || null);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Handle Open Create Dialog
  const handleCreateOpen = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setExcerpt("");
    setParentId("");
    setIsActive(true);
    setAltText("");
    setImageFile(null);
    setImagePreview(null);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Generate Slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Auto generate slug if creating
    if (!editingCategory) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
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
      setErrorMsg("Category name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug is required.");
      return;
    }
    if (!editingCategory && !imageFile) {
      setErrorMsg("An image file is required for new categories.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("slug", slug.trim());
    formData.append("excerpt", excerpt.trim());
    formData.append("isActive", isActive.toString());
    formData.append("altText", altText.trim() || name.trim());
    if (parentId) {
      formData.append("parentId", parentId);
    } else {
      formData.append("parentId", "");
    }

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      if (editingCategory) {
        const response = await updateCategory({
          id: editingCategory.id,
          formData,
        }).unwrap() as { success: boolean; message?: string };
        
        if (response.success) {
          setSuccessMsg("Category updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to update category.");
        }
      } else {
        const response = await createCategory(formData).unwrap() as { success: boolean; message?: string };
        if (response.success) {
          setSuccessMsg("Category created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to create category.");
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
  const handleDeleteTrigger = (category: ICategories) => {
    setCategoryToDelete(category);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteCategory(categoryToDelete.id).unwrap() as { success: boolean; message?: string };
      if (response.success) {
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
      } else {
        setErrorMsg(response.message || "Failed to delete category.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(
        errorData?.data?.message ||
          "Could not delete category. Verify it has no child categories or linked products."
      );
    }
  };

  // Build List of eligible parents (to avoid cycles: filter out self and descendants)
  // Since we have all categories flat, let's filter out editingCategory
  const eligibleParents = (allCategoriesData?.data?.items ?? []).filter(
    (c) => !editingCategory || c.id !== editingCategory.id
  );

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Product Categories
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Configure the hierarchical navigation structures of your storefront. Categories organize products into groups for customer catalog navigation.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-amber-600 dark:bg-amber-500 dark:text-stone-950 hover:text-white dark:hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Controls & Tables */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search category names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredCategories.length} categories
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching taxonomy schema...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve category taxonomies. Verify the server is running and database container is active.
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
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-stone-400">
                      No categories found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((c) => (
                    <TableRow
                      key={c.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell>
                        {c.image ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
                            <img
                              src={c.image}
                              alt={c.altText || c.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-stone-100 dark:bg-stone-850 text-stone-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-stone-900 dark:text-stone-50">
                        {c.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-stone-500 dark:text-stone-400">
                        {c.slug}
                      </TableCell>
                      <TableCell>
                        {/* Parent display */}
                        {(c as unknown as { parent?: { name: string } }).parent?.name ? (
                          <Badge variant="secondary" className="bg-stone-100 border text-stone-700">
                            {(c as unknown as { parent?: { name: string } }).parent?.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-stone-400">Root Category</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Badge className="bg-emerald-500/10 border-emerald-500/25 border text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold py-0.5">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-stone-500/10 border-stone-500/25 border text-stone-600 dark:text-stone-400 text-[10px] uppercase font-bold py-0.5">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(c)}
                          className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(c)}
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
              {editingCategory ? "Edit Category Details" : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Configure name, hierarchy level, and descriptive cover imagery for catalog taxonomy.
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
              {/* Left Column - Main Details */}
              <div className="space-y-4">
                {/* Category Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Category Name
                  </label>
                  <Input
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Living Room Furniture"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Slug (URL Segment)
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="e.g. living-room-furniture"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 font-mono text-xs focus:border-amber-500"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Excerpt (Brief Description)
                  </label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a short summary showing at top of collection listings..."
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs min-h-[110px] focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Right Column - Taxonomy & Media */}
              <div className="space-y-4">
                {/* Parent Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:border-amber-500 h-9"
                  >
                    <option value="">-- No Parent (Root Category) --</option>
                    {eligibleParents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} ({parent.slug})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Category Cover Image
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative group border border-stone-200 dark:border-stone-800 rounded overflow-hidden h-[110px] bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        className="h-full w-full object-cover opacity-80"
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
                          Swap Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded h-[110px] text-center cursor-pointer hover:border-amber-500 transition-colors flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950/20"
                    >
                      <UploadCloud className="h-7 w-7 text-stone-400 mb-1" />
                      <span className="text-xs text-stone-500 font-semibold">
                        Click to select upload file
                      </span>
                      <span className="text-[9px] text-stone-400 mt-0.5">
                        JPG, PNG, WEBP (Max 2MB)
                      </span>
                    </div>
                  )}
                </div>

                {/* Alt Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Alt Text (For screen readers / SEO)
                  </label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Image description..."
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-850">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded accent-amber-500 h-4 w-4 border-stone-200 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                Mark category as active (Visible on frontend)
              </label>
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
                {editingCategory ? "Save Changes" : "Create Category"}
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
              Confirm Category Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action cannot be undone. You are deleting <span className="font-semibold text-stone-800 dark:text-stone-200">{categoryToDelete?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2 text-xs text-stone-500 leading-relaxed">
            Note: The system validates that this category does not contain subcategories or currently active product references before finalizing deletion.
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
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
