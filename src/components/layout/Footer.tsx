import Image from "next/image";
import Link from "next/link";
import { Home, Mail, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const informationLinks = [
  { label: "About Us", href: "/about" },
  { label: "Delivery Information", href: "/delivery" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "Site Map", href: "/sitemap" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "Twitter", href: "#", icon: FaTwitter },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "Youtube", href: "#", icon: FaYoutube },
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#eee8df] bg-[#f7f2ea] font-(--font-corano) text-[#555555]">
      <div className="mx-auto max-w-[1170px] px-4 py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block text-2xl font-black tracking-[0.18em] text-[#222222]">
              Zenvoraa
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7">
              Discover refined jewelry, timeless styling, and carefully crafted pieces designed for everyday elegance and memorable occasions.
            </p>
          </div>

          <div>
            <h6 className="mb-6 text-base font-bold uppercase tracking-wide text-[#222222]">Contact Us</h6>
            <ul className="space-y-4 text-sm leading-6">
              <li className="flex gap-3">
                <Home className="mt-1 h-5 w-5 shrink-0 text-[#c29958]" />
                <span>4710-4890 Breckinridge USA</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-[#c29958]" />
                <a href="mailto:demo@yourdomain.com" className="transition-colors hover:text-[#c29958]">
                  demo@yourdomain.com
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-[#c29958]" />
                <a href="tel:+012800456789987" className="transition-colors hover:text-[#c29958]">
                  (012) 800 456 789-987
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="mb-6 text-base font-bold uppercase tracking-wide text-[#222222]">Information</h6>
            <ul className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
              {informationLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-[#c29958]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="mb-6 text-base font-bold uppercase tracking-wide text-[#222222]">Follow Us</h6>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c4] text-[#555555] transition-all hover:-translate-y-1 hover:border-[#c29958] hover:bg-[#c29958] hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-8 border-t border-[#e5ded4] pt-9 md:grid-cols-2">
          <div>
            <h6 className="mb-4 text-base font-bold uppercase tracking-wide text-[#222222]">
              Signup for newsletter
            </h6>
            <form className="flex max-w-xl border border-[#d8d0c4] bg-white">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#999999]"
              />
              <button
                type="submit"
                className="border-l border-[#d8d0c4] px-5 text-xs font-bold uppercase tracking-wide text-[#222222] transition-colors hover:bg-[#c29958] hover:text-white"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex justify-start md:justify-end">
            <Image
              src="/corano/payment.png"
              alt="Accepted payment methods"
              width={286}
              height={23}
              className="h-auto max-w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-5">
        <p className="px-4 text-center text-sm text-[#555555]">
          © {new Date().getFullYear()} <b className="text-[#222222]">Zenvoraa</b> Made with care by{" "}
          <span className="font-bold text-[#c29958]">CBS TEAM</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
