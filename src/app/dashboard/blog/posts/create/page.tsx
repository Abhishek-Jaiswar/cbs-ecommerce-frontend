"use client";

import React from "react";
import { PostForm } from "../../_components/post-form";

export default function CreateBlogPostPage() {
  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-10 bg-background text-foreground w-full">
      <div>
        <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
          Create New Article
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Write and format your post using our bespoke Markdown editor.
        </p>
      </div>
      <PostForm />
    </div>
  );
}
