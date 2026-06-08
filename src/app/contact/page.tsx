'use client'

export default function ContactPage() {
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

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left */}
          <div>

            <h2 className="text-4xl font-bold mb-4">
              Let's Start A Conversation
            </h2>

            <p className="text-gray-600 mb-10">
              Have questions about collections, custom orders,
              or support? Send us a message.
            </p>

            <div className="space-y-8">

              <div>
                <p className="text-[#d4a24c] font-semibold">
                  Email
                </p>

                <p className="text-gray-700">
                  support@zenvora.com
                </p>
              </div>

              <div>
                <p className="text-[#d4a24c] font-semibold">
                  Phone
                </p>

                <p className="text-gray-700">
                  +91 98765 43210
                </p>
              </div>

              <div>
                <p className="text-[#d4a24c] font-semibold">
                  Address
                </p>

                <p className="text-gray-700">
                  Mumbai, Maharashtra
                </p>
              </div>

            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <form className="space-y-5">

              <div>
                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full mt-2 border p-4 rounded-xl"
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full mt-2 border p-4 rounded-xl"
                />
              </div>

              <div>
                <label>Subject</label>

                <input
                  type="text"
                  placeholder="Order inquiry"
                  className="w-full mt-2 border p-4 rounded-xl"
                />
              </div>

              <div>
                <label>Message</label>

                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full mt-2 border p-4 rounded-xl"
                />
              </div>

              <button
                className="w-full bg-[#d4a24c] text-white py-4 rounded-xl hover:opacity-90"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}