import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import { mockBlogPosts } from "@/data/blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs & Styling Guides | ZenVora Handcrafted Jewelry",
  description:
    "Read ZenVora's blogs, bridal jewellery guides, styling tips, and artificial jewellery trends to complete your look with confidence.",
  openGraph: {
    title: "Blogs & Styling Guides | ZenVora Handcrafted Jewelry",
    description:
      "Read ZenVora's blogs, bridal jewellery guides, styling tips, and artificial jewellery trends to complete your look with confidence.",
    type: "website",
  },
};

export default function BlogPage() {
  const featuredPost = mockBlogPosts[0];
  const remainingPosts = mockBlogPosts.slice(1);

  return (
    <main className="flex-1 bg-white font-[var(--font-corano)]">
      <section className="border-b border-[#eee8df] bg-[#f7f2ea] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#222222] sm:text-5xl">
              Blogs
            </h1>
            <div className="mt-4 flex justify-center gap-2 text-sm text-[#777777]">
              <Link href="/" className="transition-colors hover:text-[#c29958]">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#c29958]">Blogs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredPost && (
            <article
              id={featuredPost.slug}
              className="grid gap-8 border-b border-[#eee8df] pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            >
              <div className="relative aspect-[1.45] overflow-hidden bg-[#f7f2ea]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 bg-[#c29958] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {featuredPost.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c29958]">
                  Featured Article
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#222222] sm:text-4xl">
                  {featuredPost.title}
                </h2>
                <div className="mt-5 flex flex-wrap gap-4 text-xs uppercase text-[#777777]">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {featuredPost.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {featuredPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7 text-[#555555]">
                  {featuredPost.excerpt}
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex h-11 items-center gap-2 bg-[#222222] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#c29958]"
                >
                  Shop The Edit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          )}

          <div className="pt-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold capitalize text-[#222222]">
                latest blogs
              </h2>
              <p className="mt-3 text-sm text-[#777777]">
                Mock articles for the frontend until the blog backend is ready
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-2">
              {remainingPosts.map((post) => (
                <article
                  key={post.id}
                  id={post.slug}
                  className="group grid gap-5 border border-[#eee8df] bg-white p-4 transition-shadow hover:shadow-md sm:grid-cols-[220px_1fr]"
                >
                  <div className="relative aspect-[1.25] overflow-hidden bg-[#f7f2ea] sm:aspect-square">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 768px) 220px, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c29958]">
                      {post.category}
                    </p>
                    <h3 className="mt-3 text-lg font-bold leading-6 text-[#222222] transition-colors group-hover:text-[#c29958]">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase text-[#777777]">
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#555555]">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
