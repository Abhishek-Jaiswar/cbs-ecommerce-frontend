"use client";

import React, { useState } from "react";
import {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  IBlogCategory,
} from "@/services/api/blog/blog-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  RefreshCw,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function BlogCategoriesPage() {
  const [page] = useState(1);
  const [limit] = useState(100); // Fetch all since list is short
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IBlogCategory | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);

  const {
    data: categoriesRes,
    isLoading,
    isFetching,
    refetch,
  } = useGetBlogCategoriesQuery({ page, limit });

  const [createCategory, { isLoading: isCreating }] = useCreateBlogCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateBlogCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteBlogCategoryMutation();

  const categoriesList = categoriesRes?.items ?? [];
  const isSaving = isCreating || isUpdating;

  // Auto slug generation from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleCreateOpen = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleEditOpen = (category: IBlogCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setIsActive(category.isActive);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog category? Posts linked to it might block deletion.")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Blog category deleted successfully!");
        refetch();
      } catch (err: any) {
        console.error(err);
        toast.error(err?.data?.message || "Failed to delete the blog category. Ensure no articles are using it.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          body: { name: name.trim(), slug: slug.trim(), isActive },
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory({
          name: name.trim(),
          slug: slug.trim(),
          isActive,
        }).unwrap();
        toast.success("Category created successfully!");
      }
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Operation failed.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
            Blog Categories
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Create and organize categories for your blog posts and articles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateOpen}
            className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold gap-2 text-xs"
          >
            <Plus size={16} /> New Category
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
            className="bg-white dark:bg-stone-950 h-9 w-9 p-0"
          >
            <RefreshCw size={14} className={`${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main categories table */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-48 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="h-48 flex flex-col justify-center items-center gap-2 text-stone-400 py-8">
            <BookOpen size={32} className="stroke-[1.5] text-stone-300" />
            <p className="italic text-sm">No blog categories recorded yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateOpen}
              className="mt-2 text-xs"
            >
              Add First Category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                <TableRow className="border-b">
                  <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Category Name
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Slug
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[120px] text-center pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                {categoriesList.map((category) => {
                  const statusColor = category.isActive
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                    : "bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800";

                  return (
                    <TableRow
                      key={category.id}
                      className="border-b text-xs hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell className="pl-6 py-3.5 font-semibold text-stone-900 dark:text-stone-100">
                        {category.name}
                      </TableCell>
                      <TableCell className="py-3.5 text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                        {category.slug}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="outline" className={`${statusColor} rounded-md font-semibold text-[10px]`}>
                          {category.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-center pr-6 flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOpen(category)}
                          className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-900"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(category.id)}
                          className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
          <DialogHeader>
            <DialogTitle className="text-stone-900 dark:text-stone-100">
              {editingCategory ? "Edit Blog Category" : "New Blog Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Add a name and slug for the blog category. Slugs are used in URL paths.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="cat-name" className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Category Name
              </label>
              <Input
                id="cat-name"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., Styling Guides"
                className="bg-transparent border-stone-200 dark:border-stone-800"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cat-slug" className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Slug Path
              </label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="e.g., styling-guides"
                className="bg-transparent border-stone-200 dark:border-stone-800 font-mono text-xs"
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-900 pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Active Status
                </span>
                <span className="text-[10px] text-stone-500">
                  Enable or disable this category on the storefront filters.
                </span>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isSaving}
              />
            </div>

            <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-900">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
                className="text-xs border-stone-200 dark:border-stone-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-stone-955 hover:bg-stone-800 text-white dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 font-bold text-xs"
              >
                {isSaving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
