"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    align: "left",
    description: "Designer Jewelry Necklaces-Bracelets-Earings",
    image: "/corano/slider/home1-slide2.jpg",
    title: "Family Jewelry",
    titleAccent: "Collection",
  },
  {
    align: "right",
    description: "Shukra Yogam & Silver Power Silver Saving Schemes.",
    image: "/corano/slider/home1-slide3.jpg",
    title: "Diamonds Jewelry",
    titleAccent: "Collection",
  },
  {
    align: "left",
    description: "Rings, Occasion Pieces, Pandora & More.",
    image: "/corano/slider/home1-slide1.jpg",
    title: "Grace Designer",
    titleAccent: "Jewelry",
  },
];

export function HeroSlider() {
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  if (!slide) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[520px] md:min-h-[650px]">
        {heroSlides.map((item, index) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt={`${item.title} ${item.titleAccent}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>
        ))}
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 sm:px-6 md:min-h-[650px] lg:px-8">
          <div
            className={`max-w-xl ${
              slide.align === "right" ? "ml-auto text-left md:text-right" : ""
            }`}
          >
            <h1 className="text-4xl font-bold leading-tight text-[#222222] sm:text-5xl md:text-6xl">
              {slide.title}
              <span className="block text-[#c29958]">{slide.titleAccent}</span>
            </h1>
            <p className="mt-5 text-base font-bold text-[#555555] md:text-lg">
              {slide.description}
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-none bg-[#222222] px-8 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c29958]"
            >
              <Link href="/shop">Read More</Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)
          }
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#ddd6ca] bg-white/80 text-[#222222] transition-colors hover:bg-[#c29958] hover:text-white md:flex"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#ddd6ca] bg-white/80 text-[#222222] transition-colors hover:bg-[#c29958] hover:text-white md:flex"
          aria-label="Next slide"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center gap-3">
          {heroSlides.map((item, index) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-3 w-3 rounded-full border border-[#c29958] ${
                activeSlide === index ? "bg-[#c29958]" : "bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
