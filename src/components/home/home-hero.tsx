import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZvLogo } from "@/components/layout/zv-logo";

const heroNav = [
  { label: "ZenVoraa", href: "/", filled: true },
  { label: "Our Collection", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * Figma Home > Hero. The design uses a film here; this is its poster frame.
 * Swap the <img> for a <video poster=...> once the video file is available.
 */
export function HomeHero() {
  return (
    <section className="relative h-[327px] w-full overflow-hidden bg-zv-ink-brown lg:h-auto lg:aspect-[1728/1117]">
      <img
        src="/zenvoraa/home/hero.webp"
        alt="A woman holding a delicate pearl and gold chain"
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" aria-hidden />

      {/* Desktop: stacked leaf nav buttons */}
      <nav
        aria-label="Highlights"
        className="absolute left-0 top-[39.5%] hidden flex-col gap-zv-20 px-zv-20 lg:flex"
      >
        {heroNav.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "type-button w-[150px] whitespace-nowrap border border-zv-primary px-zv-10 py-zv-10 text-center transition-colors",
              i % 2 === 0 ? "rounded-leaf" : "rounded-leaf-mirror",
              item.filled
                ? "bg-zv-primary text-white hover:bg-zv-hover"
                : "bg-white text-zv-primary hover:bg-zv-primary hover:text-white",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Brand promise */}
      <div className="absolute bottom-5 left-zv-20 flex w-[312px] flex-col gap-3 lg:bottom-[2.5%] lg:w-[655px] lg:gap-0">
        <ZvLogo variant="wordmark" className="h-9 w-[106px] lg:h-12 lg:w-[141px]" alt="ZenVoraa" />
        <h1 className="font-zv-display text-[28px] italic leading-[1.05] text-white lg:type-display lg:text-white">
          Elegant. Timeless. Affordable
        </h1>
      </div>
    </section>
  );
}
