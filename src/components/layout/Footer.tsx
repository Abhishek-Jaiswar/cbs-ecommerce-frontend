import Image from "next/image";
import Link from "next/link";


import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 bg-[#f5f5f5]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          
          <div>
            <h1 className="text-lg font-bold text-orange-500">ZenVoraa</h1>

            <p className="leading-8 text-gray-600">
              We are a team of designers and developers that create
              high quality wordpress, shopify and ecommerce
              solutions.
            </p>

            
            <div className="mt-10">
              <h3 className="mb-5 text-2xl font-semibold">
                Signup for newsletter
              </h3>

              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />

                <button className="font-medium text-[#c29958] transition hover:text-black">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          
          <div>
            <h3 className="mb-8 text-3xl font-medium">
              Contact Us
            </h3>

            <div className="space-y-6 text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0"
                />

                <p>
                  4710-4890 Breckinridge USA
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={20}
                  className="mt-1 shrink-0"
                />

                <p>
                  demo@yourdomain.com
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={20}
                  className="mt-1 shrink-0"
                />

                <p>
                  (012) 800 456 789-987
                </p>
              </div>
            </div>
          </div>

          
          <div>
            <h3 className="mb-8 text-3xl font-medium">
              Information
            </h3>

            <div className="grid grid-cols-2 gap-y-5">
              <Link
                href="/about"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                About Us
              </Link>

              <Link
                href="/delivery"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                Delivery Info
              </Link>

              <Link
                href="/privacy"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/contact"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                Contact Us
              </Link>

              <Link
                href="/sitemap"
                className="text-gray-600 transition hover:text-[#c29958]"
              >
                Site Map
              </Link>
            </div>
          </div>

          
          <div>
            <h3 className="mb-8 text-3xl font-medium">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#c29958] hover:bg-[#c29958] hover:text-white">
                <FaFacebookF />
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#c29958] hover:bg-[#c29958] hover:text-white">
                <FaTwitter />
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#c29958] hover:bg-[#c29958] hover:text-white">
                <FaInstagram />
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#c29958] hover:bg-[#c29958] hover:text-white">
                <FaYoutube />
              </button>
            </div>

          
          </div>
        </div>
      </div>

      
      <div className="border-t border-gray-200 py-6">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} ZenVoraa Made with ❤️ by{" "}
          <span className="font-medium text-[#c29958]">
            CBS TEAM
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;