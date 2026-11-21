"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZvLogo } from "@/components/layout/zv-logo";
import { useGetActiveLandingCategoriesQuery } from "@/services/api/landing-pages/landing-category.api";

/** Figma defaults; an active "Category banner" (dashboard) in the same slot overrides one. */
const defaults = [
  { slot: 1, name: "Earrings", href: "/shop?category=earrings", image: "/zenvoraa/home/cat-earrings.webp", position: "object-bottom", well: true },
  { slot: 2, name: "Necklaces", href: "/shop?category=necklaces", image: "/zenvoraa/home/cat-necklaces.webp", position: "object-[0%_72%]" },
  { slot: 3, name: "Bracelets", href: "/shop?category=bracelets", image: "/zenvoraa/home/cat-bracelets.webp", position: "object-center" },
  { slot: 4, name: "Rings", href: "/shop?category=rings", image: "/zenvoraa/home/cat-rings.webp", position: "object-bottom" },
];

const catalogActions = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop?tag=new" },
  { label: "Sale", href: "/shop?sale=true" },
];

/** Figma Home > Shop: sticky photo on the left, scrolling category banners on the right. */
export function HomeCollections() {
  const { data } = useGetActiveLandingCategoriesQuery();
  const cms = data?.data ?? [];

  const banners = defaults.map((d) => {
    const b = cms.find((x) => x.slot === d.slot);
    if (!b) return d;
    return {
      ...d,
      name: b.category?.name || b.label || d.name,
      href: b.category?.slug ? `/shop?category=${b.category.slug}` : d.href,
      image: b.image || d.image,
      position: "object-center",
      well: false,
    };
  });

  return (
    <section aria-label="Our collection" className="bg-white lg:grid lg:grid-cols-2">
      {/* Desktop sticky photo */}
      <div className="relative hidden lg:block">
        <div className="sticky top-0 h-screen max-h-[1118px] overflow-hidden">
          <img
            src="/zenvoraa/home/shop-split-model.webp"
            alt="Model wearing layered gold necklaces, rings and a bracelet"
            className="size-full object-cover object-[30%_center]"
          />
          <ZvLogo variant="wordmark" className="absolute bottom-5 left-zv-20 h-12 w-[142px]" alt="" />
        </div>
      </div>

      {/* Category banners */}
      <div className="flex flex-col gap-4 px-zv-20 py-8 lg:gap-zv-20 lg:py-zv-40">
        {banners.map((b, i) => (
          <Link
            key={b.slot}
            href={b.href}
            className={cn(
              "group relative block h-[190px] overflow-hidden lg:h-[372px]",
              i % 2 === 0
                ? "rounded-[0_32px_0_32px] lg:rounded-leaf-lg-mirror"
                : "rounded-[32px_0_32px_0] lg:rounded-leaf-lg",
              b.well && "bg-zv-bg",
            )}
          >
            <img
              src={b.image}
              alt=""
              loading="lazy"
              className={cn("absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105", b.position)}
            />
            <span className="absolute bottom-3 right-5 font-zv-display text-[28px] italic text-zv-ink-brown lg:bottom-5 lg:right-zv-30 lg:text-[36px]">
              {b.name}
            </span>
          </Link>
        ))}

        {/* Catalog call to action */}
        <div className="relative flex flex-col gap-[14px] overflow-hidden rounded-leaf p-zv-20 lg:min-h-[371px] lg:justify-between lg:gap-zv-20">
          <img
            src="/zenvoraa/home/catalog-cta.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover object-[center_47%]"
          />
          <div className="absolute inset-0 bg-zv-ink-brown/40" aria-hidden />
          <div className="relative flex flex-col gap-[14px] lg:gap-zv-20">
            <h2 className="font-zv-display text-[30px] italic leading-[1.1] text-white lg:text-[36px] lg:leading-normal">
              Ready to find your next signature piece?
            </h2>
            <p className="text-sm leading-[1.5] text-white lg:text-lg lg:leading-normal">
              Explore the full ZenVoraa catalog. Filter by category, price, and materials to discover
              handcrafted luxury made just for you.
            </p>
          </div>
          <div className="relative flex flex-col gap-zv-10 pt-2 lg:flex-row lg:justify-end lg:gap-zv-20 lg:pt-0">
            {catalogActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="type-button flex h-11 items-center justify-center rounded-leaf border border-zv-primary bg-white px-zv-30 text-zv-primary transition-colors hover:bg-zv-primary hover:text-white lg:h-[51px] lg:w-[169px]"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
