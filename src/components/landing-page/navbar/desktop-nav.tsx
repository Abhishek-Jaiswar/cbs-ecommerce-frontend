import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ICategories } from "@/services/api/products/products-api.types";
import ShopMegaMenu from "./shop-mega-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

interface DesktopNavProps {
  pathname: string;
  categories: ICategories[];
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (open: boolean) => void;
}

export default function DesktopNav({
  pathname,
  categories,
  isMegaMenuOpen,
  setIsMegaMenuOpen,
}: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-8 text-[13px] font-bold uppercase tracking-wide lg:flex">
      {navItems.map((item) =>
        item.href === "/shop" ? (
          <div
            key={item.href}
            className="group py-8"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link
              href={item.href}
              onClick={() => setIsMegaMenuOpen(false)}
              className={cn(
                "inline-flex items-center gap-1 transition-colors hover:text-[#c29958]",
                pathname === item.href && "text-[#c29958]",
              )}
            >
              {item.label}
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <ShopMegaMenu
              categories={categories}
              isOpen={isMegaMenuOpen}
              onClose={() => setIsMegaMenuOpen(false)}
            />
          </div>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-[#c29958]",
              pathname === item.href && "text-[#c29958]",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
