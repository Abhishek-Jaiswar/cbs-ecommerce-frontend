"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./whatsapp-button";
import React from "react";
import { Toaster } from "sonner";

/** Pages whose first section is a full-bleed image the header floats over (auth pages: the left photo). */
function hasHeroOverlay(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/shop" ||
    pathname.startsWith("/shop/") ||
    ["/login", "/signup", "/forgot-password"].includes(pathname)
  );
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
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "!rounded-leaf !border-zv-bg !bg-white !font-zv-body !text-zv-ink !shadow-lg",
            actionButton: "!rounded-leaf-mirror !bg-zv-primary !text-white",
          },
        }}
      />
    </div>
  );
}
