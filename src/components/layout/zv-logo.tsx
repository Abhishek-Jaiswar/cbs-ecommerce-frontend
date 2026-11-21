import { cn } from "@/lib/utils";

/**
 * ZenVoraa logo cropped from the full lockup sprite (Figma "logo 1"/"logo 2").
 * - "monogram": the ZV ring only (header).
 * - "wordmark": the "ZenVoraa" lettering only (hero caption).
 * Size the wrapper via className (e.g. "size-20", "h-12 w-[141px]").
 */
export function ZvLogo({
  variant = "monogram",
  className,
  alt = "ZenVoraa",
}: {
  variant?: "monogram" | "wordmark";
  className?: string;
  alt?: string;
}) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <img
        src="/zenvoraa/brand/logo-sprite.png"
        alt={alt}
        className={cn(
          "pointer-events-none absolute top-[2.7%] h-[95.95%] max-w-none",
          variant === "monogram"
            ? "left-[-0.44%] w-[406.28%]"
            : "left-[-38.24%] w-[138.19%]",
        )}
      />
    </span>
  );
}
