"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllLandingPagesQuery } from "@/services/api/landing-pages/landing-page.api";

// Fallback default slides
const defaultSlides = [
  {
    align: "left",
    description:
      "Carefully curated premium imitation jewelry designed to complement every occasion, letting you shine with confidence.",
    image: "/corano/slider/slider-1.png",
    title: "Affordable Luxury",
    titleAccent: "Timeless Elegance",
    ctaText: "Shop Collection",
    ctaLink: "/shop",
  },
  {
    align: "right",
    description:
      "From everyday simplicity to festive celebration pieces, discover artificial jewelry that reflects the latest fashion trends.",
    image: "/corano/slider/slider-2.png",
    title: "Curated Fashion",
    titleAccent: "Everyday Glamour",
    ctaText: "Explore Trends",
    ctaLink: "/shop",
  },
  {
    align: "left",
    description:
      "Handpicked premium artificial accessories crafted with exceptional durability, meticulous detail, and lasting finish.",
    image: "/corano/slider/slider-3.png",
    title: "Exquisite Finish",
    titleAccent: "Master Artistry",
    ctaText: "Discover Now",
    ctaLink: "/shop",
  },
];

export function HeroSlider() {
  const { data, isLoading } = useGetAllLandingPagesQuery();

  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  // Parse database slides or fallback to default
  const dbSlides = data?.data?.items?.filter((item) => item.isPublished) || [];
  
  const heroSlides = React.useMemo(() => {
    if (dbSlides.length === 0) {
      return defaultSlides;
    }

    return dbSlides.map((item) => {
      // Safely parse sections JSON for custom configurations
      const sections = typeof item.sections === "object" && item.sections ? (item.sections as any) : {};
      
      return {
        align: sections.align || "left",
        description: item.description || "",
        image: item.imageUrl,
        title: item.title,
        titleAccent: sections.titleAccent || "",
        ctaText: sections.ctaText || "Shop Collection",
        ctaLink: sections.ctaLink || `/shop`,
      };
    });
  }, [dbSlides]);

  const startTimer = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!isHovered && heroSlides.length > 0) {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
      }
    }, 5000);
  }, [isHovered, heroSlides.length]);

  React.useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [startTimer, activeSlide]);

  const handlePrev = React.useCallback(() => {
    if (heroSlides.length === 0) return;
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length,
    );
  }, [heroSlides.length]);

  const handleNext = React.useCallback(() => {
    if (heroSlides.length === 0) return;
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const handleDotClick = React.useCallback((index: number) => {
    setActiveSlide(index);
  }, []);



  if (heroSlides.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden w-full font-[var(--font-zenvoraa)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative min-h-[520px] md:min-h-[650px] w-full bg-gray-100">
        {heroSlides.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${
              activeSlide === index
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={item.image}
                alt={`${item.title} ${item.titleAccent}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Soft overlay optimized for text alignment */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                item.align === "right"
                  ? "from-black/10 via-white/30 to-white/95"
                  : "from-white/95 via-white/30 to-black/10"
              } pointer-events-none`}
            />

            {/* Slider Content */}
            <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-4 sm:px-6 md:min-h-[650px] lg:px-8">
              <div
                className={`max-w-xl transition-all duration-[1000ms] delay-200 transform ${
                  item.align === "right"
                    ? "ml-auto text-left md:text-right"
                    : "text-left"
                } ${
                  activeSlide === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <h1 className="text-4xl font-serif font-medium leading-tight text-[#222222] sm:text-5xl md:text-6xl tracking-wide">
                  {item.title}
                  {item.titleAccent && (
                    <span className="block text-[#c29958] font-serif italic font-light mt-2">
                      {item.titleAccent}
                    </span>
                  )}
                </h1>
                {item.description && (
                  <p className="mt-5 text-sm md:text-base font-normal text-[#555555] leading-relaxed font-sans">
                    {item.description}
                  </p>
                )}
                <Button
                  asChild
                  className="mt-8 h-12 rounded-none bg-[#222222] px-8 text-xs font-bold uppercase tracking-[0.25em] text-white hover:bg-[#c29958] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Link href={item.ctaLink}>{item.ctaText}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {heroSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-[#eee8df] bg-white/90 text-[#222222] shadow-sm transition-all duration-300 hover:bg-[#c29958] hover:border-[#c29958] hover:text-white rounded-full active:scale-90 md:flex"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-[#eee8df] bg-white/90 text-[#222222] shadow-sm transition-all duration-300 hover:bg-[#c29958] hover:border-[#c29958] hover:text-white rounded-full active:scale-90 md:flex"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center gap-2">
            {heroSlides.map((item, index) => (
              <button
                key={`${item.image}-${index}`}
                type="button"
                onClick={() => handleDotClick(index)}
                className={`h-2 transition-all duration-500 rounded-full border border-[#c29958] ${
                  activeSlide === index
                    ? "w-8 bg-[#c29958]"
                    : "w-2 bg-white/80 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
