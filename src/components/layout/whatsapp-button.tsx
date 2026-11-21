"use client";

/** Floating WhatsApp contact (Figma "WhatsApp contact" / "Top Nav > image 1"). */
export default function WhatsAppButton() {
  const phoneNumber = "919909992725";
  const message = "Hello ZenVoraa! I'd like to inquire about your jewelry collections.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact ZenVoraa on WhatsApp"
      className="fixed bottom-6 right-zv-20 z-45 flex items-center justify-center rounded-[20px] bg-white p-zv-10 shadow-[0_2px_10px_rgba(36,26,15,0.15)] transition-transform hover:scale-110"
    >
      <img src="/zenvoraa/icons/whatsapp.png" alt="" width={18} height={18} className="size-[18px]" />
    </a>
  );
}
