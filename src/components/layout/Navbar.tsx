"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Pages",
    href: "/pages",
  },

  {
    label: "Shop",
    href: "/shop",
  },

  {
    label: "Blog",
    href: "/blog",
  },

  {
    label: "Contact Us",
    href: "/contact",
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={50}
            priority
            className="object-contain"
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-[16px] font-medium text-gray-800 transition-all duration-300 hover:-translate-y-1 hover:text-amber-500"
            >
              {item.label}

              {/* ANIMATED UNDERLINE */}
              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          
          {/* SEARCH */}
          <div className="hidden items-center rounded-full bg-gray-100 px-5 py-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-400 lg:flex">
            <Search size={20} className="text-gray-500" />

            <input
              type="text"
              placeholder="search here..."
              className="ml-3 w-[220px] bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* USER */}
          <button className="transition-all duration-300 hover:-translate-y-1 hover:text-amber-500">
            <User size={24} strokeWidth={1.8} />
          </button>

          {/* WISHLIST */}
          <button className="relative transition-all duration-300 hover:-translate-y-1 hover:text-amber-500">
            <Heart size={24} strokeWidth={1.8} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
              0
            </span>
          </button>

          {/* CART */}
          <button className="relative transition-all duration-300 hover:-translate-y-1 hover:text-amber-500">
            <ShoppingBag size={24} strokeWidth={1.8} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
              2
            </span>
          </button>

          {/* MOBILE MENU */}
          <button className="lg:hidden">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;