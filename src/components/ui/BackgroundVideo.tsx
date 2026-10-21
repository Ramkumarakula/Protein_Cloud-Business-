"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/cn";

/**
 * Muted, looping, decorative background video.
 * Nothing downloads until the section is near the viewport, it plays only while visible,
 * and reduced-motion visitors get the still poster instead.
 */
export function BackgroundVideo({
  webm,
  mp4,
  poster,
  className,
}: {
  webm: string;
  mp4: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduce) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== "auto") {
            video.preload = "auto";
            video.load();
          }
          video.play().catch(() => {
            // Autoplay can be refused (e.g. data saver); the poster stays visible.
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      aria-hidden
      tabIndex={-1}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload="none"
      poster={withBasePath(poster)}
      className={cn("pointer-events-none h-full w-full object-cover", className)}
      data-testid="sandwich-video"
    >
      <source src={withBasePath(webm)} type="video/webm" />
      <source src={withBasePath(mp4)} type="video/mp4" />
    </video>
  );
}
