import {
  AlertCircle,
  BadgeIndianRupee,
  CheckCircle2,
  FileCheck2,
  FileText,
  Gavel,
  ImageIcon,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { PolicyPageNav } from "@/components/common/policy-page-nav";

const termsHighlights = [
  {
    title: "Use of website",
    description:
      "By accessing ZenVoraa, you agree to use the website responsibly and in line with these terms.",
    icon: FileCheck2,
  },
  {
    title: "Order review",
    description:
      "Orders may be accepted, rejected, or cancelled if suspicious or fraudulent activity is detected.",
    icon: ShieldAlert,
  },
  {
    title: "Terms may change",
    description:
      "Continued use of the website after updates means acceptance of the revised terms.",
    icon: RefreshCcw,
  },
];

const termsSections = [
  {
    title: "Product information",
    description:
      "We make every effort to display product details accurately. Product colors may vary slightly depending on screen settings, and dimensions may contain minor variations.",
    icon: ImageIcon,
  },
  {
    title: "Pricing",
    description:
      "All prices are displayed in Indian Rupees (INR). ZenVoraa reserves the right to update prices, offers, and product availability without prior notice.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Order acceptance",
    description:
      "Placing an order does not guarantee acceptance. Orders may be reviewed, cancelled, or declined if details are incomplete, unavailable, or flagged for risk.",
    icon: FileText,
  },
  {
    title: "Intellectual property",
    description:
      "Logos, images, product descriptions, graphics, and website designs remain the exclusive property of ZenVoraa unless otherwise stated.",
    icon: ShieldCheck,
  },
];

const customerResponsibilities = [
  "Provide accurate account, shipping, and billing information.",
  "Review product details carefully before placing an order.",
  "Use the website only for lawful shopping and account activity.",
  "Contact support promptly for order concerns or incorrect information.",
];

export default function TermsConditionsPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-zenvoraa)] text-[#222222]">
      <section className="border-b border-[#eee8df] bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              ZenVoraa Terms
            </span>
            <h1 className="mt-5 text-4xl font-serif font-medium leading-tight sm:text-5xl lg:text-6xl tracking-wide">
              Terms & Conditions
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              By accessing and using our website, you agree to these terms.
              Please read them before placing an order or using ZenVoraa
              services.
            </p>
          </div>

          <div className="border border-white/15 bg-white/10 p-6 backdrop-blur">
            <Gavel className="h-9 w-9 text-[#c8a96e]" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold leading-9">
              Clear terms help keep every purchase fair, transparent, and
              protected.
            </p>
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6">
              {["Indian law applies", "Prices in INR", "Orders reviewed"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-white/70"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#c8a96e]" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <PolicyPageNav active="terms" />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {termsHighlights.map(({ title, description, icon: Icon }) => (
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
              Core Terms
            </span>
            <h2 className="mt-4 text-3xl font-serif font-medium sm:text-4xl tracking-wide">
              Important conditions for using ZenVoraa
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              These points explain how product information, pricing, order
              review, and content ownership are handled on the website.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {termsSections.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="border border-[#eee8df] bg-[#fbfaf7] p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a96e]"
              >
                <Icon className="h-8 w-8 text-[#c29958]" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ea] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="border border-[#ded0bd] bg-white p-8 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9f7b3d]">
              Customer Responsibilities
            </span>
            <h2 className="mt-4 text-3xl font-serif font-medium leading-tight tracking-wide">
              A smooth order starts with accurate details.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-600">
              These responsibilities help us process orders correctly and
              support you faster if something needs attention.
            </p>
          </div>

          <div className="grid gap-3">
            {customerResponsibilities.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 border border-[#ded0bd] bg-white px-5 py-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-[#c8a96e]"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c29958]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              Governing Law
            </span>
            <h2 className="mt-4 text-3xl font-serif font-medium leading-tight sm:text-4xl tracking-wide">
              These terms are governed under Indian law.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Any disputes shall fall under the jurisdiction of courts in
              Mumbai, Maharashtra, unless applicable law requires otherwise.
            </p>
          </div>

          <div className="border border-[#ded0bd] bg-[#111111] p-8 text-white">
            <AlertCircle className="h-8 w-8 text-[#c8a96e]" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Limitation of liability</h3>
            <p className="mt-4 text-sm leading-7 text-white/70">
              ZenVoraa shall not be liable for indirect, incidental, or
              consequential damages arising from use of the website or products.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
