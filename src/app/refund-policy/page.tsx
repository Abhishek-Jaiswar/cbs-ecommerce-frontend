import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mail,
  PackageX,
  RefreshCcw,
  ShieldCheck,
  Video,
  XCircle,
} from "lucide-react";

const policyHighlights = [
  {
    title: "Report within 48 hours",
    description:
      "Please contact us within 48 hours of delivery for damaged, defective, or incorrect items.",
    icon: Clock3,
  },
  {
    title: "Unboxing video required",
    description:
      "A clear unboxing video helps us verify the issue and process your request quickly.",
    icon: Video,
  },
  {
    title: "Refunds in 7-10 days",
    description:
      "Approved refunds are credited to the original payment method within 7-10 business days.",
    icon: RefreshCcw,
  },
];

const returnSteps = [
  "Email returns@zenvoraa.com with your order number.",
  "Attach clear product photos and the mandatory unboxing video.",
  "Our team reviews the request and confirms eligibility.",
  "If approved, we arrange replacement or begin the refund process.",
];

const eligibleItems = [
  "Product received damaged",
  "Manufacturing defect found on delivery",
  "Incorrect product delivered",
  "Missing item from a prepaid order",
];

const nonReturnableItems = [
  "Earrings",
  "Customized products",
  "Clearance sale items",
  "Products damaged after use",
];

export default function ReturnRefundPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf7] font-[var(--font-corano)] text-[#222222]">
      <section className="border-b border-[#eee8df] bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#c8a96e]">
              ZenVoraa Policy
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Return & Refund Policy
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              We want every order to arrive exactly as expected. If your item is
              damaged, defective, or incorrect, this page explains how we can
              help.
            </p>
          </div>

          <div className="border border-white/15 bg-white/10 p-6 backdrop-blur">
            <ShieldCheck className="h-9 w-9 text-[#c8a96e]" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold leading-9">
              Customer satisfaction remains at the heart of everything we do.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Please keep your packaging, invoice, product photos, and unboxing
              video ready before raising a request.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {policyHighlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="border border-[#eee8df] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#c8a96e] hover:shadow-md"
              >
                <Icon className="h-7 w-7 text-[#c29958]" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="border border-[#eee8df] bg-white p-8 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
              Eligibility
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              Returns are accepted for delivery issues only.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-500">
              To protect hygiene and product quality, jewellery can be returned
              only when there is a clear issue with the order at delivery.
            </p>

            <div className="mt-8 grid gap-3">
              {eligibleItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#eee8df] bg-[#f6f1ea] p-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9f7b3d]">
              How To Initiate
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight">
              A simple review process keeps requests clear.
            </h2>

            <div className="mt-8 space-y-4">
              {returnSteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#111111] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1.5 text-sm leading-7 text-stone-600">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="mailto:returns@zenvoraa.com"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#c8a96e] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b5943d]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email Returns
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[#eee8df] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <PackageX className="h-9 w-9 text-[#c29958]" aria-hidden="true" />
              <span className="mt-6 block text-xs font-bold uppercase tracking-[0.3em] text-[#c29958]">
                Non-Returnable Items
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight">
                Some items cannot be returned for hygiene and usage reasons.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {nonReturnableItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-900"
                >
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ea] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9f7b3d]">
              Replacement First
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Wherever possible, we offer a replacement before initiating a
              refund.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Our goal is to ensure every customer receives the experience they
              expect while keeping the process fair, transparent, and easy to
              follow.
            </p>
          </div>

          <div className="border border-[#ded0bd] bg-[#111111] p-8 text-white">
            <AlertCircle className="h-8 w-8 text-[#c8a96e]" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Important note</h3>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Requests without product images and a clear unboxing video may not
              be eligible for return, replacement, or refund approval.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
