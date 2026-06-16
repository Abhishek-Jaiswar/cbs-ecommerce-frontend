"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Is ZenVoraa jewellery made from real gold or diamonds?",
    answer: "No, ZenVoraa specializes in premium artificial and fashion jewellery. Our pieces are crafted to deliver affordable luxury with the look and feel of fine jewellery without the high price tag.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery timelines depend on your location. Metro cities typically take 3–5 business days, Tier 2/3 cities take 5–8 business days, and remote areas may take 7–12 business days. Tracking details are sent to you immediately upon dispatch.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns only for products that are received damaged, defective, or incorrect. To request a return, email us at info@zenvoraa.in within the specified window with order details, photos, and an unboxing video.",
  },
  {
    question: "How should I care for my jewellery?",
    answer: "To preserve the shine and finish of your jewellery, keep it away from water, perfumes, soaps, hairsprays, and harsh chemicals. Store each piece individually in a dry ziplock bag or a soft pouch after use.",
  },
  {
    question: "Will the jewellery tarnish over time?",
    answer: "All fashion jewellery can tarnish if exposed to moisture and chemicals. However, with proper care and dry storage, our premium plating is designed to retain its brilliance and last for a very long time.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept a wide range of secure payment methods, including UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Net Banking, popular mobile wallets, and Cash on Delivery (COD) if available for your pincode.",
  },
  {
    question: "Can I place a bulk or gifting order?",
    answer: "Yes! We cater to corporate gifting, reseller requests, and customized bulk orders for weddings or special events. Please contact us at info@zenvoraa.in with your requirements.",
  },
  {
    question: "How can I contact ZenVoraa support?",
    answer: "You can reach our customer support team by emailing info@zenvoraa.in or messaging us on WhatsApp at +91-9909992725. We typically respond within 24–48 business hours.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-[#fbf9f6] border-t border-[#eee8df]/65 font-[var(--font-zenvoraa)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c29958] block mb-3">
            HAVE QUESTIONS?
          </span>
          <h2 className="text-3xl font-serif font-medium capitalize text-[#222222] sm:text-4xl tracking-wide">
            frequently asked questions
          </h2>
          <p className="mt-3 text-sm text-[#777777]">
            Find answers to common questions about shipping, care, returns, and ordering.
          </p>
        </div>

        {/* FAQ Accordion container */}
        <div className="bg-white border border-[#eee8df] p-6 sm:p-10 shadow-sm rounded-none">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#eee8df]/70 py-1 last:border-0"
              >
                <AccordionTrigger className="text-sm sm:text-base font-medium text-[#222222] hover:text-[#c29958] hover:no-underline transition-colors py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#555555] leading-relaxed pb-4 pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
