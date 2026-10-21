# Food images

All food photos live here. File names are fixed; the site looks for exactly these names.

| File | Used for | Spec |
|---|---|---|
| `plate-elite.png` | Hero plate for Elite | Top-down round plate, transparent background, 1600x1600 |
| `plate-protein.png` | Hero plate for Just Protein | Same spec |
| `plate-custom.png` | Empty plate for Customize and the plate builder | Same spec, empty plate |
| `sandwich-paneer.png` | Veg sandwich card | 3/4 angle, transparent background, 1200x1200 |
| `sandwich-chicken.png` | Non-Veg sandwich card | Same spec |
| `sandwich-egg.png` | Egg sandwich card | Same spec |
| `items/<id>.svg` / `items/<id>.png` | Builder ring items | Small cutouts, transparent, 600x600, `<id>` matches `src/data/items.ts` |
| `wall.jpg` | Hero backdrop texture | 2400x1600, optional (not used yet) |

## Builder items

The 12 items are real photo cutouts (`items/<id>.png`) made from free-licence photos
(CC0 / public domain and the Pexels License; no attribution required). Sources, licences and
crop settings are in `scripts/item-sources.json`, and `items/CREDITS.md` lists them.
To rebuild them: `python scripts/make-item-cutouts.py <download cache folder>`.

Two items are stand-ins worth replacing with your own photos when you can:
`paneer` (it is fresh tofu, which looks the same) and `quinoa` (free quinoa photos are only
flat grain textures, so the script shapes one into a portion).

To swap any item, overwrite `items/<id>.png` with a transparent cutout (600x600). The flat
SVG illustrations (`items/<id>.svg`, from `scripts/generate-item-svgs.py`) stay as fallbacks:
delete a PNG and the site uses its SVG automatically. Item ids:

`grilled-chicken`, `paneer`, `boiled-eggs`, `brown-rice`, `quinoa`, `sweet-potato`,
`broccoli`, `spinach`, `bell-peppers`, `apple`, `papaya`, `berries`

## Plates

`plate-elite.png` was re-cut with `scripts/repair-plate-mask.py`, which fits an ellipse to the
plate rim so pale rim sections are never removed with the background.

## What happens on build

`scripts/optimise-images.mjs` runs before every build. It writes WebP copies (alpha kept) at
1600/1000/600/300 px wide (never wider than the source) next to each PNG and records what
exists in
`src/data/image-manifest.json`. If a file is missing the site shows a placeholder instead
(a soft accent circle for plates and sandwiches, a name chip for items) and never breaks.

The generated `*-1600.webp` / `*-1000.webp` / `*-600.webp` / `*-300.webp` files are
git-ignored.
Keep this folder under 40 MB.
