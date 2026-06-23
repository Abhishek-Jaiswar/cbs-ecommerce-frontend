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
import { ArrowLeft, Loader2, FileText, Settings, Image as ImageIcon, Tag, Globe, Sparkles, UploadCloud, X, ChevronDown, Check } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [storageKey, setStorageKey] = useState("");
  const [altText, setAltText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      setImagePreview(post.image || null);
      setStorageKey(post.storageKey);
      setAltText(post.altText);
      setCategoryId(post.categoryId);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("Please fill in Title and Slug.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("excerpt", excerpt.trim());
    formData.append("content", content.trim());
    formData.append("altText", altText.trim());
    formData.append("categoryId", categoryId);
    formData.append("isFeatured", isFeatured.toString());
    formData.append("tagIds", JSON.stringify(selectedTagIds));
    formData.append("status", isFormFullyFilled ? "PUBLISHED" : "DRAFT");
    formData.append("authorId", post?.authorId || user?.id || "admin-user");

    if (storageKey) {
      formData.append("storageKey", storageKey.trim());
    }

    if (imageFile) {
      formData.append("file", imageFile);
    } else if (isEdit && imagePreview) {
      formData.append("image", imagePreview);
    }

    try {
      if (isEdit && post) {
        await updatePost({ id: post.id, body: formData }).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await createPost(formData).unwrap();
        toast.success("Article created successfully!");
      }
      router.push("/dashboard/blog/posts");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "An error occurred while saving the article.");
    }
  };

  const isFormFullyFilled = !!(
    title.trim() &&
    slug.trim() &&
    content.trim().length >= 10 &&
    (imageFile || imagePreview) &&
    categoryId &&
    altText.trim()
  );

  return (
    <form onSubmit={handleSave} className="space-y-6 w-full max-w-none">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/blog/posts")}
            className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs"
          >
            <ArrowLeft size={14} /> Back to Posts
          </Button>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isFormFullyFilled
              ? "bg-emerald-50 border border-emerald-250 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-450"
              : "bg-amber-50 border border-amber-250 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-450"
          }`}>
            {isFormFullyFilled ? "Ready to Publish" : "Draft Mode"}
          </span>
        </div>
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
            {isEdit ? "Update Article" : "Save Article"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top: Editor section (Full Width) */}
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText size={16} className="text-[#c29958]" />
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Post Content
            </h3>
          </div>
          
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

          {/* Relocated SEO Slug & Search Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  SEO Slug / URL *
                </label>
                <span className="text-[9px] text-[#c29958] font-mono select-none">Auto-generated</span>
              </div>
              <Input
                placeholder="e.g., kundan-jewelry-care-tips"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                required
                disabled={isLoading}
                className="bg-stone-50/50 dark:bg-stone-900 text-xs font-mono h-9"
              />
              <p className="text-[9px] text-stone-400 font-mono mt-1 flex items-center gap-1">
                <Globe className="h-3 w-3 text-stone-400 shrink-0" />
                <span>zenvoraa.in/blog/</span>
                <span className="text-[#c29958] font-semibold truncate">{slug || "slug"}</span>
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Search Excerpt (150 chars max)
                </label>
                <span className={`text-[9px] font-mono ${excerpt.length > 150 ? 'text-amber-500' : 'text-stone-400'}`}>
                  {excerpt.length} / 180 chars
                </span>
              </div>
              <Textarea
                placeholder="Brief summary shown in listings and search engines..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                disabled={isLoading}
                maxLength={180}
                className="bg-stone-50/50 dark:bg-stone-900 text-xs leading-normal resize-none h-[56px] min-h-[56px]"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Article Body (Markdown Editor) *
            </label>
            <div className="pt-1">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                minHeight="500px"
                placeholder="Start writing your premium article using Markdown formatting..."
              />
            </div>
          </div>
        </div>

        {/* Bottom: Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Catalog Options */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Settings size={16} className="text-[#c29958]" />
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Catalog Options
                </h3>
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
                  <SelectTrigger className="bg-white dark:bg-stone-900 text-xs h-9">
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
            </div>

            <div className="flex items-center justify-between border-t pt-4 mt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" />
                  Featured Post
                </span>
                <span className="text-[9px] text-stone-500">
                  Highlight at top of blogs page.
                </span>
              </div>
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Column 2: Media Settings & Preview */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-2">
              <ImageIcon size={16} className="text-[#c29958]" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Media Settings
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Cover Image *
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative group border border-stone-200 dark:border-stone-800 rounded overflow-hidden aspect-[16/9] bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt={altText || "Cover Preview"}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white border-white bg-transparent hover:bg-white hover:text-black gap-1.5 text-xs font-bold"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        Replace Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded aspect-[16/9] text-center cursor-pointer hover:border-[#c29958] transition-colors flex flex-col items-center justify-center bg-stone-50/50 dark:bg-stone-950/20"
                  >
                    <UploadCloud className="h-7 w-7 text-stone-300 dark:text-stone-700 mb-1" />
                    <span className="text-xs text-stone-500 font-semibold">
                      Click to select file
                    </span>
                    <span className="text-[9px] text-stone-400 mt-0.5">
                      JPG, PNG, WEBP (Max 3MB)
                    </span>
                  </div>
                )}
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
                  className="bg-white dark:bg-stone-900 text-xs h-9"
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
                  className="bg-white dark:bg-stone-900 text-xs font-mono h-9"
                />
              </div>
            </div>
          </div>

          {/* Column 3: Article Tags */}
          <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-lg space-y-4 shadow-sm flex flex-col justify-start">
            <div className="flex items-center gap-2 border-b pb-2">
              <Tag size={16} className="text-[#c29958]" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Article Tags
              </h3>
            </div>

            <div className="space-y-3 relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Select Tags
              </label>
              
              {/* Custom Multi-select Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#c29958] h-9 text-left cursor-pointer select-none"
                >
                  <span>
                    {selectedTagIds.length === 0
                      ? "Select tags..."
                      : `${selectedTagIds.length} tag(s) selected`}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTagDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsTagDropdownOpen(false)}
                    />
                    <div className="absolute left-0 right-0 mt-1 z-20 max-h-[220px] overflow-y-auto bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-md shadow-lg p-1.5 space-y-1">
                      {tags.length === 0 ? (
                        <p className="text-[11px] text-stone-400 italic p-2">No tags available.</p>
                      ) : (
                        tags.map((tag) => {
                          const isSelected = selectedTagIds.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => {
                                handleTagToggle(tag.id, !isSelected);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs rounded transition-colors ${
                                isSelected
                                  ? "bg-[#f7f2ea] text-[#c29958] font-semibold dark:bg-[#c29958]/10"
                                  : "hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300"
                              }`}
                            >
                              <span>{tag.name}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#c29958]" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Selected Tags Chips */}
              <div className="pt-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Selected Tags
                </label>
                {selectedTagIds.length === 0 ? (
                  <p className="text-[10px] text-stone-400 italic">No tags selected.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {selectedTagIds.map((tagId) => {
                      const tagObj = tags.find((t) => t.id === tagId);
                      if (!tagObj) return null;
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 bg-[#222222] dark:bg-stone-100 text-white dark:text-stone-950 px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {tagObj.name}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tagId, false)}
                            className="hover:text-[#c29958] transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
