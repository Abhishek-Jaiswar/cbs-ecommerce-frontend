import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, User, ArrowLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Metadata } from "next";
import { ShareButton } from "./share-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getLivePostBySlug(slug: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts/slug/${slug}`;
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error(`Failed to fetch live post for slug "${slug}":`, error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await getLivePostBySlug(slug);
  
  if (!post) {
    return {
      title: "Article Not Found | ZenVora",
    };
  }

  return {
    title: `${post.title} | Blogs & Styling Guides | ZenVora`,
    description: post.excerpt || "Read our styling guides and jewelry highlights to complete your look.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read our styling guides and jewelry highlights to complete your look.",
      images: post.image ? [{ url: post.image }] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch live post
  const post = await getLivePostBySlug(slug);

  // If live post is not found, return 404
  if (!post) {
    notFound();
  }

  const contentWords = post.content ? post.content.split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(contentWords / 200));
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="flex-1 bg-white font-[var(--font-zenvoraa)]">
      {/* Article Header Banner */}
      <section className="bg-[#f7f2ea] border-b border-[#eee8df] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c29958]">
              {post.category?.name || "Style Guide"}
            </span>
            <h1 className="text-3xl font-serif font-medium text-[#222222] sm:text-4xl lg:text-5xl leading-tight tracking-wide max-w-3xl mx-auto">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs uppercase text-[#777777] pt-2">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#c29958]" />
                By {post.author?.name || "Admin"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[#c29958]" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#c29958]" />
                {readTimeMin} Min Read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Cover Image */}
          {post.image && (
            <div className="relative aspect-[1.8] w-full overflow-hidden bg-[#f7f2ea] mb-12 shadow-sm border border-stone-200/55 rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          )}



          {/* Article Body */}
          <article className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8">
            {/* Sidebar Share/Back */}
            <div className="lg:sticky lg:top-24 flex lg:flex-col items-center gap-4 lg:py-2 border-b lg:border-b-0 pb-4 lg:pb-0 border-stone-150">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-stone-500 hover:text-[#c29958] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
              <div className="hidden lg:block h-px w-8 bg-stone-200 my-2" />
              <ShareButton />
            </div>

            {/* Markdown Body Content */}
            <div className="min-w-0">
              <MarkdownRenderer content={post.content} />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
