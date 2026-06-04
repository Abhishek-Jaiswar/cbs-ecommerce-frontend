import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductImage(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("ring") || s.includes("band")) {
    return "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80";
  }
  if (s.includes("earring") || s.includes("stud") || s.includes("hoop")) {
    return "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80";
  }
  if (s.includes("necklace") || s.includes("chain") || s.includes("pendant")) {
    return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80";
  }
  if (s.includes("bracelet") || s.includes("bangle") || s.includes("cuff")) {
    return "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80";
}
