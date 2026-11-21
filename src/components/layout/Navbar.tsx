"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Settings, User as UserIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";
import { useGetCartQuery } from "@/services/api/cart/cart-api";
import { useGetWishlistQuery } from "@/services/api/wishlist/wishlist-api";
import { SearchDialog, CountBadge } from "@/components/landing-page/navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ZvLogo } from "./zv-logo";

export const storefrontNav = [
  { label: "Home", href: "/" },
  { label: "Our Collection", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const menuCategories = [
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Necklaces", href: "/shop?category=necklaces" },
  { label: "Bracelets", href: "/shop?category=bracelets" },
  { label: "Rings", href: "/shop?category=rings" },
];

/* Figma icons (20px, primary). Plain <img> keeps the exported vectors intact. */
function Icon({ name, label }: { name: string; label?: string }) {
  return (
     
    <img src={`/zenvoraa/icons/${name}.svg`} alt={label ?? ""} width={20} height={20} className="size-5" />
  );
}

/**
 * Storefront header (Figma "Nav").
 * overlay=true floats it over a full-bleed hero (Home, Shop, Product);
 * otherwise it sits in the page flow on white.
 */
const Navbar = ({ overlay = false }: { overlay?: boolean }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const { data: cartRes } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: wishlistRes } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const cartCount = cartRes?.data?.items?.length ?? 0;
  const wishlistCount = wishlistRes?.data?.items?.length ?? 0;

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      router.push("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <header
      className={cn(
        "z-40 w-full font-zv-body",
        overlay ? "absolute inset-x-0 top-0" : "relative border-b border-zv-bg bg-white",
      )}
    >
      <div className="flex items-center justify-between px-zv-20 py-4 lg:h-[114px] lg:py-0">
        {/* Logo + menu */}
        <div className="flex items-center gap-zv-20 lg:gap-[10px]">
          <Link href="/" aria-label="ZenVoraa home">
            <ZvLogo variant="monogram" className="size-[60px] lg:size-20" alt="ZenVoraa" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="transition-opacity hover:opacity-80"
          >
            <img src="/zenvoraa/icons/menu.svg" alt="" width={61} height={34} className="h-[34px] w-[61px]" />
          </button>
        </div>

        {/* Actions pill */}
        <div
          className={cn(
            "flex items-center gap-[19px] rounded-leaf-mirror bg-white px-zv-20 py-zv-10",
            !overlay && "border border-zv-bg",
          )}
        >
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="hidden transition-opacity hover:opacity-70 lg:block"
          >
            <Icon name="search" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="hidden transition-opacity hover:opacity-70 lg:block"
              >
                <Icon name="account" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-leaf-mirror border border-zv-primary bg-white p-2 font-zv-body text-zv-ink"
            >
              {isAuthenticated && user ? (
                <>
                  <DropdownMenuLabel className="type-serif-sm px-2 py-1.5 text-base text-zv-primary">
                    {user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zv-bg" />
                  <DropdownMenuItem asChild className="cursor-pointer text-sm">
                    <Link href="/account">
                      <UserIcon className="mr-2 size-4" /> My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer text-sm">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="cursor-pointer text-sm text-zv-primary">
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 size-4" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zv-bg" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-sm text-rose-700">
                    <LogOut className="mr-2 size-4" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer text-sm">
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer text-sm">
                    <Link href="/signup">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden transition-opacity hover:opacity-70 lg:block"
          >
            <Icon name="wishlist" />
            <CountBadge count={wishlistCount} />
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative transition-opacity hover:opacity-70">
            <Icon name="cart" />
            <CountBadge count={cartCount} />
          </Link>
        </div>
      </div>

      {/* Menu sheet (opened by the leaf "menu" button, all breakpoints) */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="flex h-full w-[86vw] max-w-sm flex-col gap-0 overflow-y-auto border-r-0 bg-white p-0 font-zv-body"
        >
          <SheetHeader className="flex-row items-center justify-between border-b border-zv-bg p-zv-20">
            <SheetTitle asChild>
              <ZvLogo variant="wordmark" className="h-10 w-[118px]" alt="ZenVoraa" />
            </SheetTitle>
            <SheetClose asChild>
              <button type="button" aria-label="Close menu" className="text-zv-primary">
                <X className="size-6" />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="flex flex-col gap-zv-20 p-zv-20">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="type-body-sm flex items-center gap-zv-10 rounded-leaf border border-zv-primary px-zv-20 py-zv-10 text-left text-zv-hover"
            >
              <Icon name="search" /> Search jewellery
            </button>

            <nav className="flex flex-col gap-zv-10">
              {storefrontNav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "type-button w-full border border-zv-primary bg-white px-zv-30 py-zv-10 text-center text-zv-primary transition-colors hover:bg-zv-primary hover:text-white",
                    i % 2 === 0 ? "rounded-leaf" : "rounded-leaf-mirror",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-zv-10 border-t border-zv-bg pt-zv-20">
              <p className="type-h4 text-zv-ink-brown">Shop by category</p>
              {menuCategories.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="type-body text-zv-ink transition-colors hover:text-zv-primary"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-zv-10 border-t border-zv-bg pt-zv-20">
              {isAuthenticated && user ? (
                <>
                  <p className="type-signature text-zv-primary">{user.name}</p>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="type-body hover:text-zv-primary">
                    My Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="type-body hover:text-zv-primary">
                    Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="type-body text-zv-primary">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="type-body text-left text-rose-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-zv-10">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="type-button flex-1 rounded-leaf border border-zv-primary bg-zv-primary px-zv-20 py-zv-10 text-center text-white hover:bg-zv-hover"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="type-button flex-1 rounded-leaf border border-zv-primary bg-white px-zv-20 py-zv-10 text-center text-zv-primary"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SearchDialog
        isOpen={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Navbar;
