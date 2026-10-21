"""Turn the free-licence photos listed in scripts/item-sources.json into builder item cutouts.

For each item id: download (cached), optionally crop, remove the background with rembg,
trim, add a soft drop shadow, pad to a square and save public/food/items/<id>.png (600x600).
Also writes public/food/items/CREDITS.md from the same source list.

Usage: python scripts/make-item-cutouts.py <download cache dir> [item-id ...]
"""

import json
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
ITEMS_DIR = ROOT / "public" / "food" / "items"
SOURCES = json.loads((ROOT / "scripts" / "item-sources.json").read_text(encoding="utf-8"))
SIZE = 600
MARGIN = 0.07  # empty space around the food, as a share of the canvas
UA = {"User-Agent": "Mozilla/5.0 meal-plans-site item-cutouts"}


def fetch(item_id: str, url: str, cache: Path) -> Image.Image:
    path = cache / f"{item_id}.jpg"
    if not path.exists():
        req = urllib.request.Request(url, headers=UA)
        path.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return Image.open(path).convert("RGB")


def crop(im: Image.Image, box):
    if not box:
        return im
    w, h = im.size
    return im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))


def cutout(im: Image.Image, session, drop_dark: int = 0) -> Image.Image:
    cut = remove(im, session=session, post_process_mask=True)
    alpha = np.array(cut.getchannel("A"))
    if drop_dark:
        # Pale food on a dark plate: anything darker than this is plate, not food.
        lum = np.array(im.convert("L"))
        alpha[lum < drop_dark] = 0
    # Keep the largest blobs only: drops stray salt flakes and background specks.
    n, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 64).astype(np.uint8))
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = 1 + np.flatnonzero(areas >= areas.max() * 0.04)
        alpha = np.where(np.isin(labels, keep), alpha, 0).astype(np.uint8)
    alpha[alpha < 10] = 0
    cut.putalpha(Image.fromarray(alpha))
    return cut


def bright(im: Image.Image, threshold: int, hull: bool = False) -> Image.Image:
    """Pale food on a dark surface: a brightness threshold beats rembg here.

    hull=True wraps the result in its convex hull, restoring shaded sides of blocky food.
    """
    lum = np.array(im.convert("L"))
    mask = (lum > threshold).astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    if n > 1:
        mask = np.where(labels == 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA])), 255, 0).astype(np.uint8)
    # Fill holes (pepper flecks, shadows inside the food).
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if hull:
        contours = [cv2.convexHull(np.vstack(contours))]
    mask = cv2.drawContours(np.zeros_like(mask), contours, -1, 255, -1)
    if hull:
        # The hull also spans dark plate between blocks: drop anything clearly darker than food.
        mask[lum < threshold * 0.65] = 0
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        biggest = max(contours, key=cv2.contourArea)
        mask = cv2.drawContours(np.zeros_like(mask), [biggest], -1, 255, -1)
    mask = cv2.GaussianBlur(mask, (0, 0), 1.0)
    return Image.fromarray(np.dstack([np.array(im), mask]), "RGBA")


def ellipses(im: Image.Image, shapes) -> Image.Image:
    """White food on a white plate defeats rembg, so mask it with hand-placed ellipses.

    Each shape is [cx, cy, rx, ry, angle] with centre and radii as fractions of width/height.
    """
    w, h = im.size
    mask = np.zeros((h, w), np.uint8)
    for cx, cy, rx, ry, ang in shapes:
        cv2.ellipse(mask, ((cx * w, cy * h), (2 * rx * w, 2 * ry * h), ang), 255, -1, cv2.LINE_AA)
    mask = cv2.GaussianBlur(mask, (0, 0), max(w, h) / 900)
    return Image.fromarray(np.dstack([np.array(im), mask]), "RGBA")


def mound(im: Image.Image) -> Image.Image:
    """Shape a flat grain texture into a round top-down portion with soft, irregular edges."""
    side = min(im.size)
    tex = im.crop(((im.width - side) // 2, (im.height - side) // 2,
                   (im.width + side) // 2, (im.height + side) // 2)).resize((900, 900), Image.LANCZOS)
    yy, xx = np.mgrid[0:900, 0:900].astype(np.float32)
    ang = np.arctan2(yy - 450, xx - 450)
    rng = np.random.default_rng(3)
    # Wobbly outline: sum of a few low-frequency sine waves around the circle.
    wobble = sum(rng.uniform(4, 12) * np.sin(k * ang + rng.uniform(0, 6.28)) for k in (3, 5, 7, 11))
    radius = 380 + wobble
    dist = np.hypot(xx - 450, yy - 450)
    alpha = np.clip((radius - dist) / 6, 0, 1)
    # Dome shading lit from the top left: lighter crown, darker rim, so it reads as a heap.
    lx, ly = (xx - 450) / 400, (yy - 450) / 400
    shade = 1.12 - 0.42 * (dist / 400) ** 2 - 0.12 * (lx + ly)
    rgb = np.clip(np.array(tex, dtype=np.float32) * shade[..., None], 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]), "RGBA")


def finish(cut: Image.Image) -> Image.Image:
    cut = cut.crop(cut.getchannel("A").getbbox())
    inner = int(SIZE * (1 - 2 * MARGIN))
    scale = inner / max(cut.size)
    cut = cut.resize((max(1, round(cut.width * scale)), max(1, round(cut.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    x, y = (SIZE - cut.width) // 2, (SIZE - cut.height) // 2
    # Soft drop shadow from the item's own silhouette, nudged down.
    shadow_alpha = cut.getchannel("A").point(lambda a: int(a * 0.22))
    shadow = Image.new("RGBA", cut.size, (30, 30, 30, 0))
    shadow.putalpha(shadow_alpha)
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    layer.paste(shadow, (x, y + int(SIZE * 0.025)), shadow)
    canvas = Image.alpha_composite(canvas, layer.filter(ImageFilter.GaussianBlur(SIZE * 0.018)))
    canvas.alpha_composite(cut, (x, y))
    return canvas


def write_credits() -> None:
    lines = [
        "# Builder item photo credits",
        "",
        "Real food photos used for the Customize builder items. All are free for commercial use",
        "without attribution (CC0 / public domain or the Pexels License); credits are listed anyway.",
        "Generated by `scripts/make-item-cutouts.py` from `scripts/item-sources.json`.",
        "",
        "| Item | Photo | Author | Licence | Note |",
        "|---|---|---|---|---|",
    ]
    for item_id, s in SOURCES.items():
        author = s.get("author") or "not listed"
        lines.append(f"| `{item_id}` | [{s['title']}]({s['page']}) | {author} | {s['license']} | {s.get('note', '')} |")
    (ITEMS_DIR / "CREDITS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    cache = Path(sys.argv[1])
    cache.mkdir(parents=True, exist_ok=True)
    wanted = sys.argv[2:] or list(SOURCES)
    session = new_session("isnet-general-use")
    for item_id in wanted:
        src = SOURCES[item_id]
        im = crop(fetch(item_id, src["url"], cache), src.get("crop"))
        mode = src.get("mode")
        if mode == "mound":
            cut = mound(im)
        elif mode == "bright":
            cut = bright(im, src.get("threshold", 140), src.get("hull", False))
        elif mode == "ellipses":
            cut = ellipses(im, src["shapes"])
        else:
            cut = cutout(im, session, src.get("drop_dark", 0))
        out = ITEMS_DIR / f"{item_id}.png"
        finish(cut).save(out, optimize=True)
        print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
    write_credits()


if __name__ == "__main__":
    main()
