import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Us | ZenVora Customer Support",
  description:
    "Get in touch with ZenVora's customer support desk. Ask questions about orders, handcrafted jewelry collections, sizing, shipping, or returns.",
  openGraph: {
    title: "Contact Us | ZenVora Customer Support",
    description:
      "Get in touch with ZenVora's customer support desk. Ask questions about orders, handcrafted jewelry collections, sizing, shipping, or returns.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
