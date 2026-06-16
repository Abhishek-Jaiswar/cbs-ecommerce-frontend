import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ICategories } from "@/services/api/products/products-api.types";
import MegaMenuColumn from "./mega-menu-column";

const fallbackCategoryLinks = [
  { label: "Wedding Rings", href: "/shop?category=wedding-rings" },
  { label: "Gold Jewelry", href: "/shop?category=gold-jewelry" },
  { label: "Diamond Jewelry", href: "/shop?category=diamond-jewelry" },
  { label: "Pearl Necklaces", href: "/shop?category=pearl-necklaces" },
];

const shopFeatureLinks = [
  { label: "New Arrivals", href: "/shop?tag=new" },
  { label: "Featured Products", href: "/shop?featured=true" },
  { label: "On Sale", href: "/shop?sale=true" },
  { label: "All Collections", href: "/shop" },
];

interface ShopMegaMenuProps {
  categories: ICategories[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopMegaMenu({
  categories,
  isOpen,
  onClose,
}: ShopMegaMenuProps) {
  const activeCategories = categories.filter((category) => category.isActive);
  const rootCategories = activeCategories.filter(
    (category) => !category.parentId,
  );
  const subCategories = activeCategories.filter(
    (category) => category.parentId,
  );

  const categoryLinks =
    rootCategories.length > 0
      ? rootCategories.slice(0, 5).map((category) => ({
          href: `/shop?category=${category.slug}`,
          label: category.name,
        }))
      : fallbackCategoryLinks;

  const subCategoryLinks =
    subCategories.length > 0
      ? subCategories.slice(0, 5).map((category) => ({
          href: `/shop?category=${category.slug}`,
          label: category.name,
        }))
      : [
          { label: "Rings", href: "/shop?category=rings" },
          { label: "Necklaces", href: "/shop?category=necklaces" },
          { label: "Earrings", href: "/shop?category=earrings" },
          { label: "Bracelets", href: "/shop?category=bracelets" },
        ];

  return (
    <div
      className={cn(
        "invisible fixed left-1/2 top-[125px] z-40 w-[min(1380px,calc(100vw-48px))] -translate-x-1/2 translate-y-3 border border-[#eee8df] bg-white px-9 py-9 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-200 pointer-events-none",
        isOpen && "visible translate-y-0 opacity-100 pointer-events-auto",
      )}
    >
      <div className="grid grid-cols-4 gap-12">
        <MegaMenuColumn
          links={categoryLinks}
          title="Categories"
          onItemClick={onClose}
        />
        <MegaMenuColumn
          links={subCategoryLinks}
          title="Sub Categories"
          onItemClick={onClose}
        />
        <MegaMenuColumn
          links={shopFeatureLinks}
          title="Shop"
          onItemClick={onClose}
        />
        <MegaMenuColumn
          title="More"
          links={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Wishlist", href: "/wishlist" },
            { label: "My Account", href: "/account" },
          ]}
          onItemClick={onClose}
        />
      </div>

      <div className="mt-9 grid grid-cols-2 gap-6">
        <Link
          href="/shop?category=wedding-rings"
          onClick={onClose}
          className="group/banner relative block h-[190px] overflow-hidden bg-[#f7f2ea]"
        >
          <Image
            src="/corano/banner/img1-static-menu.png"
            alt="Wedding rings"
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-700 group-hover/banner:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-8 text-left">
            <h4 className="text-2xl font-normal normal-case tracking-normal text-[#555555]">
              Wedding Rings
            </h4>
            <span className="mt-4 w-fit border-b border-[#222222] text-sm font-bold normal-case tracking-normal text-[#222222] transition-colors group-hover/banner:border-[#c29958] group-hover/banner:text-[#c29958]">
              Shop Now
            </span>
          </div>
        </Link>

        <Link
          href="/shop?category=jewellery"
          onClick={onClose}
          className="group/banner relative block h-[190px] overflow-hidden bg-[#f7f2ea]"
        >
          <Image
            src="/corano/banner/img2-static-menu.png"
            alt="Zenvoraa jewellery"
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-700 group-hover/banner:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-8 text-left">
            <h4 className="text-2xl font-normal normal-case tracking-normal text-[#555555]">
              Our Jewellery
            </h4>
            <span className="mt-4 w-fit border-b border-[#222222] text-sm font-bold normal-case tracking-normal text-[#222222] transition-colors group-hover/banner:border-[#c29958] group-hover/banner:text-[#c29958]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
