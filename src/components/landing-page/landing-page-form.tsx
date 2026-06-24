"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateLandingPageMutation,
  useUpdateLandingPageMutation,
  useGetLandingPageQuery,
} from "@/services/api/landing-pages/landing-page.api";
import ImageUpload from "./image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface Props {
  id?: string;
}

export default function LandingPageForm({ id }: Props) {
  const router = useRouter();

  // Queries & Mutations
  const { data: landingPageData, isLoading: isFetching } = useGetLandingPageQuery(id!, {
    skip: !id,
  });

  const [createLandingPage, { isLoading: isCreating }] = useCreateLandingPageMutation();
  const [updateLandingPage, { isLoading: isUpdating }] = useUpdateLandingPageMutation();

  const isPending = isCreating || isUpdating;

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Populate edit fields
  useEffect(() => {
    if (landingPageData?.data) {
      const lp = landingPageData.data;
      setTitle(lp.title);
      setSlug(lp.slug);
      setDescription(lp.description || "");
      setIsPublished(lp.isPublished);
      setExistingImageUrl(lp.imageUrl);
    }
  }, [landingPageData]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug is required.");
      return;
    }
    if (!id && !imageFile) {
      setErrorMsg("Banner image is required for new landing pages.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("description", description.trim());
    formData.append("isPublished", String(isPublished));

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      if (id) {
        await updateLandingPage({ id, body: formData }).unwrap();
      } else {
        await createLandingPage(formData).unwrap();
      }
      router.push("/dashboard/landing-pages");
    } catch (err: any) {
      console.error("Landing page submit error:", err);
      setErrorMsg(err?.data?.message || "Failed to save landing page.");
    }
  };

  if (id && isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // Auto generate slug from title if in create mode
            if (!id) {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")
              );
            }
          }}
          placeholder="e.g. Black Friday Promotion"
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
          Slug (URL path)
        </label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          placeholder="e.g. black-friday"
          disabled={isPending}
          required
        />
        <p className="text-xs text-gray-400">
          The public page will be accessible at /shop/{slug || "..."}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Summary of the campaign or offer..."
          rows={3}
          disabled={isPending}
        />
      </div>

      <div className="border-t pt-6">
        <ImageUpload value={existingImageUrl} onChange={setImageFile} />
      </div>

      <div className="flex items-center space-x-2 border-t pt-6">
        <Checkbox
          id="isPublished"
          checked={isPublished}
          onCheckedChange={(checked) => setIsPublished(!!checked)}
          disabled={isPending}
        />
        <label
          htmlFor="isPublished"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Publish immediately (make active on website)
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={isPending} className="flex-1 md:flex-none">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : id ? (
            "Save Changes"
          ) : (
            "Create Landing Page"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/landing-pages")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}