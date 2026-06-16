import "./globals.css";
import { Geist, Cormorant_Garamond } from "next/font/google";
import HeaderFooterWrapper from "@/components/layout/header-footer-wrapper";
import { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/store/store-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { UtmTracker } from "@/components/utm/utm-tracker";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zenvoraa.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZenVoraa | Handcrafted Premium Jewelry",
    template: "%s | ZenVoraa",
  },
  description:
    "Shop premium artificial jewelry collections including rings, necklaces, earrings, bracelets, and more. Crafted with elegance and designed for every occasion.",
  keywords: [
    "jewelry",
    "online jewelry store",
    "rings",
    "necklaces",
    "earrings",
    "bracelets",
    "premium jewelry",
    "fashion jewelry",
    "ZenVoraa",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "ZenVoraa | Handcrafted Premium Jewelry",
    description:
      "Shop premium artificial jewelry collections including rings, necklaces, earrings, bracelets, and more. Crafted with elegance and designed for every occasion.",
    siteName: "ZenVoraa",
    url: siteUrl,
    images: [
      {
        url: "/logo.png",
        width: 1959,
        height: 803,
        alt: "ZenVoraa Handcrafted Premium Jewelry",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZenVoraa | Handcrafted Premium Jewelry",
    description:
      "Shop premium artificial jewelry collections including rings, necklaces, earrings, bracelets, and more.",
    images: ["/logo.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased font-sans ${geistSans.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "ZenVoraa",
                "url": siteUrl,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${siteUrl}/shop?search={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "ZenVoraa",
                "url": siteUrl,
                "logo": `${siteUrl}/logo.png`,
                "sameAs": [
                  "https://www.facebook.com/ZenVoraa",
                  "https://www.instagram.com/zenv.oraa/",
                  "https://twitter.com/ZenVoraa",
                ],
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <AuthProvider>
            <TooltipProvider>
              <UtmTracker />
              <HeaderFooterWrapper>
                {children}
              </HeaderFooterWrapper>
            </TooltipProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
