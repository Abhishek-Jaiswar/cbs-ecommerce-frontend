import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/store/store-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

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
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <TooltipProvider>
            <Navbar />
            {children}
            <Footer />
          </TooltipProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
