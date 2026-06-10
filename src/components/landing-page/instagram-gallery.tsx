import * as React from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

const instagramPosts = [
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    likes: "1.4k",
    comments: "42",
  },
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    likes: "2.1k",
    comments: "88",
  },
  {
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    likes: "945",
    comments: "19",
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    likes: "3.2k",
    comments: "104",
  },
  {
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&q=80",
    likes: "1.8k",
    comments: "56",
  },
];

export function InstagramGallery() {
  return (
    <section className="py-16 bg-white font-[var(--font-corano)]">
      <div className="mx-auto max-w-[1440px] px-4">
        {/* Title Block */}
        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c29958] block mb-1">
            Share Your Sparkle
          </span>
          <h2 className="text-3xl font-bold capitalize text-[#222222]">
            Follow Us On Instagram
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-[#c29958] font-bold hover:text-[#222222] transition-colors inline-block"
          >
            @zenvoraa_jewelry
          </a>
        </div>

        {/* Dynamic Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {instagramPosts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-[#f7f2ea]"
            >
              <Image
                src={post.image}
                alt={`Instagram lifestyle gallery post ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Blur Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-[#222222]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white text-sm font-bold backdrop-blur-[2px] pointer-events-none">
                <span className="flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Heart className="h-4 w-4 fill-white" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <MessageCircle className="h-4 w-4 fill-white" />
                  {post.comments}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
