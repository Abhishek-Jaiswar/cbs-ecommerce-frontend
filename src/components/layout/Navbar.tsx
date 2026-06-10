"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";
import { useGetCartQuery } from "@/services/api/cart/cart-api";
import { useGetWishlistQuery } from "@/services/api/wishlist/wishlist-api";
import { useGetCategoriesQuery } from "@/services/api/products/products-api";
import { useGetActiveAnnouncementsQuery } from "@/services/api/announcements/announcements-api";

import {
  AnnouncementBar,
  DesktopActions,
  DesktopNav,
  MobileMenu,
  SearchDialog,
} from "@/components/landing-page/navbar";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const { data: cartRes } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: wishlistRes } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: announcementsRes } = useGetActiveAnnouncementsQuery();

  const cartCount = cartRes?.data?.items?.length ?? 0;
  const wishlistCount = wishlistRes?.data?.items?.length ?? 0;
  const categories = categoriesRes?.data.items ?? [];
  const activeAnnouncements = announcementsRes?.data ?? [];


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
    <header className="sticky top-0 z-50 border-b border-[#e5e0d8] bg-white font-[var(--font-corano)] text-[#222222]">
      <AnnouncementBar announcements={activeAnnouncements} />

      <div className="bg-white">
        <div className="mx-auto flex h-20 max-w-[1170px] items-center justify-between px-4">
          <Link
            href="/"
            className="shrink-0 text-2xl font-black tracking-[0.18em] text-[#222222]"
          >
            Zenvoraa
          </Link>

          <DesktopNav
            pathname={pathname}
            categories={categories}
            isMegaMenuOpen={isMegaMenuOpen}
            setIsMegaMenuOpen={setIsMegaMenuOpen}
          />

          <DesktopActions
            isAuthenticated={isAuthenticated}
            user={user}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            onLogout={handleLogout}
            onSearchClick={() => setIsSearchOpen(true)}
          />

          <div className="flex items-center gap-5 lg:hidden">
            <MobileMenu
              open={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
              pathname={pathname}
              links={navItems}
              cartCount={cartCount}
              isAuthenticated={isAuthenticated}
              user={user}
              handleLogout={handleLogout}
              onSearchClick={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
      </div>

      <SearchDialog
        isOpen={isSearchOpen}
        onOpen={() => setIsSearchOpen(true)}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Navbar;
