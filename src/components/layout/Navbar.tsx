"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";
import { useGetCartQuery } from "@/services/api/cart/cart-api";
import { useGetWishlistQuery } from "@/services/api/wishlist/wishlist-api";
import {
  useGetCategoriesQuery,
  useGetProductListingQuery,
} from "@/services/api/products/products-api";
import type { ICategories } from "@/services/api/products/products-api.types";
import { cn, getProductImage } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const pageLinks = [
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
];

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

function CountBadge({ count }: { count: number }) {
  if (count < 1) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c29958] px-1 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

function formatPrice(price: string) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return price;

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(numeric);
}

function ProductSearchBox({
  className,
  onNavigate,
  placeholder = "Search entire store here",
}: {
  className?: string;
  onNavigate?: () => void;
  placeholder?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetProductListingQuery({ page: 1, limit: 100 });

  const query = search.trim().toLowerCase();
  const products = useMemo(() => {
    if (query.length === 0) return [];

    return (data?.data.items ?? [])
      .filter((product) => {
        const haystack = `${product.name} ${product.excerpt} ${product.slug}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 6);
  }, [data?.data.items, query]);

  const showPanel = isOpen && search.trim().length > 0;

  const closeSearch = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (products[0]) {
          router.push(`/shop/${products[0].slug}`);
          closeSearch();
          return;
        }

        router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
        closeSearch();
      }}
      onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
      onFocus={() => setIsOpen(true)}
      className={cn(
        "group relative flex h-11 items-center border border-[#e4dfd7] bg-white px-4 transition-colors focus-within:border-[#c29958]",
        className
      )}
    >
      <input
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#555555] outline-none placeholder:text-[#999999]"
      />
      <button
        type="submit"
        className="text-[#c29958] transition-colors hover:text-[#222222]"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </button>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[430px] overflow-y-auto border border-[#eee8df] border-t-2 border-t-[#c29958] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
          <div className="border-b border-[#eee8df] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#777777]">
            {isLoading ? "Searching products..." : `${products.length} result${products.length === 1 ? "" : "s"}`}
          </div>

          {!isLoading && products.length === 0 && (
            <div className="px-4 py-6 text-sm text-[#777777]">
              No products found for <span className="font-bold">{search.trim()}</span>.
            </div>
          )}

          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              onClick={closeSearch}
              className="grid grid-cols-[64px_1fr] gap-3 border-b border-[#f0ebe2] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#f9f5f0]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7f2ea]">
                <Image
                  src={getProductImage(product.slug)}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-[#222222]">
                  {product.name}
                </h4>
                <p className="mt-1 line-clamp-1 text-xs text-[#777777]">
                  {product.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-[#c29958]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#999999] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}

function MegaMenuColumn({
  links,
  title,
}: {
  links: { href: string; label: string }[];
  title: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold capitalize text-[#222222]">{title}</h3>
      <div className="mt-3 h-0.5 w-12 bg-[#c29958]" />
      <ul className="mt-6 space-y-4 text-sm font-normal normal-case tracking-normal text-[#333333]">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="transition-colors hover:text-[#c29958]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShopMegaMenu({ categories }: { categories: ICategories[] }) {
  const activeCategories = categories.filter((category) => category.isActive);
  const rootCategories = activeCategories.filter((category) => !category.parentId);
  const subCategories = activeCategories.filter((category) => category.parentId);

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
    <div className="invisible fixed left-1/2 top-[125px] z-40 w-[min(1380px,calc(100vw-48px))] -translate-x-1/2 translate-y-3 border border-[#eee8df] bg-white px-9 py-9 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="grid grid-cols-4 gap-12">
        <MegaMenuColumn links={categoryLinks} title="Categories" />
        <MegaMenuColumn links={subCategoryLinks} title="Sub Categories" />
        <MegaMenuColumn links={shopFeatureLinks} title="Shop" />
        <MegaMenuColumn
          title="More"
          links={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Wishlist", href: "/wishlist" },
            { label: "My Account", href: "/account" },
          ]}
        />
      </div>

      <div className="mt-9 grid grid-cols-2 gap-6">
        <Link
          href="/shop?category=wedding-rings"
          className="group/banner relative block h-[190px] overflow-hidden bg-[#f7f2ea]"
        >
          <Image
            src="/corano/banner/img1-static-menu.jpg"
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
          className="group/banner relative block h-[190px] overflow-hidden bg-[#f7f2ea]"
        >
          <Image
            src="/corano/banner/img2-static-menu.jpg"
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

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const { data: cartRes } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: wishlistRes } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: categoriesRes } = useGetCategoriesQuery();

  const cartCount = cartRes?.data?.items?.length ?? 0;
  const wishlistCount = wishlistRes?.data?.items?.length ?? 0;
  const categories = categoriesRes?.data.items ?? [];

  const allMobileLinks = useMemo(
    () => [...navItems, ...pageLinks],
    []
  );

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
      <div className="hidden border-b border-[#efebe4] bg-white text-xs text-[#555555] lg:block">
        <div className="mx-auto flex h-11 max-w-[1170px] items-center justify-between px-4">
          <p>Welcome to Zenvoraa Jewelry online store</p>
          <div className="flex items-center gap-7">
            <button className="inline-flex items-center gap-1 transition-colors hover:text-[#c29958]">
              $ Currency <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex items-center gap-1 transition-colors hover:text-[#c29958]">
              English <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex h-20 max-w-[1170px] items-center justify-between px-4">
          <Link href="/" className="shrink-0 text-2xl font-black tracking-[0.18em] text-[#222222]">
            Zenvoraa
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-bold uppercase tracking-wide lg:flex">
            {navItems.map((item) => (
              item.href === "/shop" ? (
                <div key={item.href} className="group py-8">
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 transition-colors hover:text-[#c29958]",
                      pathname === item.href && "text-[#c29958]"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  <ShopMegaMenu categories={categories} />
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[#c29958]",
                    pathname === item.href && "text-[#c29958]"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}

            <div className="group relative py-8">
              <button className="inline-flex items-center gap-1 transition-colors group-hover:text-[#c29958]">
                Pages <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="invisible absolute left-0 top-full w-56 translate-y-3 border-t-2 border-[#c29958] bg-white p-4 text-xs normal-case tracking-normal text-[#555555] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {pageLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 transition-colors hover:pl-1 hover:text-[#c29958]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <ProductSearchBox className="w-72" />

            <div className="flex items-center gap-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-[#222222] transition-colors hover:text-[#c29958]" aria-label="Account menu">
                    {isAuthenticated && user ? (
                      <Avatar className="h-8 w-8 border border-[#e4dfd7]">
                        <AvatarFallback className="bg-[#f6f2ec] text-xs font-bold uppercase text-[#c29958]">
                          {user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-none border-t-2 border-[#c29958] bg-white p-2 font-[var(--font-corano)] shadow-md">
                  {isAuthenticated && user ? (
                    <>
                      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-[#222222]">
                        {user.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer rounded-none text-xs">
                        <Link href="/account">
                          <UserIcon className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-none text-xs">
                        <Link href="/dashboard/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "ADMIN" && (
                        <DropdownMenuItem asChild className="cursor-pointer rounded-none text-xs text-[#c29958]">
                          <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-none text-xs text-rose-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-none text-xs">
                        <Link href="/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-none text-xs">
                        <Link href="/signup">Register</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/wishlist" className="relative text-[#222222] transition-colors hover:text-[#c29958]" aria-label="Wishlist">
                <Heart className="h-6 w-6" />
                <CountBadge count={wishlistCount} />
              </Link>

              <Link href="/cart" className="relative text-[#222222] transition-colors hover:text-[#c29958]" aria-label="Cart">
                <ShoppingBag className="h-6 w-6" />
                <CountBadge count={cartCount} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5 lg:hidden">
            <Link href="/cart" className="relative text-[#222222]" aria-label="Cart">
              <ShoppingBag className="h-6 w-6" />
              <CountBadge count={cartCount} />
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center border border-[#e4dfd7]" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[86vw] max-w-sm gap-0 rounded-none bg-white p-0 font-[var(--font-corano)]" showCloseButton={false}>
                <SheetHeader className="flex-row items-center justify-between border-b border-[#eee8df] p-5">
                  <SheetTitle className="text-xl font-black tracking-[0.18em] text-[#222222]">Zenvoraa</SheetTitle>
                  <SheetClose asChild>
                    <button className="flex h-9 w-9 items-center justify-center border border-[#e4dfd7]" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </button>
                  </SheetClose>
                </SheetHeader>

                <ProductSearchBox
                  className="m-5"
                  placeholder="Search products"
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />

                <nav className="border-t border-[#eee8df]">
                  {allMobileLinks.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block border-b border-[#eee8df] px-5 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:text-[#c29958]",
                          pathname === item.href && "text-[#c29958]"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {isAuthenticated && user?.role === "ADMIN" && (
                    <SheetClose asChild>
                      <Link href="/dashboard" className="block border-b border-[#eee8df] px-5 py-4 text-sm font-bold uppercase tracking-wide text-[#c29958]">
                        Admin Dashboard
                      </Link>
                    </SheetClose>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
