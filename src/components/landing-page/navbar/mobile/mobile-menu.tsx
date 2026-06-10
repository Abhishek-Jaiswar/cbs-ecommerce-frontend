import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { MobileNavLinks } from "./mobile-nav-links";
import { MobileAccountSection } from "./mobile-account-section";
import ProductSearchBox from "../product-search-box";
import CountBadge from "../count-badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  links: { label: string; href: string }[];
  cartCount: number;
  isAuthenticated: boolean;
  user: { name: string; role?: string } | null;
  handleLogout: () => void;
  onSearchClick: () => void;
}

export function MobileMenu({
  open,
  onOpenChange,
  pathname,
  links,
  cartCount,
  isAuthenticated,
  user,
  handleLogout,
  onSearchClick,
}: Props) {
  // Append account-related links below nav items when signed in
  const allLinks = [
    ...links,
    ...(isAuthenticated && user
      ? [
          { label: "My Account", href: "/account" },
          ...(user.role === "ADMIN"
            ? [{ label: "Dashboard", href: "/dashboard" }]
            : []),
        ]
      : []),
  ];

  return (
    <>
      <Link href="/cart" className="relative text-[#222222]">
        <ShoppingBag className="h-6 w-6" />
        <CountBadge count={cartCount} />
      </Link>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <button
            className="flex h-10 w-10 items-center justify-center border border-[#e4dfd7]"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex h-full w-[86vw] max-w-sm flex-col gap-0 rounded-none bg-white p-0"
          showCloseButton={false}
        >
          <SheetHeader className="flex-row items-center justify-between border-b border-[#eee8df] p-5">
            <SheetTitle className="text-xl font-black tracking-[0.18em]">
              Zenvoraa
            </SheetTitle>

            <SheetClose asChild>
              <button
                className="flex h-9 w-9 items-center justify-center border border-[#e4dfd7]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="px-5 py-4">
            <ProductSearchBox
              placeholder="Search products"
              onClick={() => {
                onSearchClick();
                onOpenChange(false);
              }}
            />
          </div>

          <MobileNavLinks pathname={pathname} links={allLinks} />

          <MobileAccountSection
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
