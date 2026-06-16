import Link from "next/link";
import { Home } from "lucide-react";

export function ShopBreadcrumb() {
  return (
    <div className="border-b border-[#eee8df] bg-[#f7f2ea] font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-[1170px] px-4 py-7">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-3 text-sm text-[#777777]">
            <li>
              <Link href="/" className="transition-colors hover:text-[#c29958]" aria-label="Home">
                <Home className="h-4 w-4" />
              </Link>
            </li>
            <li className="text-[#b8b1a7]">/</li>
            <li className="font-bold uppercase tracking-wide text-[#222222]">Shop</li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
