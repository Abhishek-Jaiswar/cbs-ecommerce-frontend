import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const categoryBanners = [
  {
    align: "right",
    image: "/corano/banner/img1-top.jpg",
    label: "Beautiful",
    title: "Wedding",
    titleAccent: "Rings",
    href: "/shop?category=wedding-rings",
  },
  {
    align: "center",
    image: "/corano/banner/img2-top.jpg",
    label: "Earrings",
    title: "Tangerine Floral",
    titleAccent: "Earring",
    href: "/shop?category=earrings",
  },
  {
    align: "center",
    image: "/corano/banner/img3-top.jpg",
    label: "New Arrivals",
    title: "Pearl",
    titleAccent: "Necklaces",
    href: "/shop?category=pearl-necklaces",
  },
  {
    align: "right",
    image: "/corano/banner/img4-top.jpg",
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
  );
}
