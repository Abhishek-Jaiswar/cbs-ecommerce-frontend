import Link from "next/link";

interface MegaMenuColumnProps {
  links: { href: string; label: string }[];
  title: string;
  onItemClick?: () => void;
}

export default function MegaMenuColumn({
  links,
  title,
  onItemClick,
}: MegaMenuColumnProps) {
  return (
    <div>
      <h3 className="text-lg font-bold capitalize text-[#222222]">{title}</h3>
      <div className="mt-3 h-0.5 w-12 bg-[#c29958]" />
      <ul className="mt-6 space-y-4 text-sm font-normal normal-case tracking-normal text-[#333333]">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              onClick={onItemClick}
              className="transition-colors hover:text-[#c29958]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
