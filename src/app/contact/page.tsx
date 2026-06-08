"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // later connect API here
    setSubmitted(true);
  };

  return (
    <main className="bg-[#faf8f4] min-h-screen">

      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center bg-black">
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-center text-white">
          <p className="uppercase tracking-[4px] text-[#d4a24c]">
            Get In Touch
          </p>

          <h1 className="text-5xl font-bold mt-3">
            Contact Us
          </h1>

          <p className="mt-4 text-white/80">
            We’re here to help you find timeless elegance.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT */}
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Let's Start A Conversation
            </h2>

            <p className="text-gray-600 mb-10">
              Have questions about collections,
              custom orders, or support?
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            {submitted ? (

              <div className="text-center py-20">

                <div className="text-6xl mb-4">
                  ✨
                </div>

                <h2 className="text-3xl font-bold">
                  Thank You!
                </h2>

                <p className="mt-4 text-gray-600">
                  Thank you for reaching out.
                  We’ll get back to you soon.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 bg-[#d4a24c] px-6 py-3 rounded-xl text-white"
                >
                  Send Another Message
                </button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <input
                  required
                  placeholder="Name"
                  className="w-full border p-4 rounded-xl"
                />

                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full border p-4 rounded-xl"
                />

                <input
                  placeholder="Subject"
                  className="w-full border p-4 rounded-xl"
                />

                <textarea
                  required
                  rows={5}
                  placeholder="Message"
                  className="w-full border p-4 rounded-xl"
                />

                <button
                  type="submit"
                  className="w-full bg-[#d4a24c] text-white py-4 rounded-xl hover:opacity-90"
                >
                  Send Message
                </button>

              </form>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}