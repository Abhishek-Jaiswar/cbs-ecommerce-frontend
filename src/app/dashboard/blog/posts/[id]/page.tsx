"use client";

import React, { use } from "react";
import { useGetBlogPostByIdQuery } from "@/services/api/blog/blog-api";
import { PostForm } from "../../_components/post-form";
import { RefreshCw } from "lucide-react";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = use(params);
  const { data: post, isLoading, isError } = useGetBlogPostByIdQuery(id);

  if (isLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <RefreshCw size={24} className="animate-spin text-stone-400" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="p-8 text-center text-rose-600 dark:text-rose-450 font-semibold bg-rose-50/20 border border-rose-100 rounded-lg max-w-lg mx-auto mt-12">
        Article not found or failed to load.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
          Edit Article
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Update settings, images, tags, or rewrite content in real-time.
        </p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
