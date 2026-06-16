"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "919909992725";
  const message = "Hello ZenVoraa! I'd like to inquire about your jewelry collections.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-45 group flex items-center">
      {/* Tooltip */}
      <span className="mr-3 pointer-events-none translate-x-2 rounded-md bg-[#222222]/90 backdrop-blur-[2px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        Chat with us
      </span>

      {/* Button Link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_24px_rgba(37,211,102,0.4)]"
        aria-label="Contact ZenVoraa on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 pointer-events-none" style={{ animationDuration: "2.5s" }} />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="relative z-10 h-7 w-7" />
      </a>
    </div>
  );
}
