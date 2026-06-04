"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, ShoppingBag, Settings, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLogoutMutation } from "@/services/api/auth/auth-api";
import { logout as logoutAction } from "@/store/features/auth/auth.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const navItems = [
  {
    label: "Home",
    href: "/",
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <h1 className="text-lg text-amber-500 font-bold tracking-wide">ZenVora</h1>
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
              0
            </span>
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 outline-none cursor-pointer focus:ring-0 select-none group text-left">
                    <Avatar className="h-9 w-9 border border-stone-200">
                      <AvatarImage src="/avatars/admin.jpg" alt={user.name} />
                      <AvatarFallback className="bg-amber-100 text-amber-800 font-bold uppercase text-xs">
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-xs font-semibold text-stone-800 group-hover:text-amber-600 transition-colors leading-none">{user.name}</span>
                      <span className="text-[10px] text-stone-400 capitalize mt-0.5">{user.role.toLowerCase()}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-52 bg-white border border-stone-200 rounded-none shadow-md mt-2 p-1 z-50">
                  <DropdownMenuLabel className="px-2 py-1.5 text-[9px] text-stone-400 uppercase tracking-widest font-bold">
                    My Profile
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-stone-100 my-1" />
                  
                  <DropdownMenuItem asChild className="cursor-pointer px-2 py-2 rounded-none text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50 focus:text-stone-900 text-xs font-medium flex items-center gap-2.5">
                    <Link href="/account">
                      <UserIcon size={14} className="text-stone-400" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer px-2 py-2 rounded-none text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50 focus:text-stone-900 text-xs font-medium flex items-center gap-2.5">
                    <Link href="/dashboard/settings">
                      <Settings size={14} className="text-stone-400" />
                      System Settings
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="cursor-pointer px-2 py-2 rounded-none text-amber-600 hover:bg-amber-50 hover:text-amber-700 focus:bg-amber-50 focus:text-amber-700 text-xs font-bold flex items-center gap-2.5">
                      <Link href="/dashboard">
                        <LayoutDashboard size={14} className="text-amber-500" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-stone-100 my-1" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer px-2 py-2 rounded-none text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 text-xs font-bold flex items-center gap-2.5"
                  >
                    <LogOut size={14} className="text-rose-500" />
                    Logout Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-none h-9 text-xs font-bold uppercase tracking-wider border-stone-300" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold uppercase tracking-wider text-xs h-9 rounded-none" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* MOBILE MENU */}
          <button className="lg:hidden text-stone-800">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
