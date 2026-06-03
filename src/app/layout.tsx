import TopBar from "@/components/layout/Topbar";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

<<<<<<< HEAD
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

=======
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
>>>>>>> c20540a6e4734563dbec7a0b6e2fa15988e2fccb

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body>
        <TopBar/>
        <Navbar /> 

        <main>{children}</main>

        <Footer/>
=======
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
>>>>>>> c20540a6e4734563dbec7a0b6e2fa15988e2fccb
      </body>
    </html>
  );
}