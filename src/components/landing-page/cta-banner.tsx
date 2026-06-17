"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className=" mt-10 bg-white font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden w-full border border-[#eee8df] shadow-sm">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/corano/banner/cta-banner.png"
              alt="ZenVoraa luxury jewelry background"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
            {/* Immersive Overlay */}
            <div className="absolute inset-0 bg-[#222222]/40 backdrop-blur-[1px] pointer-events-none" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#ac803a] block mb-3">
              THE COLLECTION
            </span>
            <h2 className="text-2xl font-serif font-medium text-white sm:text-3xl md:text-4xl leading-tight tracking-wide max-w-3xl mx-auto mb-4">
              Ready to find your next signature piece?
            </h2>
            <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto mb-6 leading-relaxed font-sans">
              Explore the full ZenVoraa catalog. Filter by category, price, and materials to discover handcrafted luxury made just for you.
            </p>
            
            <Button
              asChild
              className="group h-12 rounded-none bg-[#c29958] px-8 text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-white hover:text-[#222222] transition-all duration-300 shadow-xl active:scale-95"
            >
              <Link href="/shop" className="inline-flex items-center">
                Shop Collection 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
