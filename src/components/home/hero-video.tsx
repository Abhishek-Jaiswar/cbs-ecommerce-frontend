"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CLOUD = "https://res.cloudinary.com/dmjnjg6u6/video/upload";
const VIDEO_ID = "v1795261260/full-viewport-model-vid-0001_a8evuj";

/**
 * Cloudinary delivery URLs. f_auto:video picks the best codec the browser
 * supports (AV1/VP9/H.264), q_auto picks the bitrate, w_ caps resolution:
 * ~2.7 MB at 1920w vs 8.6 MB original, ~0.6 MB at 720w for phones.
 */
const sources = [
  { media: "(min-width: 1024px)", src: `${CLOUD}/f_auto:video,q_auto,w_1920/${VIDEO_ID}` },
  { media: "(min-width: 640px)", src: `${CLOUD}/f_auto:video,q_auto,w_1280/${VIDEO_ID}` },
  { media: undefined, src: `${CLOUD}/f_auto:video,q_auto,w_720/${VIDEO_ID}` },
];

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Skip the video entirely where it would hurt more than help. */
function shouldPlayVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) return false;
  return true;
}

/**
 * Background film layered over the poster image rendered by the server.
 * The poster stays visible until the video is actually playing, so slow
 * networks, blocked autoplay, reduced motion, Save-Data and errors all fall
 * back to the still frame.
 */
export function HeroVideo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setEnabled(shouldPlayVideo());
  }, []);

  // Pause while off-screen or in a background tab to save data and battery.
  useEffect(() => {
    const video = ref.current;
    if (!enabled || !video) return;

    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <video
      ref={ref}
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-700",
        playing ? "opacity-100" : "opacity-0",
      )}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      onError={() => setPlaying(false)}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} media={s.media} />
      ))}
    </video>
  );
}
