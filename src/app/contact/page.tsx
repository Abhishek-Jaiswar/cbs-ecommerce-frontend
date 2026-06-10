"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-[#faf8f4]">

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1b1b1b] h-[320px] flex items-center justify-center">

          <div className="text-center px-6">

            <p className="uppercase tracking-[6px] text-[#d4a24c] mb-4">
              Contact Us
            </p>

            <h1 className="text-white text-5xl md:text-6xl font-bold">
              We're Here To Help
            </h1>

            <p className="text-white/70 mt-5 max-w-xl mx-auto">
              Questions about orders, jewellery collections,
              shipping, or returns? We'd love to hear from you.
            </p>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT PANEL */}

          <div className="space-y-8">

            <div className="bg-white rounded-[32px] p-8 shadow-sm">

              <h2 className="text-3xl font-bold mb-8">
                Customer Support
              </h2>

              <div className="space-y-6">

                <div>
                  <p className="text-[#d4a24c] font-semibold">
                    Email
                  </p>

                  <p className="text-gray-600">
                    support@zenvoraa.com
                  </p>
                </div>

                <div>
                  <p className="text-[#d4a24c] font-semibold">
                    Phone
                  </p>

                  <p className="text-gray-600">
                    +91 XXXXX XXXXX
                  </p>
                </div>

                <div>
                  <p className="text-[#d4a24c] font-semibold">
                    WhatsApp
                  </p>

                  <p className="text-gray-600">
                    +91 XXXXX XXXXX
                  </p>
                </div>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white rounded-3xl p-8">

                <h3 className="font-bold mb-4">
                  Business Hours
                </h3>

                <p className="text-gray-600">
                  Monday – Saturday
                </p>

                <p className="text-gray-600">
                  10:00 AM – 7:00 PM
                </p>

                <p className="text-gray-600 mt-2">
                  Sunday Closed
                </p>

              </div>

              <div className="bg-white rounded-3xl p-8">

                <h3 className="font-bold mb-4">
                  Registered Address
                </h3>

                <p className="text-gray-600">
                  ZenVoraa
                </p>

                <p className="text-gray-600">
                  [Your Business Address]
                </p>

                <p className="text-gray-600">
                  Mumbai, Maharashtra
                </p>

              </div>

            </div>

            <div className="bg-[#d4a24c] rounded-3xl p-8 text-white">

              <h3 className="text-2xl font-bold mb-3">
                Response Time
              </h3>

              <p className="text-white/90">
                We strive to respond to all customer
                inquiries within 24–48 business hours.
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="bg-white rounded-[32px] shadow-xl p-10">

            {!submitted ? (

              <>
                <h2 className="text-3xl font-bold mb-2">
                  Send Us A Message
                </h2>

                <p className="text-gray-500 mb-8">
                  Fill out the form and our team
                  will contact you shortly.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <input
                    required
                    placeholder="Full Name"
                    className="w-full rounded-2xl border p-5 outline-none focus:border-[#d4a24c]"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-2xl border p-5 outline-none focus:border-[#d4a24c]"
                  />

                  <input
                    placeholder="Subject"
                    className="w-full rounded-2xl border p-5 outline-none focus:border-[#d4a24c]"
                  />

                  <textarea
                    rows={6}
                    required
                    placeholder="Your Message"
                    className="w-full rounded-2xl border p-5 outline-none focus:border-[#d4a24c]"
                  />

                  <button
                    type="submit"
                    className="
                      w-full
                      rounded-2xl
                      bg-[#d4a24c]
                      py-5
                      text-white
                      font-semibold
                      hover:scale-[1.01]
                      duration-300
                    "
                  >
                    Send Message
                  </button>

                </form>

              </>

            ) : (

              <div className="text-center py-20">

                <div className="text-7xl mb-6">
                  ✨
                </div>

                <h2 className="text-4xl font-bold">
                  Thank You!
                </h2>

                <p className="mt-4 text-gray-500">
                  Thank you for reaching out.
                  We’ll get back to you soon.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="
                    mt-10
                    px-8
                    py-4
                    rounded-2xl
                    bg-[#d4a24c]
                    text-white
                  "
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