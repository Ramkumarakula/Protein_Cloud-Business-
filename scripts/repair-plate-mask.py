"""Cut a round plate out of its photo without losing pale rim sections.

rembg sometimes mistakes a light grey rim for the white background and bites an arc out
of the plate. Plates are round, so this fits an ellipse to the intact part of the rim and
unions it with the rembg mask: missing rim comes back, nothing outside the plate is added.

Usage: python scripts/repair-plate-mask.py <source photo> <output png> [--check]
  --check  only report how much rim was missing, write nothing
"""

import sys

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

SIZE, PAD = 1600, 0.02


def fit_rim(alpha: np.ndarray):
    """Fit an ellipse to the rim, ignoring contour points that sit inside it (bitten arcs)."""
    mask = (alpha > 128).astype(np.uint8)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = max(contours, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
    keep = pts
    for _ in range(6):
        (cx, cy), (w, h), ang = cv2.fitEllipse(keep)
        # Normalised radial distance of every contour point from the fitted ellipse.
        t = np.deg2rad(ang)
        dx, dy = pts[:, 0] - cx, pts[:, 1] - cy
        u = dx * np.cos(t) + dy * np.sin(t)
        v = -dx * np.sin(t) + dy * np.cos(t)
        r = np.sqrt((u / (w / 2)) ** 2 + (v / (h / 2)) ** 2)
        # The true rim sits at r~1; a bitten arc sits well inside (r < 1).
        keep = pts[r > 0.985]
    return (cx, cy), (w, h), ang, r


def main() -> None:
    src, out = sys.argv[1], sys.argv[2]
    check_only = "--check" in sys.argv
    im = Image.open(src).convert("RGBA")
    cut = remove(im, session=new_session("isnet-general-use"), post_process_mask=True)
    alpha = np.array(cut.getchannel("A"))

    (cx, cy), (w, h), ang, r = fit_rim(alpha)
    inside = float((r < 0.97).mean())
    print(f"{src}: ellipse centre=({cx:.0f},{cy:.0f}) size=({w:.0f}x{h:.0f}) "
          f"rim points inside fit: {inside:.1%}")
    if check_only:
        return

    # Slightly shrink the ellipse so we never pick up the white backdrop at the edge, then feather.
    ell = np.zeros_like(alpha)
    cv2.ellipse(ell, ((cx, cy), (w * 0.996, h * 0.996), ang), 255, -1, cv2.LINE_AA)
    ell = cv2.GaussianBlur(ell, (0, 0), 1.2)
    merged = np.maximum(alpha, ell)
    merged[merged < 12] = 0

    rgb = np.array(im)[:, :, :3]
    out_im = Image.fromarray(np.dstack([rgb, merged]), "RGBA")
    out_im = out_im.crop(Image.fromarray(merged).getbbox())
    side = int(max(out_im.size) * (1 + PAD * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(out_im, ((side - out_im.width) // 2, (side - out_im.height) // 2), out_im)
    canvas.resize((SIZE, SIZE), Image.LANCZOS).save(out, optimize=True)
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
