"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "fade-in" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom-in";
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  animation = "slide-up",
  duration = 800,
  delay = 0,
  threshold = 0.1,
  once = true,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "slide-up":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12";
      case "slide-down":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12";
      case "slide-left":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12";
      case "slide-right":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12";
      case "zoom-in":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";
      default:
        return "";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        getAnimationClass(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
