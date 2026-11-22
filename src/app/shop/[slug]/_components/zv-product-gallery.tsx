"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = { url: string; alt: string; colorId: string | null };

interface Props {
  images: GalleryImage[];
  index: number;
  onIndexChange: (i: number) => void;
  badges?: React.ReactNode;
}

/**
 * Figma Product > Images. Desktop: the left half of the page, sticky, with a
 * thumbnail rail and hover zoom. Mobile: a swipeable full-width slider.
 * The site header floats over the top of it.
 */
export function ZvProductGallery({ images, index, onIndexChange, badges }: Props) {
  const current = images[index] ?? images[0];
  const sliderRef = useRef<HTMLDivElement>(null);

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
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-zv-20 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full bg-white shadow transition-all",
                  i === index ? "w-5" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        )}
        {badges && <div className="pointer-events-none absolute left-zv-20 top-[100px] flex flex-col items-start gap-1.5">{badges}</div>}
      </div>

      {/* Desktop */}
      <div className="relative hidden h-svh max-h-[1121px] min-h-[640px] lg:sticky lg:top-0 lg:block">
        <ZoomImage key={current?.url} src={current?.url ?? ""} alt={current?.alt ?? ""} />
        {badges && <div className="pointer-events-none absolute left-zv-40 top-[140px] flex flex-col items-start gap-1.5">{badges}</div>}
        {images.length > 1 && (
          <div className="absolute bottom-zv-40 left-zv-40 flex max-h-[60%] flex-col gap-zv-10 overflow-y-auto p-1 [scrollbar-width:none]">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "size-16 shrink-0 overflow-hidden rounded-zv-xs bg-zv-image-well shadow-sm ring-offset-2 transition",
                  i === index ? "ring-2 ring-zv-primary" : "opacity-80 hover:opacity-100",
                )}
              >
                <img src={img.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
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
