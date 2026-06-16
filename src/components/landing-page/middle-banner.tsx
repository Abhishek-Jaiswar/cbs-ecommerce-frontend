import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function MiddleBanner() {
  return (
    <section className="pb-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="group relative block min-h-[250px] overflow-hidden bg-[#f7f2ea]"
        >
          <Image
            src="/corano/banner/img-wedding-collection.png"
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
  );
}
