"use client";

import { useEffect } from "react";
import { preload } from "react-dom";
import { plans } from "@/data/plans";
import { items } from "@/data/items";
import { sandwiches } from "@/data/sandwiches";
import { resolveImage } from "@/lib/images";

const PLATE_SIZES = "(min-width: 1024px) 42vw, (min-width: 768px) 60vw, 80vw";

/**
 * Elite is the LCP image: preloaded with high priority. The other plates preload right after.
 * Item and sandwich images warm the cache once the browser is idle.
 */
export function Preloader() {
  plans.forEach((plan, i) => {
    const img = resolveImage(plan.plate);
    if (img?.kind !== "raster") return;
    preload(img.src, {
      as: "image",
      imageSrcSet: img.srcSet,
      imageSizes: PLATE_SIZES,
      fetchPriority: i === 0 ? "high" : "low",
    });
  });

  useEffect(() => {
    const warm = () => {
      for (const src of [...items.map((i) => i.image), ...sandwiches.map((s) => s.image)]) {
        const img = resolveImage(src);
        if (!img) continue;
        const el = new Image();
        if (img.kind === "raster") {
          el.sizes = "300px";
          el.srcset = img.srcSet;
        }
        el.src = img.src;
      }
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 2000);
    return () => clearTimeout(t);
  }, []);

  return null;
}
