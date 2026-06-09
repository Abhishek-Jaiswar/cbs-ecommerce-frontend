"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Heart,
  Headphones,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBlogPosts } from "@/data/blogs";
import { useGetProductListingQuery } from "@/services/api/products/products-api";
import type { ProductListing } from "@/services/api/products/products-api.types";

const heroSlides = [
  {
    align: "left",
    description: "Designer Jewelry Necklaces-Bracelets-Earings",
    image: "/corano/slider/home1-slide2.jpg",
    title: "Family Jewelry",
    titleAccent: "Collection",
  },
  {
    align: "right",
    description: "Shukra Yogam & Silver Power Silver Saving Schemes.",
    image: "/corano/slider/home1-slide3.jpg",
    title: "Diamonds Jewelry",
    titleAccent: "Collection",
  },
  {
    align: "left",
    description: "Rings, Occasion Pieces, Pandora & More.",
    image: "/corano/slider/home1-slide1.jpg",
    title: "Grace Designer",
    titleAccent: "Jewelry",
  },
];

const policies = [
  {
    description: "Free shipping all order",
    icon: Truck,
    title: "Free Shipping",
  },
  {
    description: "Support 24 hours a day",
    icon: Headphones,
    title: "Support 24/7",
  },
  {
    description: "30 days for free return",
    icon: RefreshCw,
    title: "Money Return",
  },
  {
    description: "We ensure secure payment",
    icon: CreditCard,
    title: "100% Payment Secure",
  },
];

const categoryBanners = [
  {
    align: "right",
    image: "/corano/banner/img1-top.jpg",
    label: "Beautiful",
    title: "Wedding",
    titleAccent: "Rings",
  },
  {
    align: "center",
    image: "/corano/banner/img2-top.jpg",
    label: "Earrings",
    title: "Tangerine Floral",
    titleAccent: "Earring",
  },
  {
    align: "center",
    image: "/corano/banner/img3-top.jpg",
    label: "New Arrivals",
    title: "Pearl",
    titleAccent: "Necklaces",
  },
  {
    align: "right",
    image: "/corano/banner/img4-top.jpg",
    label: "New Design",
    title: "Diamond",
    titleAccent: "Jewelry",
  },
];

const fallbackProducts = [
  {
    brand: "Gold",
    excerpt: "A polished everyday piece with a bright diamond-inspired finish.",
    image: "/corano/product/product-1.jpg",
    oldPrice: "$29.99",
    price: "$50.00",
    rating: "4.9",
    slug: "perfect-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Mony",
    excerpt: "A warm golden necklace designed for layered occasion styling.",
    image: "/corano/product/product-2.jpg",
    oldPrice: "$35.00",
    price: "$60.00",
    rating: "4.8",
    slug: "handmade-golden-necklace",
    title: "Handmade Golden Necklace",
  },
  {
    brand: "Diamond",
    excerpt: "Refined sparkle with a minimal setting and crisp silhouette.",
    image: "/corano/product/product-3.jpg",
    oldPrice: "",
    price: "$40.00",
    rating: "4.7",
    slug: "minimal-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Silver",
    excerpt: "A sculpted ornament with cool silver tones and elegant shine.",
    image: "/corano/product/product-4.jpg",
    oldPrice: "$45.00",
    price: "$70.00",
    rating: "4.8",
    slug: "diamond-exclusive-ornament",
    title: "Diamond Exclusive Ornament",
  },
  {
    brand: "Mony",
    excerpt: "A citygold ring with a smooth profile and easy daily polish.",
    image: "/corano/product/product-5.jpg",
    oldPrice: "$25.00",
    price: "$45.00",
    rating: "4.6",
    slug: "citygold-exclusive-ring",
    title: "Citygold Exclusive Ring",
  },
  {
    brand: "Gold",
    excerpt: "A statement piece built around classic shine and soft detailing.",
    image: "/corano/product/product-6.jpg",
    oldPrice: "$60.00",
    price: "$80.00",
    rating: "4.9",
    slug: "classic-diamond-jewelry",
    title: "Perfect Diamond Jewelry",
  },
  {
    brand: "Mony",
    excerpt: "Hand-finished gold styling with a clean neckline presence.",
    image: "/corano/product/product-7.jpg",
    oldPrice: "$40.00",
    price: "$55.00",
    rating: "4.7",
    slug: "golden-necklace-edit",
    title: "Handmade Golden Necklace",
  },
  {
    brand: "Diamond",
    excerpt: "A bright diamond look for weddings, gifting, and evening wear.",
    image: "/corano/product/product-8.jpg",
    oldPrice: "",
    price: "$95.00",
    rating: "5.0",
    slug: "diamond-jewelry-highlight",
    title: "Perfect Diamond Jewelry",
  },
];

const testimonials = [
  {
    author: "Lindsy Niloms",
    image: "/corano/testimonial/testimonial-1.png",
    quote:
      "Vivamus a lobortis ipsum, vel condimentum magna. Etiam id turpis tortor. Nunc scelerisque, nisi a blandit varius.",
  },
  {
    author: "Daisy Millan",
    image: "/corano/testimonial/testimonial-2.png",
    quote:
      "Nunc purus venenatis ligula, sed venenatis orci augue nec sapien. The finish and packaging felt truly premium.",
  },
  {
    author: "Anamika Lusy",
    image: "/corano/testimonial/testimonial-3.png",
    quote:
      "The jewelry arrived beautifully polished and the details were even better in person. A lovely shopping experience.",
  },
];

const groupedProducts = [
  {
    title: "Best Seller Product",
    products: [
      ["Diamond Exclusive Ring", "/corano/product/product-1.jpg", "$50.00", "$29.99"],
      ["Handmade Golden Ring", "/corano/product/product-3.jpg", "$55.00", "$30.00"],
      ["Exclusive Gold Jewelry", "/corano/product/product-5.jpg", "$45.00", "$25.00"],
      ["Perfect Diamond Earring", "/corano/product/product-7.jpg", "$50.00", "$29.99"],
    ],
  },
  {
    title: "On-Sale Product",
    products: [
      ["Diamond Exclusive Ring", "/corano/product/product-17.jpg", "$50.00", "$29.99"],
      ["Handmade Golden Necklace", "/corano/product/product-16.jpg", "$60.00", "$40.00"],
      ["Perfect Diamond Jewelry", "/corano/product/product-12.jpg", "$70.00", "$55.00"],
      ["Citygold Exclusive Ring", "/corano/product/product-11.jpg", "$45.00", "$25.00"],
    ],
  },
];

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return price;

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

function SectionTitle({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <div className="mb-10 text-center font-[var(--font-corano)]">
      <h2 className="text-3xl font-bold capitalize text-[#222222] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#777777]">{subtitle}</p>
    </div>
  );
}

function ProductCard({
  product,
  staticProduct,
}: {
  product?: ProductListing;
  staticProduct?: (typeof fallbackProducts)[number];
}) {
  const image = staticProduct?.image ?? "/corano/product/product-1.jpg";
  const title = product?.name ?? staticProduct?.title ?? "Perfect Diamond Jewelry";
  const excerpt =
    product?.excerpt ??
    staticProduct?.excerpt ??
    "A refined Zenvoraa piece designed for everyday elegance.";
  const price = product ? formatPrice(product.price) : staticProduct?.price ?? "$50.00";
  const oldPrice = product?.originalPrice
    ? formatPrice(product.originalPrice)
    : staticProduct?.oldPrice;
  const href = product
    ? `/shop/${product.slug}`
    : `/shop/${staticProduct?.slug ?? "perfect-diamond-jewelry"}`;
  const rating = staticProduct?.rating ?? "4.8";

  return (
    <article className="group flex h-full flex-col bg-transparent font-[var(--font-corano)] pb-4">
      <div className="relative overflow-hidden bg-[#fbfaf8] aspect-square">
        <Link href={href} className="relative block w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          <span className="bg-stone-900/90 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
            New
          </span>
          {oldPrice && (
            <span className="bg-[#c29958]/95 backdrop-blur-[2px] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
              Sale
            </span>
          )}
        </div>
        
        {/* Minimal Wishlist Button in Top-Right */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-[2px] text-stone-700 shadow-sm border border-stone-100/50 transition-all duration-300 hover:bg-[#c29958] hover:text-white hover:border-[#c29958] hover:scale-105"
            aria-label="Add to wishlist"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Add Slide-Up Bar */}
        <Link
          href={href}
          className="absolute inset-x-0 bottom-0 flex h-10 translate-y-full items-center justify-center gap-1.5 bg-stone-900/90 backdrop-blur-[2px] text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#c29958] group-hover:translate-y-0 z-10"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          View Product
        </Link>
      </div>

      <div className="flex flex-1 flex-col pt-4 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c29958]">
          {staticProduct?.brand ?? "Zenvoraa"}
        </p>
        <h3 className="mt-1.5 text-[15px] font-serif font-medium text-stone-850 leading-snug transition-colors duration-300 group-hover:text-[#c29958] line-clamp-1">
          <Link href={href}>{title}</Link>
        </h3>
        
        <p className="mt-2 text-xs leading-relaxed text-stone-400 line-clamp-2 min-h-[32px]">
          {excerpt}
        </p>

        {/* Left Aligned Price and Right Aligned Star */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100/60 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-850 tracking-wide">{price}</span>
            {oldPrice && (
              <span className="text-[11px] text-stone-400 line-through font-light">{oldPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#c29958]">
            <Star className="h-3 w-3 fill-current stroke-current" />
            <span className="text-[11px] font-bold text-stone-500 font-mono">{rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const { data, isLoading } = useGetProductListingQuery({ limit: 8, page: 1 });
  const displayProducts = data?.data.items.slice(0, 8) ?? [];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <main className="flex-1 bg-white font-[var(--font-corano)]">
      <section className="relative overflow-hidden">
        <div className="relative min-h-[520px] md:min-h-[650px]">
          {heroSlides.map((item, index) => (
            <div
              key={item.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt={`${item.title} ${item.titleAccent}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-white/15" />
            </div>
          ))}
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 sm:px-6 md:min-h-[650px] lg:px-8">
            <div
              className={`max-w-xl ${
                slide.align === "right" ? "ml-auto text-left md:text-right" : ""
              }`}
            >
              <h1 className="text-4xl font-bold leading-tight text-[#222222] sm:text-5xl md:text-6xl">
                {slide.title}
                <span className="block text-[#c29958]">{slide.titleAccent}</span>
              </h1>
              <p className="mt-5 text-base font-bold text-[#555555] md:text-lg">
                {slide.description}
              </p>
              <Button
                asChild
                className="mt-8 h-12 rounded-none bg-[#222222] px-8 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c29958]"
              >
                <Link href="/shop">Read More</Link>
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)
            }
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#ddd6ca] bg-white/80 text-[#222222] transition-colors hover:bg-[#c29958] hover:text-white md:flex"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#ddd6ca] bg-white/80 text-[#222222] transition-colors hover:bg-[#c29958] hover:text-white md:flex"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center gap-3">
            {heroSlides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full border border-[#c29958] ${
                  activeSlide === index ? "bg-[#c29958]" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#eee8df] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm leading-7 text-[#555555]">
            Discover Zenvoraa jewelry collections crafted for everyday elegance,
            celebrations, and timeless gifting.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {policies.map(({ description, icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon className="h-10 w-10 shrink-0 text-[#c29958]" />
              <div>
                <h3 className="text-base font-bold text-[#222222]">{title}</h3>
                <p className="mt-1 text-sm text-[#777777]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          {categoryBanners.map((banner) => (
            <Link
              key={banner.image}
              href="/shop"
              className="group relative block min-h-[250px] overflow-hidden bg-[#f7f2ea]"
            >
              <Image
                src={banner.image}
                alt={`${banner.title} ${banner.titleAccent}`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className={`absolute inset-y-0 flex w-full flex-col justify-center p-8 ${
                  banner.align === "center"
                    ? "items-center text-center"
                    : "items-end text-right"
                }`}
              >
                <p className="text-sm font-bold uppercase text-[#c29958]">
                  {banner.label}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#222222]">
                  {banner.title}
                  <span className="block">{banner.titleAccent}</span>
                </h2>
                <span className="mt-5 border-b border-[#222222] text-xs font-bold uppercase text-[#222222] transition-colors group-hover:border-[#c29958] group-hover:text-[#c29958]">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="our products" subtitle="Add our products to weekly lineup" />
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {["All", "Gold", "Diamond", "Platinum", "Silver"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeTab === tab
                    ? "border-[#c29958] bg-[#c29958] text-white"
                    : "border-[#eee8df] text-[#555555] hover:border-[#c29958] hover:text-[#c29958]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-square bg-[#f0ebe2]" />
                  <div className="mx-auto mt-5 h-4 w-24 bg-[#f0ebe2]" />
                  <div className="mx-auto mt-3 h-5 w-40 bg-[#f0ebe2]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts.length > 0
                ? displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : fallbackProducts.map((product) => (
                    <ProductCard key={product.image} staticProduct={product} />
                  ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="group relative block min-h-[250px] overflow-hidden bg-[#f7f2ea]"
          >
            <Image
              src="/corano/banner/img1-middle.jpg"
              alt="Beautiful bridal collection"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-y-0 right-0 flex w-full flex-col items-end justify-center p-8 text-right md:w-1/2 md:p-12">
              <p className="text-sm font-bold uppercase text-[#c29958]">
                Wedding Collection
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#222222] md:text-4xl">
                Designer Jewelry
              </h2>
              <span className="mt-5 border-b border-[#222222] text-xs font-bold uppercase text-[#222222] transition-colors group-hover:border-[#c29958] group-hover:text-[#c29958]">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="relative py-20">
        <Image
          src="/corano/testimonial/testimonials-bg.jpg"
          alt="Testimonials background"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-white/70" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle title="testimonials" subtitle="What they say" />
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.author}>
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={86}
                  height={86}
                  className="mx-auto rounded-full"
                />
                <p className="mt-6 text-sm leading-7 text-[#555555]">
                  {testimonial.quote}
                </p>
                <div className="mt-4 flex justify-center text-[#c29958]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <h3 className="mt-4 text-sm font-bold uppercase text-[#222222]">
                  {testimonial.author}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Link
            href="/shop"
            className="group relative block min-h-[360px] overflow-hidden bg-[#f7f2ea]"
          >
            <Image
              src="/corano/banner/img-bottom-banner.jpg"
              alt="Wedding rings"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm font-bold uppercase text-[#c29958]">Beautiful</p>
              <h2 className="mt-2 text-4xl font-bold text-[#222222]">
                Wedding Rings
              </h2>
              <span className="mt-5 border-b border-[#222222] text-xs font-bold uppercase text-[#222222] transition-colors group-hover:border-[#c29958] group-hover:text-[#c29958]">
                Shop Now
              </span>
            </div>
          </Link>
          <div className="grid gap-8 md:grid-cols-2">
            {groupedProducts.map((group) => (
              <div key={group.title}>
                <h3 className="mb-6 border-b border-[#eee8df] pb-3 text-lg font-bold capitalize text-[#222222]">
                  {group.title}
                </h3>
                <div className="space-y-5">
                  {group.products.map(([title, image, price, oldPrice]) => (
                    <Link
                      key={`${title}-${image}`}
                      href="/shop"
                      className="group flex gap-4"
                    >
                      <Image
                        src={image}
                        alt={title}
                        width={82}
                        height={82}
                        className="bg-[#f7f2ea] object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold capitalize text-[#222222] transition-colors group-hover:text-[#c29958]">
                          {title}
                        </h4>
                        <div className="mt-2 flex gap-2">
                          <span className="font-bold text-[#c29958]">{price}</span>
                          <span className="text-sm text-[#999999] line-through">
                            {oldPrice}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="latest blogs" subtitle="There are latest blog posts" />
          <div className="grid gap-7 md:grid-cols-3">
            {mockBlogPosts.map((post) => (
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
                  <p className="mt-3 text-sm leading-6 text-[#666666]">
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

      <section className="border-t border-[#eee8df] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
          {[1, 2, 3, 4, 5, 6].map((brand) => (
            <Image
              key={brand}
              src={`/corano/brand/${brand}.png`}
              alt={`Brand ${brand}`}
              width={160}
              height={90}
              className="mx-auto opacity-60 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </section>

      <section className="border-t border-[#eee8df] bg-[#f9f5f0] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-[#222222]">
              Ready to find your next signature piece?
            </h2>
            <p className="mt-2 text-sm text-[#777777]">
              Explore the full Zenvoraa catalog with live shop filters.
            </p>
          </div>
          <Button
            asChild
            className="h-12 rounded-none bg-[#c29958] px-8 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#222222]"
          >
            <Link href="/shop">
              Shop Collection <ShieldCheck className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
