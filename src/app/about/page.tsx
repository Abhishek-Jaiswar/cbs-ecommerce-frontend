import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  BadgeCheck,
  Gem,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "About Us | ZenVora Premium Handcrafted Jewelry",
  description:
    "Learn about ZenVora's journey, our commitment to affordable luxury, and our passion for designing premium handcrafted artificial jewelry for every occasion.",
  openGraph: {
    title: "About Us | ZenVora Premium Handcrafted Jewelry",
    description:
      "Learn about ZenVora's journey, our commitment to affordable luxury, and our passion for designing premium handcrafted artificial jewelry for every occasion.",
    type: "website",
  },
};

const values = [
  {
    title: "Trend-led Designs",
    description:
      "Fresh, wearable pieces inspired by festive, bridal, and everyday styling.",
    icon: Sparkles,
  },
  {
    title: "Premium Finish",
    description:
      "Polished artificial jewellery selected for shine, detail, and comfort.",
    icon: Gem,
  },
  {
    title: "Affordable Luxury",
    description: "Statement style without the heavy price tag, so every look feels special.",
    icon: BadgeCheck,
  },
  {
    title: "Curated Collections",
    description: "Rings, earrings, necklaces, and sets chosen to simplify your styling.",
    icon: PackageCheck,
  },
  {
    title: "Secure Shopping",
    description: "A smooth buying experience with clear product details and reliable checkout.",
    icon: ShieldCheck,
  },
  {
    title: "Customer First",
    description: "Helpful support before and after your order, from selection to delivery.",
    icon: HeartHandshake,
  },
];

const milestones = [
  "Curated by style",
  "Checked for finish",
  "Packed with care",
  "Ready to celebrate",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-zenvoraa)] text-[#222222]">
      <section className="relative bg-[#111111] text-white">
        <div className="absolute inset-0">
          <Image
            src="/corano/slider/home4-slider5.jpg"
            alt="Elegant jewellery collection"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />
        </div>

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              About ZenVoraa
            </span>
            <h1 className="mt-5 text-4xl font-serif font-medium leading-tight sm:text-5xl lg:text-6xl tracking-wide">
              Jewellery made for moments that deserve a little more shine.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
              We bring together premium artificial jewellery, modern styling,
              and approachable prices so every woman can express her personal
              style with confidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#c8a96e] px-7 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b5943d]"
              >
                Shop Collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/25 px-7 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-[#c8a96e] hover:text-[#c8a96e]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-md border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/corano/product/product-details-img1.jpg"
                  alt="Detailed jewellery close up"
                  fill
                  sizes="420px"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 border-t border-white/15 bg-[#111111]/90 text-center">
                <div className="px-3 py-4">
                  <p className="text-xl font-bold text-[#c8a96e]">100+</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/60">
                    Styles
                  </p>
                </div>
                <div className="border-x border-white/15 px-3 py-4">
                  <p className="text-xl font-bold text-[#c8a96e]">24/7</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/60">
                    Browse
                  </p>
                </div>
                <div className="px-3 py-4">
                  <p className="text-xl font-bold text-[#c8a96e]">India</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/60">
                    Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal animation="slide-up">
        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border border-[#eee8df] bg-white p-3 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/corano/banner/img5-middle.jpg"
                    alt="Jewellery styled for special occasions"
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#eee8df] bg-white p-2 shadow-sm">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/corano/product/product-3.jpg"
                      alt="Elegant ring"
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="border border-[#eee8df] bg-white p-2 shadow-sm">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="/corano/product/product-10.jpg"
                      alt="Statement jewellery piece"
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
                Our Story
              </span>
              <h2 className="mt-4 max-w-2xl text-3xl font-serif font-medium leading-tight sm:text-4xl lg:text-5xl tracking-wide">
                Designed to make everyday dressing feel personal.
              </h2>
              <div className="mt-7 space-y-5 text-sm leading-8 text-stone-600 sm:text-base">
                <p>
                  At <span className="font-semibold text-[#222222]">ZenVoraa</span>,
                  we believe jewellery should feel expressive, polished, and easy
                  to wear. Our collections are curated for women who want style
                  that moves naturally from daily plans to celebrations.
                </p>
                <p>
                  We work with trusted manufacturers and suppliers to source
                  artificial jewellery that balances fashion, finish, durability,
                  and value. Each collection is chosen with real occasions in mind:
                  workdays, weddings, gifting, festive looks, and everything in
                  between.
                </p>
                <p>
                  Whether you are choosing statement necklaces, elegant earrings,
                  trendy rings, bridal sets, or everyday accessories, ZenVoraa is
                  built to help you complete the look with confidence.
                </p>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-4">
                {milestones.map((item, index) => (
                  <div key={item} className="border-l border-[#e7dccb] pl-4">
                    <p className="text-sm font-bold text-[#c29958]">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#222222]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal animation="slide-up">
        <section className="border-y border-[#eee8df] bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
                Why Choose Us
              </span>
              <h2 className="mt-4 text-3xl font-serif font-medium sm:text-4xl tracking-wide">
                The ZenVoraa experience
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-500">
                A thoughtful blend of trend, quality, affordability, and service
                so your jewellery feels beautiful from cart to occasion.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="border border-[#eee8df] bg-[#fbfaf7] p-7 transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
                >
                  <Icon className="h-7 w-7 text-[#c29958]" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold text-[#222222]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal animation="slide-up">
        <section className="bg-[#f6f1ea] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9f7b3d]">
                Our Mission
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                To make beautiful jewellery accessible to every woman.
              </h2>
              <p className="mt-6 text-base leading-8 text-stone-600">
                We want every customer to find jewellery that feels true to her:
                expressive, comfortable, affordable, and ready for the moments
                she wants to remember.
              </p>
            </div>

            <div className="border border-[#ded0bd] bg-[#111111] p-8 text-white shadow-lg">
              <Sparkles className="h-8 w-8 text-[#c8a96e]" aria-hidden="true" />
              <p className="mt-6 text-2xl font-semibold leading-9">
                Thank you for choosing ZenVoraa. We are excited to be part of
                your style journey.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-bold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-[#c8a96e] hover:text-white"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
