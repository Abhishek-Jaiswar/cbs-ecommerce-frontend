"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const supportChannels = [
  {
    label: "Email",
    value: "support@zenvoraa.com",
    href: "mailto:support@zenvoraa.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "+91 XXXXX XXXXX",
    href: "https://wa.me/91XXXXXXXXXX",
    icon: MessageCircle,
  },
];

const quickHelp = [
  "Order status and delivery questions",
  "Product details, sizing, and styling help",
  "Returns, replacements, and refund support",
  "Bulk, gifting, and festive collection queries",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-corano)] text-[#222222]">
      <section className="border-b border-[#eee8df] bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              Contact ZenVoraa
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              We are here to help with every detail.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Questions about orders, jewellery collections, shipping, returns,
              or styling? Send us a message and our team will get back to you.
            </p>
          </div>

          <div className="border border-white/15 bg-white/10 p-6 backdrop-blur">
            <Headphones className="h-9 w-9 text-[#c8a96e]" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold leading-9">
              Customer support that keeps your shopping experience simple and
              reassuring.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Typical response time: 24-48 business hours.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {supportChannels.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="group border border-[#eee8df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
              >
                <Icon
                  className="h-7 w-7 text-[#c29958]"
                  aria-hidden="true"
                />
                <h2 className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-stone-500">
                  {label}
                </h2>
                <p className="mt-3 text-lg font-bold text-[#222222] transition group-hover:text-[#c29958]">
                  {value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="space-y-5">
            <div className="border border-[#eee8df] bg-white p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
                Support Desk
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight">
                Tell us what you need and we will guide you from there.
              </h2>
              <div className="mt-8 space-y-4">
                {quickHelp.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-stone-600"
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#c29958]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoCard
                icon={Clock3}
                title="Business Hours"
                lines={["Monday - Saturday", "10:00 AM - 7:00 PM", "Sunday closed"]}
              />
              <InfoCard
                icon={MapPin}
                title="Registered Address"
                lines={["ZenVoraa", "[Your Business Address]", "Mumbai, Maharashtra"]}
              />
            </div>
          </div>

          <div className="border border-[#eee8df] bg-white p-6 shadow-lg sm:p-8 lg:p-10">
            {!submitted ? (
              <>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
                  Send A Message
                </span>
                <h2 className="mt-4 text-3xl font-bold leading-tight">
                  We would love to hear from you.
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Fill out the form and our team will contact you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name">
                      <input
                        required
                        name="name"
                        placeholder="Your name"
                        className="h-12 w-full border border-[#ded6ca] bg-[#fbfaf7] px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#c8a96e] focus:bg-white"
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-12 w-full border border-[#ded6ca] bg-[#fbfaf7] px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#c8a96e] focus:bg-white"
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <input
                      name="subject"
                      placeholder="How can we help?"
                      className="h-12 w-full border border-[#ded6ca] bg-[#fbfaf7] px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#c8a96e] focus:bg-white"
                    />
                  </Field>

                  <Field label="Message">
                    <textarea
                      required
                      name="message"
                      rows={6}
                      placeholder="Share your question or request"
                      className="w-full resize-none border border-[#ded6ca] bg-[#fbfaf7] px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-stone-400 focus:border-[#c8a96e] focus:bg-white"
                    />
                  </Field>

                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#c8a96e] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b5943d]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send Message
                  </button>
                </form>
              </>
            ) : (
              <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-[#c29958]" />
                <h2 className="mt-6 text-4xl font-bold">Thank you!</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                  Thank you for reaching out. We will get back to you soon with
                  the next best step.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#111111] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#c8a96e]"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: LucideIcon;
  title: string;
  lines: string[];
}) {
  return (
    <div className="border border-[#eee8df] bg-[#f6f1ea] p-6">
      <Icon className="h-6 w-6 text-[#c29958]" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <div className="mt-3 space-y-1 text-sm leading-7 text-stone-600">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </span>
      {children}
    </label>
  );
}
