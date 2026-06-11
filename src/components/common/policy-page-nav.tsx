import Link from "next/link";
import { FileText, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const policyLinks = [
  {
    label: "Shipping",
    href: "/shipping-policy",
    key: "shipping",
    icon: Truck,
  },
  {
    label: "Privacy",
    href: "/privacy-policy",
    key: "privacy",
    icon: ShieldCheck,
  },
  {
    label: "Returns",
    href: "/refund-policy",
    key: "refund",
    icon: RotateCcw,
  },
  {
    label: "Terms",
    href: "/terms-conditions",
    key: "terms",
    icon: FileText,
  },
];

export function PolicyPageNav({
  active,
}: {
  active: "shipping" | "privacy" | "refund" | "terms";
}) {
  return (
    <nav className="border-b border-[#eee8df] bg-white">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {policyLinks.map(({ label, href, key, icon: Icon }) => {
          const isActive = active === key;

          return (
            <Link
              key={key}
              href={href}
              className={[
                "inline-flex h-11 shrink-0 items-center gap-2 border px-4 text-sm font-bold transition",
                isActive
                  ? "border-[#c8a96e] bg-[#111111] text-white"
                  : "border-[#eee8df] bg-[#fbfaf7] text-stone-600 hover:border-[#c8a96e] hover:text-[#222222]",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={isActive ? "h-4 w-4 text-[#c8a96e]" : "h-4 w-4"}
                aria-hidden="true"
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
