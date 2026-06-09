import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const groupedProducts = [
  {
    title: "Best Seller Product",
    products: [
      ["Diamond Exclusive Ring", "/corano/product/product-1.jpg", "₹5,000", "₹2,999", "/shop?category=rings"],
      ["Handmade Golden Ring", "/corano/product/product-3.jpg", "₹5,500", "₹3,000", "/shop?category=rings"],
      ["Exclusive Gold Jewelry", "/corano/product/product-5.jpg", "₹4,500", "₹2,500", "/shop?category=jewellery"],
      ["Perfect Diamond Earring", "/corano/product/product-7.jpg", "₹5,000", "₹2,999", "/shop?category=earrings"],
    ],
  },
  {
    title: "On-Sale Product",
    products: [
      ["Diamond Exclusive Ring", "/corano/product/product-17.jpg", "₹5,000", "₹2,999", "/shop?category=rings"],
      ["Handmade Golden Necklace", "/corano/product/product-16.jpg", "₹6,000", "₹4,000", "/shop?category=necklaces"],
      ["Perfect Diamond Jewelry", "/corano/product/product-12.jpg", "₹7,000", "₹5,500", "/shop?category=jewellery"],
      ["Citygold Exclusive Ring", "/corano/product/product-11.jpg", "₹4,500", "₹2,500", "/shop?category=rings"],
    ],
  },
];

export function BottomCollections() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Link
          href="/shop?category=wedding-rings"
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
        <div className="grid gap-8 md:grid-cols-2 font-[var(--font-corano)]">
          {groupedProducts.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 border-b border-[#eee8df] pb-3 text-lg font-bold capitalize text-[#222222]">
                {group.title}
              </h3>
              <div className="space-y-5">
                {group.products.map(([title, image, price, oldPrice, link]) => (
                  <Link
                    key={`${title}-${image}`}
                    href={link || "/shop"}
                    className="group flex gap-4"
                  >
                    <div className="relative shrink-0 w-[82px] h-[82px] bg-[#f7f2ea]">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="82px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold capitalize text-[#222222] transition-colors group-hover:text-[#c29958] line-clamp-2">
                        {title}
                      </h4>
                      <div className="mt-2 flex gap-2">
                        <span className="font-bold text-[#c29958]">{oldPrice}</span>
                        <span className="text-sm text-[#999999] line-through">
                          {price}
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
  );
}
