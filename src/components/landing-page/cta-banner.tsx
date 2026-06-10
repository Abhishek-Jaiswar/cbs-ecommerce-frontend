import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="border-t border-[#eee8df] bg-[#f9f5f0] py-10 font-[var(--font-corano)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-[#222222]">
            Ready to find your next signature piece?
          </h2>
          <p className="mt-2 text-sm text-[#777777]">
            Explore the full Zenvoraa catalog with live shop filters.
          </p>
        </div>
        <Button
          asChild
          className="h-12 rounded-none bg-[#c29958] px-8 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#222222]"
        >
          <Link href="/shop">
            Shop Collection <ShieldCheck className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
