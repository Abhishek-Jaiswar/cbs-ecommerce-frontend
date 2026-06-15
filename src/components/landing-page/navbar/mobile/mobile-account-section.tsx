import Link from "next/link";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface Props {
  isAuthenticated: boolean;
  user?: {
    name: string;
    role?: string;
  } | null;
  onLogout: () => void;
}

export function MobileAccountSection({
  isAuthenticated,
  user,
  onLogout,
}: Props) {
  if (isAuthenticated && user) {
    return (
      <div className="border-t border-[#eee8df] bg-[#faf8f4] p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-[#e4dfd7]">
            <AvatarFallback className="bg-[#f6f2ec] text-xs font-bold uppercase text-[#c29958]">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="truncate text-sm font-bold text-[#222222]">
              {user.name}
            </p>
            <p className="text-xs text-[#888]">Welcome back</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="shrink-0 rounded-none text-rose-600 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-[#eee8df] bg-[#faf8f4] p-4">
      <p className="mb-4 text-center text-sm text-[#666]">
        Login to access your account, wishlist and orders.
      </p>

      <div className="flex gap-2">
        <SheetClose asChild>
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full rounded-none">
              Login
            </Button>
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link href="/signup" className="flex-1">
            <Button className="w-full rounded-none bg-[#c29958] hover:bg-[#b58b4d]">
              Register
            </Button>
          </Link>
        </SheetClose>
      </div>
    </div>
  );
}
