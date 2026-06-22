"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetBlogPostsQuery } from "@/services/api/blog/blog-api";

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mb-10 text-center font-[var(--font-zenvoraa)]">
      <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] sm:text-4xl tracking-wide">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#777777]">{subtitle}</p>
    </div>
  );
}

export function LatestBlogs() {
  const { data, isLoading, isError, error } = useGetBlogPostsQuery({ page: 1, limit: 3 });

  React.useEffect(() => {
    console.log("LatestBlogs hook status:", { data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

  // Only show published articles
  const posts = React.useMemo(() => {
    const items = data?.items || [];
    return items
      .filter((post) => post.status === "PUBLISHED")
      .map((post) => {
        const contentWords = post.content ? post.content.split(/\s+/).length : 0;
        const readTimeMin = Math.max(1, Math.ceil(contentWords / 200));
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || (post.content ? post.content.substring(0, 120) + "..." : ""),
          image: post.image,
          category: post.category?.name || "Style Guides",
          author: post.author?.name || "Admin",
          date: new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          readTime: `${readTimeMin} min read`,
        };
      });
  }, [data]);

  if (isLoading) {
    return (
      <section className="pb-16 bg-white font-[var(--font-zenvoraa)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="latest blogs" subtitle="Loading articles..." />
          <div className="grid gap-7 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse" style={{ contentVisibility: "auto" }}>
                <div className="aspect-[1.45] bg-stone-100 rounded" />
                <div className="mt-5 h-4 w-1/3 bg-stone-150 rounded" />
                <div className="mt-2 h-6 w-3/4 bg-stone-200 rounded" />
                <div className="mt-3 h-4 w-full bg-stone-100 rounded" />
                <div className="mt-1 h-4 w-5/6 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show the section if no posts are published
  }

  return (
    <section className="pb-16 bg-white font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="latest blogs" subtitle="Read our styling guides and jewelry highlights" />
        <div className="grid gap-7 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[1.45] overflow-hidden bg-[#f7f2ea] rounded"
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-stone-400">
                    No image
                  </div>
                )}
                <span className="absolute left-4 top-4 bg-[#c29958] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {post.category}
                </span>
              </Link>
              <div className="pt-5">
                <p className="text-xs uppercase text-[#777777]">
                  By {post.author} / {post.date} / {post.readTime}
                </p>
                <h3 className="mt-2 text-base font-bold leading-6 text-[#222222] transition-colors group-hover:text-[#c29958]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#666666] line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block border-b border-[#222222] text-xs font-bold uppercase tracking-wide text-[#222222] transition-colors group-hover:border-[#c29958] group-hover:text-[#c29958]"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
