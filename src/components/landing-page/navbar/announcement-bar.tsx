import Link from "next/link";

interface AnnouncementItem {
  id: string;
  text: string;
  link?: string | null;
}

interface AnnouncementBarProps {
  announcements: AnnouncementItem[];
}

export default function AnnouncementBar({ announcements }: AnnouncementBarProps) {
  return (
    <div className="hidden border-b border-[#efebe4] bg-white text-xs text-[#555555] lg:block">
      <div className="mx-auto flex h-11 max-w-[1170px] items-center justify-between px-4">
        <p className="shrink-0 border-r border-[#e5e0d8]">
          Welcome to Zenvoraa Jewelry online store
        </p>
        <div className="relative ml-8 max-w-5xl flex-1 overflow-hidden">
          {announcements.length > 0 ? (
            <div className="flex w-full items-center">
              <style>{`
                @keyframes marquee {
                  0% { transform: translate3d(0, 0, 0); }
                  100% { transform: translate3d(-50%, 0, 0); }
                }
                .animate-marquee {
                  display: inline-flex;
                  white-space: nowrap;
                  animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="animate-marquee gap-8">
                {[...announcements, ...announcements].map((ann, idx) => (
                  <span
                    key={`${ann.id}-${idx}`}
                    className="inline-flex items-center gap-1.5 font-medium text-[#c29958]"
                  >
                    {ann.link ? (
                      <Link href={ann.link} className="hover:underline">
                        {ann.text}
                      </Link>
                    ) : (
                      <span>{ann.text}</span>
                    )}
                    <span className="ml-4 font-normal text-gray-300">|</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-right font-medium text-[#c29958]">
              ✨ Free shipping on orders over ₹2000! ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
