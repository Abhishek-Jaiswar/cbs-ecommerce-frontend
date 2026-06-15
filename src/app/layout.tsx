import "./globals.css";
import { Geist } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Zenvora",
    template: "%s | Zenvora",
  },
  description:
    "Shop premium jewelry collections including rings, necklaces, earrings, bracelets, and more. Crafted with elegance and designed for every occasion.",
  keywords: [
    "jewelry",
    "online jewelry store",
    "rings",
    "necklaces",
    "earrings",
    "bracelets",
    "premium jewelry",
    "fashion jewelry",
    "Zenvora",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased font-sans ${geistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZenVora",
              "url": "https://zenvoraa-shop.vercel.app", // Placeholder frontend URL, matches config
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://zenvoraa-shop.vercel.app/shop?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
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
