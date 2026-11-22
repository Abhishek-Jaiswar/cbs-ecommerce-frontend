"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = { url: string; alt: string; colorId: string | null };

interface Props {
  images: GalleryImage[];
  index: number;
  onIndexChange: (i: number) => void;
  badges?: React.ReactNode;
}

/**
 * Figma Product > Images. Desktop: the left half of the page, sticky, with
 * prev/next chevrons at mid-height and 100×133 thumbnails centred at the
 * bottom. Mobile: a swipeable slider with 15×26 chevrons and 64×85
 * thumbnails. The site header floats over the top of it.
 */
export function ZvProductGallery({ images, index, onIndexChange, badges }: Props) {
  const current = images[index] ?? images[0];
  const many = images.length > 1;
  const sliderRef = useRef<HTMLDivElement>(null);
  const go = (d: 1 | -1) => onIndexChange((index + d + images.length) % images.length);

  // keep the mobile slider in step when the index changes from outside (finish picked, thumb tapped)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 4) el.scrollTo({ left: target, behavior: "smooth" });
  }, [index]);

  const onSliderScroll = () => {
    const el = sliderRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index && i >= 0 && i < images.length) onIndexChange(i);
  };

  return (
    // lg:h-full: fill the whole left column (as tall as the info column) so the
    // sticky photo below has room to stay pinned while the right side scrolls
    <div className="relative bg-zv-image-well lg:h-full">
      {/* Mobile slider */}
      <div className="relative lg:hidden">
        <div
          ref={sliderRef}
          onScroll={onSliderScroll}
          className="flex h-[590px] max-h-[78svh] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label="Product photos"
        >
          {images.map((img, i) => (
            <div
              key={img.url + i}
              className="relative h-full w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className="size-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
        {many && (
          <>
            <Arrow dir={-1} onClick={() => go(-1)} className="left-zv-10" iconClass="h-[26px] w-[15px]" />
            <Arrow dir={1} onClick={() => go(1)} className="right-zv-10" iconClass="h-[26px] w-[15px]" />
            <Thumbs images={images} index={index} onPick={onIndexChange} className="bottom-zv-20 gap-3" thumbClass="h-[85px] w-16" />
          </>
        )}
        {badges && <div className="pointer-events-none absolute left-zv-20 top-[100px] flex flex-col items-start gap-1.5">{badges}</div>}
      </div>

      {/* Desktop */}
      <div className="relative hidden h-svh max-h-[1121px] min-h-[640px] lg:sticky lg:top-0 lg:block">
        <ZoomImage key={current?.url} src={current?.url ?? ""} alt={current?.alt ?? ""} />
        {badges && <div className="pointer-events-none absolute left-zv-40 top-[140px] flex flex-col items-start gap-1.5">{badges}</div>}
        {many && (
          <>
            <Arrow dir={-1} onClick={() => go(-1)} className="left-zv-20 size-10" iconClass="size-10" />
            <Arrow dir={1} onClick={() => go(1)} className="right-zv-20 size-10" iconClass="size-10" />
            <Thumbs images={images} index={index} onPick={onIndexChange} className="bottom-zv-20 gap-zv-20" thumbClass="h-[133px] w-[100px]" />
          </>
        )}
      </div>
    </div>
  );
}

function Arrow({ dir, onClick, className, iconClass }: { dir: 1 | -1; onClick: () => void; className: string; iconClass: string }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-white",
        className,
      )}
    >
      <Icon className={iconClass} strokeWidth={1.25} preserveAspectRatio="none" />
    </button>
  );
}

function Thumbs({
  images,
  index,
  onPick,
  className,
  thumbClass,
}: {
  images: GalleryImage[];
  index: number;
  onPick: (i: number) => void;
  className: string;
  thumbClass: string;
}) {
  return (
    // auto margins centre the row but still let it scroll from the first thumb when it overflows
    <div
      className={cn(
        "absolute inset-x-0 z-10 flex overflow-x-auto px-zv-20 py-1 [scrollbar-width:none] [&>:first-child]:ml-auto [&>:last-child]:mr-auto",
        className,
      )}
    >
      {images.map((img, i) => (
        <button
          key={img.url + i}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Show photo ${i + 1}`}
          aria-current={i === index}
          className={cn(
            "shrink-0 overflow-hidden rounded-zv-xs bg-zv-image-well shadow-md transition",
            thumbClass,
            i === index ? "ring-2 ring-white" : "opacity-75 hover:opacity-100",
          )}
        >
          <img src={img.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        </button>
      ))}
    </div>
  );
}

/** Desktop photo with a 2.2× zoom that follows the pointer (mouse only). */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div
      className="relative size-full cursor-zoom-in overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onPointerLeave={() => setZoom(null)}
    >
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="size-full object-cover transition-transform duration-200 ease-out"
        style={zoom ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
      />
    </div>
  );
}
