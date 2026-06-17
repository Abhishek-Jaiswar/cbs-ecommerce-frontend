import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const categoryBanners = [
  {
    align: "right",
    image: "/corano/banner/category-wedr-ban-1.png",
    label: "Beautiful",
    title: "Wedding",
    titleAccent: "Rings",
    href: "/shop?category=wedding-rings",
  },
  {
    align: "right",
    image: "/corano/banner/category-earring-ban-2.png",
    label: "Earrings",
    title: "Tangerine Floral",
    titleAccent: "Earring",
    href: "/shop?category=earrings",
  },
  {
    align: "right",
    image: "/corano/banner/category-neckles-ban-3.png",
    label: "New Arrivals",
    title: "Pearl",
    titleAccent: "Necklaces",
    href: "/shop?category=pearl-necklaces",
  },
  {
    align: "right",
    image: "/corano/banner/category-diamond-ban-4.png",
    label: "New Design",
    title: "Diamond",
    titleAccent: "Jewelry",
    href: "/shop?category=diamond-jewelry",
  },
];

export function CategoryBanners() {
  return (
    <section className="pb-16 bg-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        {categoryBanners.map((banner) => (
          <Link
            key={banner.image}
            href={banner.href}
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
              <p className="text-sm font-serif italic text-[#c29958] capitalize">
                {banner.label}
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-medium text-[#222222] leading-tight tracking-wide">
                {banner.title}
                <span className="block font-serif">{banner.titleAccent}</span>
              </h2>
              <span className="mt-5 border-b border-[#222222] text-xs font-bold uppercase text-[#222222] transition-colors group-hover:border-[#c29958] group-hover:text-[#c29958]">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
