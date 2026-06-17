import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Gem, ShieldCheck } from "lucide-react";

export function BrandStory() {
  return (
    <section className="py-20 font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] sm:text-4xl tracking-wide">
            our story
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Side: Elegant & Minimal Single Image */}
          <div className="relative group overflow-hidden border border-[#eee8df] bg-[#fdfcfb] p-3 shadow-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/corano/banner/brand-story.png"
                alt="ZenVoraa premium curated jewelry collection"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            {/* Elegant text tag in corner */}
            <div className="absolute bottom-6 right-6 bg-[#222222]/90 backdrop-blur-[2px] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
              Est. 2026
            </div>
          </div>

          {/* Right Side: Copywriting content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c29958] block">
                The Zenvoraa Promise
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#222222] leading-tight tracking-wide">
                Where Timeless Elegance Meets Affordable Luxury
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-[#555555]">
              At ZenVoraa, we believe every woman deserves to shine with
              confidence, elegance, and style—without compromising on
              affordability. From everyday wear to festive glamour, our
              carefully curated premium artificial jewelry reflects the latest
              fashion trends while ensuring exceptional craftsmanship and
              lasting durability.
            </p>

            {/* Core Values Rows */}
            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-[#eee8df]">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <Gem className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">
                  Affordable Luxury
                </h4>
                <p className="text-[11px] text-[#777777] leading-normal">
                  Elegance and style within reach, without the designer price
                  tag.
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <ShieldCheck className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">
                  Premium Quality
                </h4>
                <p className="text-[11px] text-[#777777] leading-normal">
                  Exquisite finish and durability from trusted manufacturers.
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <Sparkles className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">
                  Curated Trends
                </h4>
                <p className="text-[11px] text-[#777777] leading-normal">
                  Handpicked designs curated to elevate your everyday look.
                </p>
              </div>
            </div>

            {/* Premium CTA Button */}
            <div className="pt-2 flex justify-center sm:justify-start">
              <Link
                href="/shop"
                className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#222222] border-b border-[#222222] pb-1 hover:border-[#c29958] hover:text-[#c29958] transition-all duration-300"
              >
                Explore Our Collections
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
