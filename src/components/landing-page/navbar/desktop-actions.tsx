import Link from "next/link";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CountBadge from "./count-badge";
import ProductSearchBox from "./product-search-box";

interface DesktopActionsProps {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  cartCount: number;
  wishlistCount: number;
  onLogout: () => void;
}

export default function DesktopActions({
  isAuthenticated,
  user,
  cartCount,
  wishlistCount,
  onLogout,
}: DesktopActionsProps) {
  return (
    <div className="hidden items-center gap-6 lg:flex">
      <ProductSearchBox className="w-72" />

      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="text-[#222222] transition-colors hover:text-[#c29958]"
              aria-label="Account menu"
            >
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
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-none border-t-2 border-[#c29958] bg-white p-2 font-[var(--font-corano)] shadow-md"
          >
            {isAuthenticated && user ? (
              <>
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-[#222222]">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-none text-xs"
                >
                  <Link href="/account">
                    <UserIcon className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-none text-xs"
                >
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-none text-xs text-[#c29958]"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer rounded-none text-xs text-rose-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-none text-xs"
                >
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-none text-xs"
                >
                  <Link href="/signup">Register</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/wishlist"
          className="relative text-[#222222] transition-colors hover:text-[#c29958]"
          aria-label="Wishlist"
        >
          <Heart className="h-6 w-6" />
          <CountBadge count={wishlistCount} />
        </Link>

        <Link
          href="/cart"
          className="relative text-[#222222] transition-colors hover:text-[#c29958]"
          aria-label="Cart"
        >
          <ShoppingBag className="h-6 w-6" />
          <CountBadge count={cartCount} />
        </Link>
      </div>
    </div>
  );
}
