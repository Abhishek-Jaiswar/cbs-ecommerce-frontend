import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { mockBlogPosts } from "@/data/blogs";

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
  const blogs = React.useMemo(() => mockBlogPosts.slice(0, 3), []);

  return (
    <section className="pb-16 bg-white font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="latest blogs" subtitle="There are latest blog posts" />
        <div className="grid gap-7 md:grid-cols-3">
          {blogs.map((post) => (
            <article key={post.id} className="group">
              <Link
                href={`/blog#${post.slug}`}
                className="relative block aspect-[1.45] overflow-hidden"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-[#c29958] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {post.category}
                </span>
              </Link>
              <div className="pt-5">
                <p className="text-xs uppercase text-[#777777]">
                  By {post.author} / {post.date} / {post.readTime}
                </p>
                <h3 className="mt-2 text-base font-bold leading-6 text-[#222222] transition-colors group-hover:text-[#c29958]">
                  <Link href={`/blog#${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#666666] line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog#${post.slug}`}
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
