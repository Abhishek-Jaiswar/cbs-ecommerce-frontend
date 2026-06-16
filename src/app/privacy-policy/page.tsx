import {
  CheckCircle2,
  Cookie,
  CreditCard,
  Database,
  Eye,
  LockKeyhole,
  Mail,
  Megaphone,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import { PolicyPageNav } from "@/components/common/policy-page-nav";

const collectedData = [
  "Name",
  "Email address",
  "Mobile number",
  "Shipping address",
  "Billing address",
  "Payment information processed securely",
  "Device and browser information",
  "Website usage data",
];

const usageItems = [
  {
    title: "Process orders",
    description: "Confirm purchases, prepare invoices, and manage order status.",
    icon: Database,
  },
  {
    title: "Deliver products",
    description: "Share required delivery details with trusted shipping partners.",
    icon: Truck,
  },
  {
    title: "Support customers",
    description: "Respond to questions, requests, returns, and service issues.",
    icon: UserCheck,
  },
  {
    title: "Improve experience",
    description: "Understand website performance, navigation, and product interest.",
    icon: Eye,
  },
  {
    title: "Send updates",
    description: "Share order notifications, account messages, and delivery updates.",
    icon: Mail,
  },
  {
    title: "Promotions",
    description: "Send offers or marketing communication when applicable.",
    icon: Megaphone,
  },
];

const safeguards = [
  {
    title: "Payment security",
    description:
      "All payments are processed through secure and trusted payment gateways. ZenVoraa does not store your card, banking, or payment credentials.",
    icon: CreditCard,
  },
  {
    title: "Information sharing",
    description:
      "We do not sell, rent, or trade your personal information. Details are shared only where needed to complete orders, support requests, or legal obligations.",
    icon: ShieldCheck,
  },
  {
    title: "Cookies",
    description:
      "Our website may use cookies to improve functionality, remember preferences, and understand how visitors use the store.",
    icon: Cookie,
  },
  {
    title: "Your rights",
    description:
      "You may request access, correction, or deletion of your personal information by contacting our privacy team.",
    icon: LockKeyhole,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-corano)] text-[#222222]">
      <section className="border-b border-[#eee8df] bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              ZenVoraa Privacy
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Your trust matters to us. This policy explains what information
              we collect, why we use it, and how we keep it protected while you
              shop with ZenVoraa.
            </p>
          </div>

          <div className="border border-white/15 bg-white/10 p-6 backdrop-blur">
            <LockKeyhole className="h-9 w-9 text-[#c8a96e]" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold leading-9">
              We only use customer information to support a secure and reliable
              shopping experience.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Effective date: Launch date
            </p>
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6">
              {[
                "No payment credentials stored",
                "No selling customer information",
                "Data used for order support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#c8a96e]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PolicyPageNav active="privacy" />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="border border-[#eee8df] bg-white p-8 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              Information We Collect
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              We collect the details needed to process and support your order.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-500">
              Some information is provided directly by you, while limited device
              and usage data may be collected when you browse the website.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {collectedData.map((item) => (
              <div
                key={item}
              className="flex items-start gap-3 border border-[#eee8df] bg-white px-5 py-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-[#c8a96e] hover:bg-[#fffdf9]"
            >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#c29958]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#eee8df] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              How We Use Information
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Clear uses, no unnecessary noise.
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              We use customer information to run the store, complete purchases,
              and improve the experience responsibly.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {usageItems.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group border border-[#eee8df] bg-[#fbfaf7] p-7 transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-[#eadfce] bg-white transition group-hover:border-[#c8a96e]">
                  <Icon className="h-6 w-6 text-[#c29958]" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ea] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {safeguards.map(({ title, description, icon: Icon }) => (
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
              Privacy Requests
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Need access, correction, or deletion of your information?
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Reach out to our privacy team with your request. We may need to
              verify your identity before making changes to account or order
              information.
            </p>
          </div>

          <div className="border border-[#ded0bd] bg-[#111111] p-8 text-white">
            <Mail className="h-8 w-8 text-[#c8a96e]" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Contact privacy support</h3>
            <a
              href="mailto:privacy@zenvoraa.in"
              className="mt-5 inline-flex text-2xl font-bold text-white transition hover:text-[#c8a96e] sm:text-3xl"
            >
              privacy@zenvoraa.in
            </a>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Use this email for privacy-related requests, concerns, or data
              questions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
