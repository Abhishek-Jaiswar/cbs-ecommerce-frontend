"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
  IBlogPost,
} from "@/services/api/blog/blog-api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PostFormProps {
  post?: IBlogPost | null; // If provided, we are in Edit mode
}

export function PostForm({ post = null }: PostFormProps) {
  const isEdit = !!post;
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [storageKey, setStorageKey] = useState("");
  const [altText, setAltText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Fetch categories and tags
  const { data: categoriesRes } = useGetBlogCategoriesQuery();
  const { data: tagsRes } = useGetBlogTagsQuery();

  const categories = categoriesRes?.items ?? [];
  const tags = tagsRes?.items ?? [];

  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

  const isLoading = isCreating || isUpdating;

  // Auto-generate slug and storage key from title in create mode
  useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .trim()
        .replace(/\s+/g, "-"); // replace spaces with hyphens
      setSlug(generatedSlug);
      setStorageKey(`blogs/posts/${generatedSlug}/cover`);
    }
  }, [title, isEdit]);

  // Pre-fill form if editing
  useEffect(() => {
    if (isEdit && post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt ?? "");
      setContent(post.content);
      setImage(post.image);
      setStorageKey(post.storageKey);
      setAltText(post.altText);
      setCategoryId(post.categoryId);
      setStatus(post.status);
      setIsFeatured(post.isFeatured);
      setSelectedTagIds(post.tags?.map((t) => t.id) ?? []);
    }
  }, [post, isEdit]);

  const handleTagToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTagIds((prev) => [...prev, tagId]);
    } else {
      setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !content || !image || !categoryId || !altText) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt.trim() || undefined,
      content,
      image,
      storageKey,
      altText,
      categoryId,
      status,
      isFeatured,
      tagIds: selectedTagIds,
      authorId: post?.authorId || user?.id || "admin-user",
    };

    try {
      if (isEdit && post) {
        await updatePost({ id: post.id, body: payload }).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await createPost(payload).unwrap();
        toast.success("Article created successfully!");
      }
      router.push("/dashboard/blog/posts");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "An error occurred while saving the article.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/blog/posts")}
          className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs"
        >
          <ArrowLeft size={14} /> Back to Posts
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/blog/posts")}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="bg-stone-950 hover:bg-stone-850 dark:bg-stone-50 dark:hover:bg-stone-250 dark:text-stone-950 font-bold text-xs gap-1.5"
          >
            {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            {isEdit ? "Update Article" : "Publish Article"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-stone-900 dark:text-stone-100">
              Post Content
            </h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Article Title *
              </label>
              <Input
                placeholder="e.g., 5 Jewelry Care Tips for Royal Kundan Sets"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white dark:bg-stone-900 text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Article Body (Markdown Editor) *
              </label>
              <div className="pt-1">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  minHeight="450px"
                  placeholder="Start writing your premium article using Markdown formatting..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: metadata and options */}
        <div className="space-y-6">
          {/* Metadata box */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-stone-900 dark:text-stone-100">
              Publishing Options
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                SEO Slug / URL *
              </label>
              <Input
                placeholder="e.g., kundan-jewelry-care-tips"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                required
                disabled={isLoading}
                className="bg-white dark:bg-stone-900 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Category *
              </label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white dark:bg-stone-900 text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-900">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Status *
              </label>
              <Select
                value={status}
                onValueChange={(val: "DRAFT" | "PUBLISHED") => setStatus(val)}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white dark:bg-stone-900 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-900">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Featured Post
                </span>
                <span className="text-[9px] text-stone-500">
                  Display highlighted at the top of the blog page.
                </span>
              </div>
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Cover Image details */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-stone-900 dark:text-stone-100">
              Media Settings
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Cover Image URL *
              </label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/...w=800"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white dark:bg-stone-900 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Image Alt Text *
              </label>
              <Input
                placeholder="e.g. Diamond cuts guide banner"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white dark:bg-stone-900 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Storage Key (Optional)
              </label>
              <Input
                placeholder="blogs/posts/my-post/cover"
                value={storageKey}
                onChange={(e) => setStorageKey(e.target.value)}
                disabled={isLoading}
                className="bg-white dark:bg-stone-900 text-xs font-mono"
              />
            </div>
          </div>

          {/* Tags list */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-stone-900 dark:text-stone-100">
              Article Tags
            </h3>
            
            {tags.length === 0 ? (
              <p className="text-[11px] text-stone-400 italic">No tags created yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={(checked) => handleTagToggle(tag.id, !!checked)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={`tag-${tag.id}`}
                      className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none"
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt box */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold border-b pb-2 text-stone-900 dark:text-stone-100">
              Search Excerpt
            </h3>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Short Description (150 chars max)
              </label>
              <Textarea
                placeholder="Brief summary shown in listings and search engines..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                disabled={isLoading}
                maxLength={180}
                className="bg-white dark:bg-stone-900 min-h-[80px] text-xs leading-normal"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
