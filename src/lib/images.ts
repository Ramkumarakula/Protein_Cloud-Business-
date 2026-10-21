import manifest from "@/data/image-manifest.json";
import { withBasePath } from "@/lib/paths";

type RasterEntry = {
  type: "raster";
  width: number;
  height: number;
  variants: { width: number; src: string }[];
};
type SvgEntry = { type: "svg" };
type ManifestEntry = RasterEntry | SvgEntry;

const entries = manifest as Record<string, ManifestEntry>;

export type ResolvedImage =
  | { kind: "raster"; src: string; srcSet: string; width: number; height: number }
  | { kind: "svg"; src: string };

/**
 * Resolve a public image path to what actually exists in public/food/.
 * A PNG with the same base name always wins over an SVG, so dropping
 * public/food/items/broccoli.png replaces broccoli.svg with no code change.
 * Returns null when nothing exists, so callers render the CSS fallback.
 */
export function resolveImage(src: string): ResolvedImage | null {
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  for (const candidate of [`${base}.png`, `${base}.jpg`, `${base}.jpeg`, src]) {
    const entry = entries[candidate];
    if (!entry) continue;
    if (entry.type === "svg") return { kind: "svg", src: withBasePath(candidate) };
    const sorted = [...entry.variants].sort((a, b) => a.width - b.width);
    return {
      kind: "raster",
      src: withBasePath(sorted[sorted.length - 1].src),
      srcSet: sorted.map((v) => `${withBasePath(v.src)} ${v.width}w`).join(", "),
      width: entry.width,
      height: entry.height,
    };
  }
  return null;
}
