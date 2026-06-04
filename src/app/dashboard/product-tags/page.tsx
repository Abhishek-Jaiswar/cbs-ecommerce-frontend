"use client";

import * as React from "react";
import {
  useGetProductTagsQuery,
  useCreateProductTagMutation,
  useUpdateProductTagMutation,
  useDeleteProductTagMutation,
} from "@/services/api/products/products-api";
import { ITag } from "@/services/api/products/products-api.types";
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
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductTagsPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useGetProductTagsQuery({
    page,
    limit,
  });

  const tags = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [createProductTag, { isLoading: isCreating }] = useCreateProductTagMutation();
  const [updateProductTag, { isLoading: isUpdating }] = useUpdateProductTagMutation();
  const [deleteProductTag, { isLoading: isDeleting }] = useDeleteProductTagMutation();

  // State for Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<ITag | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [tagToDelete, setTagToDelete] = React.useState<ITag | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Search filter local display items
  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Edit Action
  const handleEdit = (tag: ITag) => {
    setEditingTag(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Handle Open Create Dialog
  const handleCreateOpen = () => {
    setEditingTag(null);
    setName("");
    setSlug("");
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Generate Slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Auto generate slug if creating
    if (!editingTag) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Tag name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug is required.");
      return;
    }

    try {
      if (editingTag) {
        const response = await updateProductTag({
          id: editingTag.id,
          body: {
            name: name.trim(),
            slug: slug.trim(),
          },
        }).unwrap() as { success: boolean; message?: string };
        
        if (response.success) {
          setSuccessMsg("Tag updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to update tag.");
        }
      } else {
        const response = await createProductTag({
          name: name.trim(),
          slug: slug.trim(),
        }).unwrap() as { success: boolean; message?: string };
        if (response.success) {
          setSuccessMsg("Tag created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to create tag.");
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
  const handleDeleteTrigger = (tag: ITag) => {
    setTagToDelete(tag);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteProductTag(tagToDelete.id).unwrap() as { success: boolean; message?: string };
      if (response.success) {
        setIsDeleteOpen(false);
        setTagToDelete(null);
      } else {
        setErrorMsg(response.message || "Failed to delete tag.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(
        errorData?.data?.message ||
          "Could not delete tag. Verify no active products are currently using this tag filter."
      );
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Product Tags
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Configure keywords and tagging filters. Tags group related items together across different categories and brands (e.g. #SummerSpecial, #EcoFriendly).
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-amber-600 dark:bg-amber-500 dark:text-stone-950 hover:text-white dark:hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search tag names or slugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredTags.length} tags
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching product tags database...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve tags list. Verify the server is running and database configuration is correct.
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
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-stone-400">
                      No tags found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTags.map((t) => (
                    <TableRow
                      key={t.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell className="font-semibold text-stone-900 dark:text-stone-50">
                        #{t.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-stone-500 dark:text-stone-400">
                        {t.slug}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(t)}
                          className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(t)}
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
        <DialogContent className="sm:max-w-md w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-stone-950 dark:text-stone-50">
              {editingTag ? "Edit Tag Details" : "Create New Tag"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Configure filtering tags. Tags do not carry image payloads but require unique identifying slugs.
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
            {/* Tag Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Tag Label (Without #)
              </label>
              <Input
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. SummerSale"
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
                placeholder="e.g. summer-sale"
                required
                className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 font-mono text-xs focus:border-amber-500"
              />
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
                {editingTag ? "Save Changes" : "Create Tag"}
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
              Confirm Tag Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action is permanent. You are deleting tag <span className="font-semibold text-stone-850 dark:text-stone-200">#{tagToDelete?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2 text-xs text-stone-500 leading-relaxed">
            Note: Deleting this tag will automatically detach it from all products currently utilizing it as a catalog filter.
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
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
