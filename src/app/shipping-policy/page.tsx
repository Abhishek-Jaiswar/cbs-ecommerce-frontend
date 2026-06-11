import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPinned,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { PolicyPageNav } from "@/components/common/policy-page-nav";

const shippingHighlights = [
  {
    title: "Pan-India Delivery",
    description:
      "We currently ship ZenVoraa orders across India through trusted courier partners.",
    icon: MapPinned,
  },
  {
    title: "1-3 Day Processing",
    description:
      "Orders are generally packed and processed within 1-3 business days after payment confirmation.",
    icon: PackageCheck,
  },
  {
    title: "Tracking Updates",
    description:
      "Tracking details are shared by email, SMS, or WhatsApp once your order is dispatched.",
    icon: Route,
  },
];

const deliveryTimelines = [
  {
    location: "Metro Cities",
    days: "3-5",
    note: "Major city routes with regular courier coverage.",
  },
  {
    location: "Tier 2 & Tier 3",
    days: "5-8",
    note: "Regional routes that may need additional transit time.",
  },
  {
    location: "Remote Locations",
    days: "7-12",
    note: "Extended coverage areas subject to courier availability.",
  },
];

const shippingDetails = [
  {
    title: "Shipping charges",
    description:
      "Free shipping is available on orders above Rs. 999. Shipping charges may apply for orders below Rs. 999 and will be shown at checkout.",
    icon: CreditCard,
  },
  {
    title: "Secure packaging",
    description:
      "Every order is packed carefully to protect the jewellery during handling and delivery.",
    icon: ShieldCheck,
  },
  {
    title: "Dispatch confirmation",
    description:
      "You will receive dispatch and tracking information once your order has been handed to the courier partner.",
    icon: Truck,
  },
  {
    title: "Address accuracy",
    description:
      "Please provide a complete shipping address and reachable phone number to avoid delivery delays.",
    icon: MapPinned,
  },
];

const delayReasons = [
  "Weather conditions",
  "Courier partner delays",
  "Public holidays",
  "Regional restrictions",
];

export default function ShippingPolicyPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-corano)] text-[#222222]">
      <section className="border-b border-[#eee8df] bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              ZenVoraa Delivery
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Shipping Policy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              We aim to deliver every order safely, reliably, and with clear
              tracking updates from dispatch to doorstep.
            </p>
          </div>

          <div className="border border-white/15 bg-white/10 p-6 backdrop-blur">
            <Truck className="h-9 w-9 text-[#c8a96e]" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold leading-9">
              Fast, secure delivery across India for your favourite jewellery.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Free shipping on eligible orders above Rs. 999.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
              {["Secure packing", "Live tracking", "India-wide", "Easy support"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-[#c8a96e]" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <PolicyPageNav active="shipping" />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {shippingHighlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group border border-[#eee8df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-[#eadfce] bg-[#fbfaf7] transition group-hover:border-[#c8a96e]">
                  <Icon className="h-6 w-6 text-[#c29958]" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#eee8df] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              Estimated Delivery
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Delivery timelines by location
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              Delivery speed depends on your address, courier route, and local
              service availability.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {deliveryTimelines.map(({ location, days, note }) => (
              <div
                key={location}
                className="relative overflow-hidden border border-[#eee8df] bg-[#fbfaf7] p-8 text-center transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[#c8a96e]" />
                <Clock3 className="mx-auto h-7 w-7 text-[#c29958]" />
                <h3 className="mt-5 text-xl font-bold">{location}</h3>
                <p className="mt-5 text-5xl font-bold text-[#c29958]">
                  {days}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                  Business Days
                </p>
                <p className="mt-5 text-sm leading-7 text-stone-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ea] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {shippingDetails.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="border border-[#ded0bd] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a96e]"
              >
                <Icon className="h-8 w-8 text-[#c29958]" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-bold">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              Delivery Delays
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Sometimes deliveries may take longer than expected.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Unexpected delays may occur due to courier operations or local
              conditions. If your order is delayed, please use the shared
              tracking details or contact our support team for assistance.
            </p>
          </div>

          <div className="border border-[#ded0bd] bg-[#111111] p-8 text-white">
            <AlertCircle className="h-8 w-8 text-[#c8a96e]" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Common delay reasons</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {delayReasons.map((reason) => (
                <div
                  key={reason}
                  className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
