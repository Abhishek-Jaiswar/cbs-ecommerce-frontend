import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, User, BookOpen } from "lucide-react";
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

interface ParsedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

function parsePost(post: any): ParsedPost {
  const contentWords = post.content ? post.content.split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(contentWords / 200));
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : ""),
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
}

async function getLivePosts(): Promise<ParsedPost[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/blog-posts?page=1&limit=100`;
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const items = data?.items || [];
    
    // Only show published articles on storefront
    return items
      .filter((post: any) => post.status === "PUBLISHED")
      .map(parsePost);
  } catch (error) {
    console.error("Failed to fetch live blog posts, falling back to mock data:", error);
    return [];
  }
}

export default async function BlogPage() {
  const livePosts = await getLivePosts();
  
  const featuredPost = livePosts[0];
  const remainingPosts = livePosts.slice(1);

  return (
    <main className="flex-1 bg-white font-[var(--font-zenvoraa)]">
      {/* Hero Banner Section */}
      <section className="border-b border-[#eee8df] bg-[#f7f2ea] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-medium text-[#222222] sm:text-5xl tracking-wide">
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

      {/* Articles Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredPost ? (
            <>
              {/* Featured Article */}
              <article
                id={featuredPost.slug}
                className="grid gap-8 border-b border-[#eee8df] pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
              >
                <div className="relative aspect-[1.45] overflow-hidden bg-[#f7f2ea]">
                  {featuredPost.image ? (
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-stone-100 text-stone-400">
                      No cover image
                    </div>
                  )}
                  <span className="absolute left-5 top-5 bg-[#c29958] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {featuredPost.category}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c29958]">
                    Featured Article
                  </p>
                  <h2 className="mt-4 text-3xl font-serif font-medium leading-tight text-[#222222] sm:text-4xl tracking-wide hover:text-[#c29958] transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
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
                  <p className="mt-5 text-sm leading-7 text-[#555555] line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="mt-7 inline-flex h-11 items-center gap-2 bg-[#222222] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#c29958]"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>

              {/* Remaining Articles */}
              {remainingPosts.length > 0 && (
                <div className="pt-16">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] tracking-wide">
                      latest articles
                    </h2>

                  </div>

                  <div className="grid gap-7 md:grid-cols-2">
                    {remainingPosts.map((post) => (
                      <article
                        key={post.id}
                        id={post.slug}
                        className="group grid gap-5 border border-[#eee8df] bg-white p-4 transition-shadow hover:shadow-md sm:grid-cols-[220px_1fr]"
                      >
                        <div className="relative aspect-[1.25] overflow-hidden bg-[#f7f2ea] sm:aspect-square">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="(min-width: 768px) 220px, 100vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-stone-100 text-stone-400">
                              No cover image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c29958]">
                            {post.category}
                          </p>
                          <h3 className="mt-3 text-lg font-bold leading-6 text-[#222222] transition-colors group-hover:text-[#c29958] line-clamp-2">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase text-[#777777]">
                            <span>By {post.author}</span>
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#555555] line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <BookOpen size={48} className="stroke-[1] text-[#c29958] mb-2" />
              <h2 className="text-xl font-serif text-[#222222]">No articles found</h2>
              <p className="text-sm text-stone-500 max-w-sm">
                Check back soon for styling guides, jewelry care tips, and design highlights.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
