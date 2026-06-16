import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fbfaf7] font-[var(--font-zenvoraa)]">
      <style>{`
        @keyframes barProgress {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          50.1% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>

      <div className="flex flex-col items-center text-center">
        {/* Brand Logo Image with Premium Pulse Glow */}
        <div 
          className="relative"
          style={{ animation: "pulseGlow 2.5s infinite ease-in-out" }}
        >
          <Image
            src="/nav-logo.png"
            alt="ZenVoraa Logo"
            width={180}
            height={74}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        
        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.35em] text-[#c29958]/80 animate-pulse">
          Handcrafted Premium Jewelry
        </p>

        {/* Minimalist Gold Progress Bar */}
        <div className="relative mt-8 h-[1.5px] w-40 overflow-hidden bg-[#efebe4]">
          <div
            className="absolute inset-y-0 left-0 w-full bg-[#c29958]"
            style={{
              animation: "barProgress 2.2s infinite ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}
