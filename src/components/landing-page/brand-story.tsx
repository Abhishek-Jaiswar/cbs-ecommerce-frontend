import * as React from "react";
import Image from "next/image";
import { Sparkles, HeartHandshake, ShieldAlert } from "lucide-react";

export function BrandStory() {
  return (
    <section className="py-20 bg-stone-50 border-t border-b border-[#eee8df]/60 font-[var(--font-corano)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          {/* Left Side: Elegant Image Grid with subtle border */}
          <div className="relative group overflow-hidden border border-[#eee8df] bg-[#fdfcfb] p-3 shadow-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                alt="Jewelry artisan handcrafting gold ring"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            {/* Elegant text tag in corner */}
            <div className="absolute bottom-6 right-6 bg-[#222222]/90 backdrop-blur-[2px] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
              Est. 1994
            </div>
          </div>

          {/* Right Side: Copywriting content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c29958] block">
                The Zenvoraa Legacy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222] leading-tight">
                Our Legacy of Handcrafted Artistry
              </h2>
            </div>
            
            <p className="text-sm leading-relaxed text-stone-500">
              Each piece of Zenvoraa jewelry is more than an accessory; it is a canvas of heritage, passion, and precise artisanal craft. Handcrafted by master artisans with decades of experience, we select and set every diamond by hand to guarantee unmatched brilliance and fire.
            </p>

            <p className="text-sm leading-relaxed text-stone-500">
              We operate under the strict belief that beauty should not compromise responsibility. That is why 100% of our metals are recycled and our diamonds are certified conflict-free, ensuring your family heirlooms shine responsibly for generations.
            </p>

            {/* Core Values Rows */}
            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-[#eee8df]">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <Sparkles className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">Master Artistry</h4>
                <p className="text-[11px] text-stone-400 leading-normal">Individually tailored by hand in our family ateliers.</p>
              </div>
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <HeartHandshake className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">Ethically Sourced</h4>
                <p className="text-[11px] text-stone-400 leading-normal">Conflict-free certified diamonds and ethical metals.</p>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                <ShieldAlert className="h-6 w-6 text-[#c29958]" />
                <h4 className="text-xs font-bold uppercase text-[#222222]">Lifetime Care</h4>
                <p className="text-[11px] text-stone-400 leading-normal">Lifetime polishing, resizing, and warranty coverage.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
