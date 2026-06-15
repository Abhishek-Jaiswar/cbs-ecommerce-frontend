import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Props {
  pathname: string;
  links: {
    label: string;
    href: string;
  }[];
}

export function MobileNavLinks({ pathname, links }: Props) {
  return (
    <nav className="flex-1 overflow-y-auto border-t border-[#eee8df]">
      {links.map((item) => (
        <SheetClose asChild key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "block border-b border-[#eee8df] px-5 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:text-[#c29958]",
              pathname === item.href && "text-[#c29958]",
            )}
          >
            {item.label}
          </Link>
        </SheetClose>
      ))}
    </nav>
  );
}
