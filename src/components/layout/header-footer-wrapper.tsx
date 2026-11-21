"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./whatsapp-button";
import React from "react";

/** Pages whose first section is a full-bleed image the header floats over. */
function hasHeroOverlay(pathname: string) {
  return pathname === "/" || pathname === "/shop" || pathname.startsWith("/shop/");
}

export default function HeaderFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  const overlay = hasHeroOverlay(pathname);

  return (
    <div className={overlay ? "relative flex min-h-full flex-1 flex-col" : "flex min-h-full flex-1 flex-col"}>
      <Navbar overlay={overlay} />
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
