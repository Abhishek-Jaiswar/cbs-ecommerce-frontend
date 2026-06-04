"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative bg-[#f9f5f0] rounded overflow-hidden aspect-square">
        <Image
          src={images[activeIndex]}
          alt={`${productName} view ${activeIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full tracking-wide">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show ${productName} image ${i + 1}`}
            className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors duration-200 ${
              i === activeIndex ? "border-[#c8a96e]" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${i + 1}`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
