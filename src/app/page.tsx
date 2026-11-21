import { HomeHero } from "@/components/home/home-hero";
import { HomeCollections } from "@/components/home/home-collections";
import { HomeBestsellers } from "@/components/home/home-bestsellers";
import { HomePromise } from "@/components/home/home-promise";
import { HomeTestimonials } from "@/components/home/home-testimonials";

/** Home, per the ZenVoraa Figma redesign (node 3:2 desktop, 157:1312 mobile). */
export default function LandingPage() {
  return (
    <main className="flex-1 bg-white font-zv-body">
      <HomeHero />
      <HomeCollections />
      <HomeBestsellers />
      <HomePromise />
      <HomeTestimonials />
    </main>
  );
}
