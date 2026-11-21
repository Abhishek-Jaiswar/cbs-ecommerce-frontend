import Link from "next/link";

const linkGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?tag=new" },
      { label: "All Sale", href: "/shop?sale=true" },
      { label: "Earrings", href: "/shop?category=earrings" },
      { label: "Necklaces", href: "/shop?category=necklaces" },
      { label: "Bracelets", href: "/shop?category=bracelets" },
      { label: "Rings", href: "/shop?category=rings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      // No standalone FAQ page exists yet; Contact is the closest destination.
      { label: "FAQs", href: "/contact" },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Shipping", href: "/shipping-policy" },
      { label: "Return and Refund", href: "/refund-policy" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-conditions" },
    ],
  },
];

function LinkGroup({ title, links }: (typeof linkGroups)[number]) {
  return (
    <div className="flex flex-col gap-[14px] lg:gap-zv-10">
      <p className="font-zv-body text-sm font-bold">{title}</p>
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className="text-sm leading-[1.4] transition-colors hover:text-zv-primary"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

const [shop, company, policy] = linkGroups as [
  (typeof linkGroups)[number],
  (typeof linkGroups)[number],
  (typeof linkGroups)[number],
];

/** Storefront footer (Figma "Footer", desktop 4-column / mobile stacked). */
const Footer = () => {
  return (
    <footer className="flex flex-col gap-8 bg-zv-bg px-6 pb-6 pt-9 font-zv-body text-zv-ink-brown lg:items-center lg:gap-zv-40 lg:px-zv-40 lg:py-zv-20 lg:text-zv-ink">
      <div className="flex w-full flex-col gap-8 lg:grid lg:grid-cols-4 lg:gap-zv-40">
        {/* Brand */}
        <div className="flex flex-col items-center gap-4 lg:max-w-[309px] lg:gap-zv-20">
          <Link href="/" aria-label="ZenVoraa home">
            <img
              src="/zenvoraa/brand/footer-logo.png"
              alt="ZenVoraa - Timeless Elegance, Imitation Jewellery"
              width={147}
              height={138}
              className="h-[138px] w-[147px] object-cover"
            />
          </Link>
          <p className="text-center text-sm leading-[1.5] lg:leading-normal">
            Discover refined jewelry, timeless styling, and carefully crafted pieces designed for
            everyday elegance and memorable occasions.
          </p>
        </div>

        {/* Mobile: Shop | (Company + Policy). Desktop: one column each. */}
        <div className="flex gap-7 lg:contents">
          <div className="flex-1">
            <LinkGroup {...shop} />
          </div>
          <div className="flex flex-1 flex-col gap-8 lg:contents">
            <LinkGroup {...company} />
            <LinkGroup {...policy} />
          </div>
        </div>
      </div>

      <p className="text-center text-sm">@{new Date().getFullYear()} ZenVoraa</p>
    </footer>
  );
};

export default Footer;
