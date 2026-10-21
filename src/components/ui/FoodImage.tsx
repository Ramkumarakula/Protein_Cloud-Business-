"use client";

import { useState } from "react";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/cn";

type Fallback = "plate" | "chip";

type FoodImageProps = {
  src: string;
  alt: string;
  /** Text shown inside the fallback when the file is missing. */
  label: string;
  accent?: string;
  fallback?: Fallback;
  sizes?: string;
  priority?: boolean;
  className?: string;
  draggable?: boolean;
};

const warned = new Set<string>();
function warnMissing(src: string) {
  if (process.env.NODE_ENV !== "development" || warned.has(src)) return;
  warned.add(src);
  console.warn(
    `[FoodImage] Missing image ${src}. Showing a placeholder. See public/food/README.md`,
  );
}

/**
 * Renders a food image from public/food/, preferring WebP variants of a PNG.
 * If the file does not exist (or fails to load) it renders a CSS placeholder so the
 * layout and animations keep working: a soft accent circle for plates and sandwiches,
 * or a rounded name chip for builder items.
 */
export function FoodImage({
  src,
  alt,
  label,
  accent = "#DEDCD7",
  fallback = "plate",
  sizes = "100vw",
  priority = false,
  className,
  draggable = false,
}: FoodImageProps) {
  const resolved = resolveImage(src);
  const [failed, setFailed] = useState(false);

  if (!resolved || failed) {
    warnMissing(src);
    return fallback === "chip" ? (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "text-ink flex aspect-square w-full items-center justify-center rounded-full border-2 border-dashed p-2 text-center text-[11px] leading-tight font-medium",
          className,
        )}
        style={{ borderColor: accent, background: `${accent}22` }}
      >
        {label}
      </span>
    ) : (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "font-display text-ink/80 flex aspect-square w-full items-center justify-center rounded-full text-center text-2xl font-extrabold tracking-tight uppercase",
          className,
        )}
        style={{
          background: `radial-gradient(circle at 50% 45%, #fff 0 52%, ${accent}55 53% 60%, ${accent}22 61%)`,
          boxShadow: "var(--shadow-plate)",
        }}
      >
        {label}
      </span>
    );
  }

  const common = {
    draggable,
    decoding: "async" as const,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
    onError: () => setFailed(true),
    className: cn("block h-auto w-full select-none", className),
  };

  if (resolved.kind === "svg") {
    return <img {...common} alt={alt} src={resolved.src} width={600} height={600} />;
  }
  return (
    <img
      {...common}
      alt={alt}
      src={resolved.src}
      srcSet={resolved.srcSet}
      sizes={sizes}
      width={resolved.width}
      height={resolved.height}
    />
  );
}
