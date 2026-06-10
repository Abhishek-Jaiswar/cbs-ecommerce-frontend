import * as React from "react";
import { Truck, Headphones, RefreshCw, CreditCard } from "lucide-react";

const policies = [
  {
    description: "Free shipping all order",
    icon: Truck,
    title: "Free Shipping",
  },
  {
    description: "Support 24 hours a day",
    icon: Headphones,
    title: "Support 24/7",
  },
  {
    description: "30 days for free return",
    icon: RefreshCw,
    title: "Money Return",
  },
  {
    description: "We ensure secure payment",
    icon: CreditCard,
    title: "100% Payment Secure",
  },
];

export function Policies() {
  return (
    <>
      <section className="border-b border-[#eee8df] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm leading-7 text-[#555555]">
            Discover Zenvoraa jewelry collections crafted for everyday elegance,
            celebrations, and timeless gifting.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {policies.map(({ description, icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon className="h-10 w-10 shrink-0 text-[#c29958]" />
              <div>
                <h3 className="text-base font-bold text-[#222222]">{title}</h3>
                <p className="mt-1 text-sm text-[#777777]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
