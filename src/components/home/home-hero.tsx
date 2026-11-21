import Link from "next/link";
import { preconnect } from "react-dom";
import { cn } from "@/lib/utils";
import { ZvLogo } from "@/components/layout/zv-logo";
import { HeroVideo } from "./hero-video";

const POSTER = "/zenvoraa/home/hero.webp";

const heroNav = [
  { label: "ZenVoraa", href: "/", filled: true },
  { label: "Our Collection", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * Figma Home > Hero: full-viewport film (Cloudinary) over its poster frame.
 * The poster is served locally so it paints immediately and remains the
 * fallback whenever the video can't or shouldn't play.
 */
export function HomeHero() {
  preconnect("https://res.cloudinary.com");

  return (
    // svh = the viewport height with mobile browser bars shown, so nothing is cut off.
    <section className="relative h-svh min-h-[480px] w-full overflow-hidden bg-zv-ink-brown lg:min-h-[640px]">
      <img
        src={POSTER}
        alt="A woman holding a delicate pearl and gold chain"
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
      />
      <HeroVideo poster={POSTER} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" aria-hidden />

      {/* Desktop: stacked leaf nav buttons */}
      <nav
        aria-label="Highlights"
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 flex-col gap-zv-20 px-zv-20 lg:flex"
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
      <div className="absolute bottom-5 left-zv-20 flex w-[312px] flex-col gap-3 lg:bottom-6 lg:w-[655px] lg:gap-0">
        <ZvLogo variant="wordmark" className="h-9 w-[106px] lg:h-12 lg:w-[141px]" alt="ZenVoraa" />
        <h1 className="font-zv-display text-[28px] italic leading-[1.05] text-white lg:type-display lg:text-white">
          Elegant. Timeless. Affordable
        </h1>
      </div>
    </section>
  );
}
