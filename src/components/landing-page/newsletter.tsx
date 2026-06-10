"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-[#fbf9f6] border-t border-b border-[#eee8df]/65 font-[var(--font-corano)]">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        
        {subscribed ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#222222]">You are on the list!</h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                Welcome to Zenvoraa. We have sent your 10% welcome coupon to your inbox. Stay tuned for collections & pre-sales.
              </p>
            </div>
            <button
              onClick={() => setSubscribed(false)}
              className="text-xs text-[#c29958] font-bold border-b border-[#c29958] hover:text-[#222222] hover:border-[#222222] transition-colors"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c29958] block">
                Zenvoraa Club
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#222222]">
                Join Our Newsletter & Save 10%
              </h2>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Subscribe to stay up-to-date with new collections, exclusive pre-sales, and private lookbooks.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto max-w-md flex flex-col sm:flex-row gap-3 items-center justify-center"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border border-[#ded7cc] bg-white px-4 text-sm text-[#222222] outline-none transition-colors focus:border-[#c29958] rounded-none placeholder:text-stone-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-12 shrink-0 bg-[#222222] hover:bg-[#c29958] px-8 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-300 flex items-center justify-center gap-2 rounded-none"
              >
                Subscribe <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            
            <p className="text-[10px] text-stone-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
}
