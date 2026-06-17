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
import { FAQSection } from "@/components/landing-page/faq";
import { BrandLogos } from "@/components/landing-page/brand-logos";
import { Newsletter } from "@/components/landing-page/newsletter";
import { CtaBanner } from "@/components/landing-page/cta-banner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-white font-[var(--font-zenvoraa)]">
      {/* 1. Hero Slideshow */}
      <HeroSlider />

      {/* 2. Brand Policies & Benefits */}
      <ScrollReveal animation="slide-up">
        <Policies />
      </ScrollReveal>

      {/* 3. Top Promotional Category Banners */}
      <ScrollReveal animation="slide-up">
        <CategoryBanners />
      </ScrollReveal>

      {/* 4. Tabbed Product Catalog (Live & Mock fallback) */}
      <ScrollReveal animation="slide-up">
        <ProductCatalog />
      </ScrollReveal>

      {/* 5. Brand Heritage & Story (Expanded) */}
      <ScrollReveal animation="slide-up">
        <BrandStory />
      </ScrollReveal>

      {/* 6. Mid-page Bridal Collection Banner */}
      <ScrollReveal animation="slide-up">
        <MiddleBanner />
      </ScrollReveal>

      {/* 7. Testimonial Reviews Slider */}
      <ScrollReveal animation="slide-up">
        <Testimonials />
      </ScrollReveal>

      {/* 8. Grouped Products & Bottom Banner */}
      <ScrollReveal animation="slide-up">
        <BottomCollections />
      </ScrollReveal>

      {/* 9. Instagram Curated Lifestyle Feed (Expanded) */}
      <ScrollReveal animation="slide-up">
        <InstagramGallery />
      </ScrollReveal>

      {/* 10. Latest Blogs Section */}
      <ScrollReveal animation="slide-up">
        <LatestBlogs />
      </ScrollReveal>

      {/* 11. Frequently Asked Questions Section */}
      <ScrollReveal animation="slide-up">
        <FAQSection />
      </ScrollReveal>

      {/* 12. Partner Brand Logos Carousel */}
      <ScrollReveal animation="slide-up">
        <BrandLogos />
      </ScrollReveal>

      {/* 13. Animated Club Newsletter Subscription (Expanded) */}
      <ScrollReveal animation="slide-up">
        <Newsletter />
      </ScrollReveal>

      {/* 14. Bottom Shop Call-To-Action Banner */}
      <ScrollReveal animation="slide-up">
        <CtaBanner />
      </ScrollReveal>
    </main>
  );
}
