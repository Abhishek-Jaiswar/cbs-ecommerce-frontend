"use client";

import * as React from "react";
import { HeroSlider } from "@/components/landing-page/hero-slider";
import { Policies } from "@/components/landing-page/policies";
import { CategoryBanners } from "@/components/landing-page/category-banners";
import { ProductCatalog } from "@/components/landing-page/product-catalog";
import { BrandStory } from "@/components/landing-page/brand-story";
import { MiddleBanner } from "@/components/landing-page/middle-banner";
import { Testimonials } from "@/components/landing-page/testimonials";
import { BottomCollections } from "@/components/landing-page/bottom-collections";
import { InstagramGallery } from "@/components/landing-page/instagram-gallery";
import { LatestBlogs } from "@/components/landing-page/latest-blogs";
import { BrandLogos } from "@/components/landing-page/brand-logos";
import { Newsletter } from "@/components/landing-page/newsletter";
import { CtaBanner } from "@/components/landing-page/cta-banner";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-white font-[var(--font-corano)]">
      {/* 1. Hero Slideshow */}
      <HeroSlider />

      {/* 2. Brand Policies & Benefits */}
      <Policies />

      {/* 3. Top Promotional Category Banners */}
      <CategoryBanners />

      {/* 4. Tabbed Product Catalog (Live & Mock fallback) */}
      <ProductCatalog />

      {/* 5. Brand Heritage & Story (Expanded) */}
      <BrandStory />

      {/* 6. Mid-page Bridal Collection Banner */}
      <MiddleBanner />

      {/* 7. Testimonial Reviews Slider */}
      <Testimonials />

      {/* 8. Grouped Products & Bottom Banner */}
      <BottomCollections />

      {/* 9. Instagram Curated Lifestyle Feed (Expanded) */}
      <InstagramGallery />

      {/* 10. Latest Blogs Section */}
      <LatestBlogs />

      {/* 11. Partner Brand Logos Carousel */}
      <BrandLogos />

      {/* 12. Animated Club Newsletter Subscription (Expanded) */}
      <Newsletter />

      {/* 13. Bottom Shop Call-To-Action Banner */}
      <CtaBanner />
    </main>
  );
}
