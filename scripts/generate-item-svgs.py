"""Generate the flat illustrated item cutouts in public/food/items/*.svg.

One shared style: 200x200 viewBox, flat fills, one darker shade plane per object,
a soft white highlight, and the same ground shadow under every item.
Run: python scripts/generate-item-svgs.py
Drop a <id>.png next to an SVG to replace it with a real photo; the site prefers PNGs.
"""

import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "food" / "items"
SHADOW = '<ellipse cx="100" cy="170" rx="64" ry="10" fill="#1E1E1E" opacity=".09"/>'


def svg(label: str, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="600" height="600" '
        f'role="img" aria-label="{label}">\n{SHADOW}\n{body.strip()}\n</svg>\n'
    )


DOME_BACK = "M30 152c0-52 30-88 70-88s70 36 70 88c-20 10-120 10-140 0z"
DOME_FRONT = "M38 146c2-46 28-76 62-76s58 30 62 72c-24 8-104 10-124 4z"


def grains(colors: list[str], count: int, rx: float, ry: float, seed: int) -> str:
    rnd = random.Random(seed)
    out = []
    while len(out) < count:
        x, y = rnd.uniform(36, 164), rnd.uniform(70, 148)
        if ((x - 100) / 62) ** 2 + ((y - 148) / 78) ** 2 > 1:
            continue
        a = rnd.uniform(0, 180)
        out.append(
            f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx}" ry="{ry}" '
            f'transform="rotate({a:.0f} {x:.1f} {y:.1f})" fill="{rnd.choice(colors)}"/>'
        )
    return "\n".join(out)


def mound(back: str, front: str, grain_colors: list[str], count: int, rx: float, ry: float, hl: str) -> str:
    return f"""
<path d="{DOME_BACK}" fill="{back}"/>
<path d="{DOME_FRONT}" fill="{front}"/>
{grains(grain_colors, count, rx, ry, seed=7)}
<path d="M64 94c8-10 18-16 30-18" stroke="{hl}" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
"""


def cubes(top: str, left: str, right: str, spots: list[str], edge: str | None) -> str:
    edge_path = (
        f'<path d="M0 0 33-15 66 0" stroke="{edge}" stroke-width="4" fill="none" stroke-linejoin="round"/>'
        if edge
        else ""
    )
    return f"""
<defs><g id="cube">
<path d="M0 0 33-15 66 0 33 15z" fill="{top}"/>
<path d="M0 0 33 15v35L0 35z" fill="{left}"/>
<path d="M66 0 33 15v35l33-15z" fill="{right}"/>
{edge_path}
<circle cx="18" cy="21" r="3.4" fill="{spots[0]}" opacity=".75"/>
<circle cx="48" cy="29" r="3" fill="{spots[0]}" opacity=".65"/>
<circle cx="28" cy="-2" r="2.8" fill="{spots[1]}" opacity=".7"/>
<circle cx="42" cy="4" r="2.4" fill="{spots[1]}" opacity=".6"/>
</g></defs>
<use href="#cube" transform="translate(28 114)"/>
<use href="#cube" transform="translate(106 114)"/>
<use href="#cube" transform="translate(67 66)"/>
"""


def half_egg(cx: float, cy: float, rot: float, s: float) -> str:
    return f"""
<g transform="rotate({rot} {cx} {cy})">
<ellipse cx="{cx}" cy="{cy}" rx="{40 * s}" ry="{50 * s}" fill="#E9E0CC"/>
<ellipse cx="{cx - 2}" cy="{cy - 4}" rx="{37 * s}" ry="{47 * s}" fill="#FFFDF7"/>
<circle cx="{cx}" cy="{cy + 6}" r="{23 * s}" fill="#EE9C17"/>
<circle cx="{cx - 2}" cy="{cy + 3}" r="{17 * s}" fill="#F7BE45"/>
<circle cx="{cx - 8}" cy="{cy - 3}" r="{5 * s}" fill="#FFE29A"/>
</g>"""


def berry(cx: float, cy: float, r: float) -> str:
    return f"""
<g><circle cx="{cx}" cy="{cy}" r="{r}" fill="#34457F"/>
<circle cx="{cx - 4}" cy="{cy - 4}" r="{r - 3}" fill="#4A5DA8"/>
<path d="M{cx - 6} {cy - 4}l6-4 6 4-6 4z" fill="#29355F"/>
<circle cx="{cx - r * 0.5}" cy="{cy - r * 0.55}" r="{r * 0.18:.1f}" fill="#A8B4E0" opacity=".75"/></g>"""


def raspberry(cx: float, cy: float) -> str:
    dark, light = [], []
    for row, (dy, xs) in enumerate([(-14, [-7, 7]), (-2, [-14, 0, 14]), (10, [-7, 7]), (21, [0])]):
        for dx in xs:
            dark.append(f'<circle cx="{cx + dx}" cy="{cy + dy}" r="8.5"/>')
            light.append(f'<circle cx="{cx + dx - 2}" cy="{cy + dy - 2}" r="4"/>')
    return f'<g fill="#B8243F">{"".join(dark)}</g><g fill="#E8566C" opacity=".9">{"".join(light)}</g>'


ITEMS: dict[str, tuple[str, str]] = {
    "grilled-chicken": (
        "Grilled chicken",
        """
<defs><clipPath id="c"><path d="M34 118C28 82 66 48 116 46c44-2 62 30 54 62-8 32-46 50-84 48-28-2-48-14-52-38z"/></clipPath></defs>
<path d="M34 118C28 82 66 48 116 46c44-2 62 30 54 62-8 32-46 50-84 48-28-2-48-14-52-38z" fill="#D58F52"/>
<path d="M38 110C36 80 70 52 116 50c40-2 56 26 50 54-6 26-40 40-76 38-30-2-50-14-52-32z" fill="#ECB477"/>
<g clip-path="url(#c)" stroke="#8C4A22" stroke-width="7" stroke-linecap="round" opacity=".85">
<path d="M52 150 96 44"/><path d="M80 156 124 46"/><path d="M108 158 150 52"/><path d="M136 150 172 66"/></g>
<path d="M68 72c14-10 34-14 50-12" stroke="#FFF3DF" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>
<circle cx="64" cy="110" r="3" fill="#4F7A2E"/><circle cx="120" cy="124" r="3" fill="#4F7A2E"/><circle cx="146" cy="90" r="2.5" fill="#4F7A2E"/>
""",
    ),
    "paneer": ("Paneer", cubes("#FBF0D6", "#EBD3A2", "#DDBD82", ["#B66A2E", "#C98543"], None)),
    "boiled-eggs": (
        "Boiled eggs",
        half_egg(70, 108, -12, 1.0)
        + half_egg(136, 104, 14, 0.95)
        + '<g fill="#3B2A1A"><circle cx="74" cy="118" r="1.8"/><circle cx="140" cy="112" r="1.8"/><circle cx="130" cy="117" r="1.5"/></g>',
    ),
    "brown-rice": (
        "Brown rice",
        mound("#A9784C", "#C4935F", ["#ECCDA3", "#DDB37E", "#BF8E5B"], 110, 6.5, 2.6, "#FFF1DC"),
    ),
    "quinoa": (
        "Quinoa",
        mound(
            "#D6C08F",
            "#EBDDB5",
            ["#F8F0DA", "#E0CB98", "#F8F0DA", "#F8F0DA", "#B8483A", "#5A3A2A"],
            200,
            3.6,
            3,
            "#FFFFFF",
        ),
    ),
    "sweet-potato": (
        "Sweet potato",
        cubes("#F7A55A", "#E57F2E", "#C9661F", ["#9E4A1C", "#C9661F"], "#8C3F1A"),
    ),
    "broccoli": (
        "Broccoli",
        """
<path d="M86 104h28l8 56c-12 6-32 6-44 0z" fill="#8DBB5E"/><path d="M100 104h14l8 56c-6 3-14 4-20 4z" fill="#77A64C"/>
<path d="M94 118 70 100M108 120l26-18" stroke="#8DBB5E" stroke-width="12" stroke-linecap="round"/>
<circle cx="62" cy="92" r="26" fill="#2F7A3E"/><circle cx="138" cy="92" r="26" fill="#2F7A3E"/>
<circle cx="100" cy="70" r="34" fill="#2F7A3E"/><circle cx="76" cy="66" r="24" fill="#3E9150"/><circle cx="124" cy="68" r="24" fill="#3E9150"/>
<circle cx="100" cy="56" r="24" fill="#4CA35C"/><circle cx="58" cy="88" r="18" fill="#3E9150"/><circle cx="142" cy="88" r="18" fill="#3E9150"/>
<circle cx="90" cy="48" r="9" fill="#7CC27B" opacity=".7"/><circle cx="68" cy="58" r="7" fill="#7CC27B" opacity=".6"/><circle cx="50" cy="80" r="6" fill="#7CC27B" opacity=".5"/>
""",
    ),
    "spinach": (
        "Spinach",
        """
<g transform="rotate(-24 82 104)">
<path d="M82 150C44 130 36 76 82 38c46 38 38 92 0 112z" fill="#2F7A3E"/><path d="M82 146C52 126 46 80 82 44z" fill="#3E9150"/>
<path d="M82 168V52" stroke="#86C27A" stroke-width="5" stroke-linecap="round"/>
<path d="M82 120 62 102M82 96 66 82M82 120l18-16M82 96l14-12" stroke="#86C27A" stroke-width="3" stroke-linecap="round" opacity=".8"/>
</g>
<g transform="rotate(22 124 108)">
<path d="M124 152C90 134 82 86 124 52c42 34 34 82 0 100z" fill="#357F44"/><path d="M124 148C98 130 92 92 124 58z" fill="#47A057"/>
<path d="M124 170V64" stroke="#93CB86" stroke-width="5" stroke-linecap="round"/>
<path d="M124 124 106 108M124 100 110 88M124 124l16-14M124 100l12-10" stroke="#93CB86" stroke-width="3" stroke-linecap="round" opacity=".8"/>
</g>
""",
    ),
    "bell-peppers": (
        "Bell peppers",
        """
<path d="M86 56c-10-8-30-8-40 4-14 16-14 50-6 74 6 18 20 28 32 22 6 6 22 6 28 0 12 6 26-4 32-22 8-24 8-58-6-74-10-12-30-12-40-4z" fill="#C83A2C"/>
<path d="M86 56c-10-8-30-8-40 4-14 16-14 50-6 74 6 18 20 28 32 22 6 4 10 5 14 5V56z" fill="#E5523F"/>
<path d="M72 64c-6 24-6 56 0 86M100 64c6 24 6 56 0 86" stroke="#A92E22" stroke-width="4" stroke-linecap="round" fill="none" opacity=".55"/>
<path d="M54 76c-4 12-4 26-2 38" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>
<ellipse cx="86" cy="56" rx="18" ry="7" fill="#3E8E3E"/>
<path d="M86 54c0-12 4-20 14-26" stroke="#4E9A43" stroke-width="9" stroke-linecap="round" fill="none"/>
<g transform="translate(146 140) rotate(-10)">
<path d="M0-30c10-4 20 2 24 10 8 10 8 24 0 34-6 8-16 10-24 8-8 2-18 0-24-8-8-10-8-24 0-34 4-8 14-14 24-10z" fill="#D9A21A"/>
<path d="M0-21c7-3 14 2 17 7 6 7 6 17 0 24-4 5-11 7-17 5-6 2-13 0-17-5-6-7-6-17 0-24 3-5 10-10 17-7z" fill="#FFF4D2"/>
<path d="M0-30c10-4 20 2 24 10 8 10 8 24 0 34" stroke="#F6C437" stroke-width="5" fill="none" stroke-linecap="round"/>
</g>
""",
    ),
    "apple": (
        "Apple",
        """
<g transform="translate(-6 0) scale(.92)">
<path d="M84 54c-34-14-62 12-60 50 2 36 26 64 48 64 10 0 14-4 24-4s14 4 24 4c22 0 46-28 48-64 2-38-26-64-60-50-8 3-16 3-24 0z" fill="#C93A33"/>
<path d="M84 60c-30-10-54 12-52 44 2 30 22 54 40 56 8 0 14-4 24-4V64c-4 0-8-2-12-4z" fill="#E0524A"/>
<path d="M96 56c0-12 2-20 8-28" stroke="#6B4228" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M104 42c8-14 26-16 34-10-6 12-22 18-34 10z" fill="#5DAE4E"/>
<path d="M48 86c4-10 12-16 20-18" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
</g>
<g transform="translate(150 160) scale(.8)">
<path d="M-34 0a34 34 0 0 1 68 0z" fill="#C93A33"/><path d="M-30 0a30 30 0 0 1 60 0z" fill="#FCEFCB"/>
<path d="M-30 0h60" stroke="#E9D3A0" stroke-width="3"/>
<path d="M-8-9c2-6 5-6 6 0M3-9c2-6 5-6 6 0" stroke="#5A3A22" stroke-width="4" stroke-linecap="round" fill="none"/>
</g>
""",
    ),
    "papaya": (
        "Papaya",
        """
<g transform="rotate(-28 100 100)">
<path d="M100 32c34 0 50 30 50 66 0 40-22 66-50 66s-50-26-50-66c0-36 16-66 50-66z" fill="#6E9E3A"/>
<path d="M100 38c30 0 44 28 44 60 0 36-20 60-44 60s-44-24-44-60c0-32 14-60 44-60z" fill="#F5A04C"/>
<path d="M100 44c26 0 38 24 38 54 0 32-16 52-38 52" fill="#EE8434" opacity=".5"/>
<path d="M100 72c14 0 22 14 22 32s-8 34-22 34-22-16-22-34 8-32 22-32z" fill="#DE6428"/>
<g fill="#2B2420"><circle cx="94" cy="88" r="5"/><circle cx="106" cy="92" r="5"/><circle cx="96" cy="102" r="5"/><circle cx="108" cy="106" r="5"/><circle cx="94" cy="116" r="5"/><circle cx="106" cy="120" r="5"/><circle cx="100" cy="129" r="4.5"/></g>
<g fill="#7A6A60"><circle cx="92.5" cy="86.5" r="1.6"/><circle cx="104.5" cy="90.5" r="1.6"/><circle cx="94.5" cy="100.5" r="1.6"/><circle cx="106.5" cy="104.5" r="1.6"/><circle cx="92.5" cy="114.5" r="1.6"/></g>
<path d="M70 72c4-12 12-20 22-24" stroke="#FFE2BF" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>
</g>
""",
    ),
    "berries": (
        "Berries",
        """
<path d="M64 62c-26 2-40 26-36 48 4 26 26 46 40 52 14-6 34-28 36-54 2-22-14-48-40-46z" fill="#D63A48"/>
<path d="M64 66c-22 2-32 24-30 42 2 20 18 38 30 46V66z" fill="#EC5662"/>
<g fill="#FBE59A"><ellipse cx="50" cy="94" rx="2" ry="3"/><ellipse cx="66" cy="88" rx="2" ry="3"/><ellipse cx="84" cy="96" rx="2" ry="3"/><ellipse cx="56" cy="114" rx="2" ry="3"/><ellipse cx="74" cy="112" rx="2" ry="3"/><ellipse cx="64" cy="132" rx="2" ry="3"/><ellipse cx="88" cy="120" rx="2" ry="3"/></g>
<path d="M42 66c8-2 14 2 22 8 6-6 14-10 22-6-4-10-12-14-22-12-8-4-18 0-22 10z" fill="#4E9A43"/>
"""
        + raspberry(122, 72)
        + berry(152, 112, 20)
        + berry(122, 142, 22),
    ),
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item_id, (label, body) in ITEMS.items():
        (OUT / f"{item_id}.svg").write_text(svg(label, body), encoding="utf-8")
        print(f"wrote {item_id}.svg")


if __name__ == "__main__":
    main()
