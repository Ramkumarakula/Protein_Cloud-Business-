# Meal Plans Website - Project Plan

> This file is the single source of truth for building this website.
> Claude Code: read this file fully before writing any code. Every decision below is intentional.
> If something is unclear, follow the "Defaults when unsure" section rather than guessing.

> **Skills to use:** `/frontend-design` for every UI component and layout decision. `/webapp-testing` (Playwright) before marking any checklist item done. If a skill is not installed, say so once and continue without it.

> **Hosting target:** GitHub Pages (static). See Section 10.

> **Images:** The owner will put all food photos in `public/food/`. File names are fixed in Section 8. If a file is missing, use the fallback described there and keep going. Never block the build on a missing image.

---

## 1. Project Summary

A single-page, interactive website for a healthy meal-plan business. The site sells **three plans**:

| Plan key  | Display name     | What it is                                                                                                                   | Accent colour         |
| --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `elite`   | **Elite**        | The most premium plan. Includes everything: all vitamins, protein, fibre and good fruits. A complete balanced plate.         | Warm orange `#F2994A` |
| `protein` | **Just Protein** | Concentrates on protein and fibre. For people training or cutting.                                                           | Deep red `#E05A5A`    |
| `custom`  | **Customize**    | The customer builds their own plate. An empty plate with food items arranged around it; the customer taps items to add them. | Fresh green `#4CAF7A` |

There is also a separate **Sandwiches** section with three options: **Veg (Paneer)**, **Non-Veg (Chicken)** and **Egg**.

The centrepiece is the **Plan Switcher** hero (Section 6), which must copy the feel of the reference recording: tapping a plan makes the current plate glide out, the next plate glide in on a curved path, the headline letters stagger out and in, and the info card changes colour. Smooth, physical, no hard cuts.

---

## 2. Business Details (editable)

All business details live in **one file**: `src/config/site.ts`. Never hardcode these anywhere else.

```ts
// src/config/site.ts
export const siteConfig = {
  name: "RK Protein Cloud", // OWNER: replace
  tagline: "Real food. Planned for you.",
  description:
    "Fresh, balanced meal plans delivered daily. Choose Elite, Just Protein, or build your own plate.",
  location: { city: "Hyderabad", state: "Telangana", country: "India" }, // OWNER: confirm
  contact: {
    phoneDisplay: "+91 00000 00000", // OWNER: replace
    phoneE164: "+919059257599", // OWNER: replace
    whatsapp: "9059257599", // OWNER: replace
    email: "ramkumarafw@gmail.com", // OWNER: replace
  },
  social: { instagram: "", facebook: "", youtube: "" },
  nav: [
    { label: "Plans", href: "#plans" },
    { label: "Sandwiches", href: "#sandwiches" },
    { label: "How it works", href: "#how" },
    { label: "Contact", href: "#contact" },
  ],
  url: "https://example.com", // OWNER: update when domain is final
} as const;
```

Plan content lives in `src/data/plans.ts`, sandwich content in `src/data/sandwiches.ts`, custom-plate items in `src/data/items.ts`. Each file starts with `// OWNER: edit the text, prices and items here`.

---

## 3. Tech Stack

| Concern         | Choice                                                      | Reason                                                           |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Framework       | **Next.js 15 (App Router), TypeScript**, `output: "export"` | Static, no server, GitHub Pages friendly                         |
| Styling         | **Tailwind CSS v4**                                         | Fast, consistent tokens                                          |
| Animation       | **Framer Motion** (`motion/react`)                          | `AnimatePresence`, `layoutId`, spring physics for the plate swap |
| Smooth scroll   | **Lenis**                                                   | Premium feel on scroll                                           |
| Icons           | **lucide-react**                                            | Small, tree-shakeable                                            |
| Fonts           | `next/font` (self-hosted at build)                          | No runtime third-party calls                                     |
| Package manager | `pnpm`                                                      | Fast, strict                                                     |
| Lint/format     | ESLint (next/core-web-vitals) + Prettier                    | Zero warnings on build                                           |
| Testing         | Playwright via `/webapp-testing`                            | Verify the switcher actually animates and is keyboard reachable  |
| Hosting         | GitHub Pages via GitHub Actions                             | Free, static                                                     |

Required `next.config.ts` (same rules as any GitHub Pages Next.js site):

```ts
import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};
export default nextConfig;
```

All asset paths go through `withBasePath()` from `src/lib/paths.ts`. Add `public/.nojekyll`.

No CMS, no database, no auth, no backend, no analytics in this phase.

---

## 4. Design Direction (from the reference recording)

The reference is a food app landing page photographed on a kitchen wall: a soft grey wall, a large plate top-down on the left, giant two-line headline, a floating white info card on the right, a thumbnail carousel underneath, and a row of round icon buttons at the bottom. Reproduce the **feel**, not the pixel layout.

### 4.1 Visual language

- **Backdrop:** a soft light grey wall texture (`#E9E9E7` to `#F2F1EE`) with a large, blurred, low-opacity coloured arc behind the plate. The arc colour is the active plan's accent at 18% opacity and crossfades when the plan changes.
- **Plate:** a large circular food photo, top-down, with a soft drop shadow (`0 30px 60px rgba(0,0,0,0.18)`). It sits slightly above the headline baseline and overlaps the left edge on desktop.
- **Headline:** two lines. Line one light weight, uppercase, letter-spaced (the plan's eyebrow word). Line two heavy black weight, uppercase, very large (the plan name). Example: `THE` / `ELITE`.
- **Eyebrow above headline:** tiny text like "#1 Most loved plan".
- **Two text actions under the headline:** "Play video" and "Order now" with small icons, no buttons, just text with icons.
- **Info card (right):** white, rounded 24px, soft shadow. Tabs "Overview" and "Ingredients". A big rating number in a rounded square tinted with the plan accent. Plan title, one-line subtitle, 2 to 3 lines of description, price per day/week, a "likes" pill and a thumbs-down pill.
- **Plan selector row:** horizontal row of circular thumbnails with a label under each. The active one sits inside a tall white rounded pill (this pill is a `layoutId` element that slides between items). Left/right chevrons on each end.
- **Bottom icon row:** 5 round glass buttons (menu, drinks, chat, profile, mic). Decorative in Phase 1 except menu, which scrolls to Sandwiches.
- **Vertical dotted page indicator** on the far left (3 dots, one per plan).
- Rounded everything, warm neutrals, lots of air.

### 4.2 Colour tokens (Tailwind `@theme`)

```
--color-wall:      #ECEBE8
--color-wall-deep: #DEDCD7
--color-ink:       #1E1E1E
--color-muted:     #7A7A78
--color-card:      #FFFFFF
--color-elite:     #F2994A
--color-protein:   #E05A5A
--color-custom:    #4CAF7A
--color-paneer:    #F5B544
--color-chicken:   #D9663C
--color-egg:       #F2C94C
```

### 4.3 Typography

- Headline: **Outfit** or **Plus Jakarta Sans**. Line one weight 300, line two weight 800. Size `clamp(2.75rem, 8vw, 7rem)`, line-height 0.9, letter-spacing -0.02em for the heavy line, +0.08em for the light line.
- Body/UI: **Inter**, 400/500.
- Eyebrow: 12px, weight 500, muted colour.

### 4.4 Motion principles

- Springs, not ease curves, for anything that moves position: `{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }`.
- Everything below the hero fades and rises 24px on first scroll into view.
- Respect `prefers-reduced-motion`: swap becomes a 200ms crossfade, no rotation, no letter stagger.

---

## 5. Page Structure

Single page with anchored sections:

1. **Navbar** (logo left, nav center, search icon and menu icon right; mobile drawer)
2. **Plan Switcher hero** `#plans` (Section 6) with the three plans
3. **Custom Plate Builder** `#build` (Section 7). Only shown expanded when the `custom` plan is active, otherwise collapsed to a one-line prompt "Want to build your own? Pick Customize above."
4. **Sandwiches** `#sandwiches` (Section 7B)
5. **How it works** `#how` (Choose plan, We cook fresh, Delivered daily, Track and tweak) on a horizontal line
6. **Why us** (4 small cards: fresh daily, macro-balanced, no preservatives, change anytime)
7. **Testimonials** (3 placeholder quotes, name and area)
8. **Pricing summary** (3 columns from `plans.ts`, with "Order on WhatsApp" buttons)
9. **FAQ** (6 questions, accessible accordion)
10. **Contact** `#contact` (WhatsApp, call, email, simple form with mailto fallback)
11. **Footer**

---

## 6. Plan Switcher Hero (the core of the site)

Component: `src/components/hero/PlanSwitcher.tsx`. State: `activePlan: "elite" | "protein" | "custom"` with `direction: 1 | -1` (which way the user moved, so the exit and enter paths mirror correctly).

### 6.1 Data shape (`src/data/plans.ts`)

```ts
export type Plan = {
  key: "elite" | "protein" | "custom";
  eyebrow: string; // "#1 Most loved plan"
  titleLight: string; // "THE"
  titleHeavy: string; // "ELITE"
  subtitle: string; // "Everything your body needs, every day"
  description: string; // 2-3 lines
  includes: string[]; // chips: "Vitamins", "Protein", "Fibre", "Fruits"
  rating: string; // "4.9"
  likes: number;
  pricePerDay: number; // INR
  pricePerWeek: number; // INR
  accent: string; // hex
  plate: string; // "/food/plate-elite.png"
  thumb: string; // "/food/thumb-elite.png" (falls back to plate)
  ctaLabel: string; // "Order Elite" | "Build my plate"
};
```

### 6.2 The transition (must match the recording)

Triggered by: clicking a thumbnail, the chevrons, the left dot indicator, swiping left/right on touch, or pressing ArrowLeft/ArrowRight when the hero has focus.

All of the following run **at the same time**, total duration about 700ms:

1. **Plate exit:** the current plate moves to `x: -40% * direction, y: -60%`, `rotate: -25deg * direction`, `scale: 0.85`, `opacity: 0` with the spring above. It should feel like it slides up and off the wall.
2. **Plate enter:** the new plate starts at `x: +60% * direction, y: -70%`, `rotate: +30deg * direction`, `scale: 0.8`, `opacity: 0` and springs to `x: 0, y: 0, rotate: 0, scale: 1, opacity: 1`. Implement the curved path by animating `x` and `y` with slightly different spring settings (give `y` a lower stiffness, around 90) so the plate arcs rather than moving in a straight line. While it is moving, it is above the headline (z-index), exactly like the recording where the plate passes over the text.
3. **Headline:** split `titleLight` and `titleHeavy` into characters. On exit, characters fade out and move down 12px with a 20ms stagger from the right end. On enter, they fade in and move up from 12px with a 25ms stagger from the left end. Use `AnimatePresence mode="popLayout"` keyed by `plan.key`.
4. **Info card:** the card itself stays. Inside it, the rating square changes background to the new accent with a 400ms colour tween, the number crossfades, and the text block crossfades (150ms out, 250ms in, with a 100ms delay).
5. **Background arc:** colour tweens to the new accent over 500ms.
6. **Selector pill:** the white tall pill behind the active thumbnail is a `motion.div` with `layoutId="plan-pill"`, so it slides to the new thumbnail with the spring.
7. **Dot indicator:** active dot grows and darkens.

Customize plan is special: when it becomes active, the plate image is the **empty plate** and the food items from `items.ts` fade in around it (staggered 40ms, scale from 0.6) 300ms after the plate lands. They are the same images used by the Plate Builder in Section 7. When leaving Customize, items fade out first (150ms) then the plate exits.

Preload all three plate images and all item images on first paint (hidden `<link rel="preload">` for plates; items can load after idle). The first visible plate is `elite`.

### 6.3 Layout

- Desktop (≥1024px): 12-col grid. Plate spans cols 1-5 and overlaps left edge by about 8%. Headline cols 5-9. Info card cols 9-12, sticky within the hero. Selector row under the headline spanning cols 2-9. Icon row below that. Dot indicator in the left gutter.
- Tablet (768-1023): plate centred top, headline below, info card full width below, selector row, icon row.
- Mobile (<768): plate 70vw centred, headline centred, selector row scrollable with snap, info card becomes a bottom sheet style card. Swipe gestures on the plate switch plans.
- Hero height: `min-h-svh` on desktop, natural height on mobile.

---

## 7. Custom Plate Builder (`#build`)

Component: `src/components/builder/PlateBuilder.tsx`.

- Data in `src/data/items.ts`:

```ts
export type FoodItem = {
  id: string;
  name: string; // "Grilled chicken"
  group: "protein" | "carb" | "veg" | "fruit" | "extra";
  image: string; // "/food/items/grilled-chicken.png" (transparent PNG cutout)
  kcal: number;
  protein: number; // grams
  price: number; // INR add-on
};
```

- Ship 12 placeholder items (3 per group, plus 0 extras is fine): e.g. grilled chicken, paneer cubes, boiled eggs, brown rice, quinoa, sweet potato, broccoli, spinach, bell peppers, apple slices, papaya, berries.
- Layout: the empty plate in the centre (same image as the hero's custom plate), items arranged in a ring around it. On desktop the ring is a true circle (position each item with `transform: rotate(θ) translate(radius) rotate(-θ)`). On mobile the items become a horizontally scrollable chip row under the plate.
- Tap an item: it springs from its ring position onto the plate (use `layoutId` per item so the move is animated), lands at a slot position (up to 6 slots, pre-defined around the plate centre). Tap again on the plate to send it back.
- A floating summary chip under the plate: `N items · X kcal · Y g protein · ₹Z/day`, updates live.
- "Order this plate" button builds a WhatsApp message listing the chosen items.
- Fully keyboard accessible: each item is a `<button aria-pressed>`; the plate region has `aria-live="polite"` announcing additions.
- Limit 6 items with a gentle shake animation and message if a 7th is tapped.

---

## 7B. Sandwiches section (`#sandwiches`)

Component: `src/components/sections/Sandwiches.tsx`. Data in `src/data/sandwiches.ts`:

```ts
export type Sandwich = {
  key: "veg" | "nonveg" | "egg";
  name: string; // "Veg", "Non-Veg", "Egg"
  hero: string; // "Paneer", "Chicken", "Egg"
  description: string;
  image: string; // "/food/sandwich-paneer.png" etc.
  accent: string;
  price: number;
  tags: string[]; // "High protein", "Grilled", "No mayo"
};
```

- Section heading: light line "FRESH" and heavy line "SANDWICHES" in the same two-line style as the hero.
- Three large cards side by side (stack on mobile). Each card: the sandwich image overlapping the card's top edge, name, hero ingredient as a coloured chip, description, price, "Add to order" (WhatsApp link).
- Hover: card lifts 6px, image rotates 3deg and scales 1.05. Tap on mobile does the same briefly.
- Below the cards one line: "More fillings coming soon" from config, so the owner can add a 4th card later by adding an entry.

---

## 8. Image Files (owner supplies, fixed names)

All in `public/food/`. The owner will generate these with the prompts provided separately. Use exactly these names:

| File                   | Used for                                  | Spec                                                             |
| ---------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `plate-elite.png`      | Hero plate for Elite                      | Top-down round plate, **transparent background**, 1600x1600      |
| `plate-protein.png`    | Hero plate for Just Protein               | Same spec                                                        |
| `plate-custom.png`     | Empty plate for Customize and the Builder | Same spec, empty plate                                           |
| `sandwich-paneer.png`  | Veg sandwich card                         | 3/4 angle, transparent background, 1200x1200                     |
| `sandwich-chicken.png` | Non-Veg sandwich card                     | Same spec                                                        |
| `sandwich-egg.png`     | Egg sandwich card                         | Same spec                                                        |
| `items/*.png`          | Builder ring items                        | Small cutouts, transparent, 600x600, file names match `items.ts` |
| `wall.jpg`             | Hero backdrop texture                     | 2400x1600, optional                                              |

Rules:

- If a plate or sandwich file is missing, render a CSS-drawn placeholder (a soft circle with the plan accent and the plan name) so the layout and animations still work. Log one console warning in dev only.
- If `items/*.png` is missing, render a rounded chip with the item name instead.
- Thumbnails in the selector row reuse the plate images at 96px; do not require separate thumb files (the `thumb` field is optional).
- Run `scripts/optimise-images.mjs` (sharp) on prebuild to produce WebP at 1600/1000/600 widths. PNG transparency must be preserved (use WebP with alpha).

---

## 9. Security Requirements (non-negotiable)

- No `dangerouslySetInnerHTML`, no `eval`, no `new Function`, no string-built HTML.
- No secrets in the repo. Only `NEXT_PUBLIC_*` vars, `.env.example` committed, `.env*` ignored.
- Meta CSP in `layout.tsx` (GitHub Pages cannot set headers): `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`. Add `<meta name="referrer" content="strict-origin-when-cross-origin">` and a frame-buster script.
- Also provide `vercel.json` and `netlify.toml` with full headers (`X-Frame-Options: DENY`, `nosniff`, `Permissions-Policy`, HSTS) in case of a later move.
- External links: `rel="noopener noreferrer"`.
- All user input in the contact form and plate builder is validated with `zod` and passed through `encodeURIComponent` before it reaches a `wa.me` or `mailto:` URL. Honeypot field plus 3-second time trap.
- No third-party scripts. No remote images (`images.remotePatterns` empty).
- Pin exact dependency versions; `pnpm audit --prod --audit-level=high` must pass.
- GitHub Actions: official actions only, pinned major versions, minimal permissions. Dependabot weekly.
- `robots.txt`, `sitemap.xml`, `404.html`, `.gitignore`.

---

## 10. GitHub Pages Deployment

### 10.1 Owner setup (once)

1. Create a public repo (e.g. `meal-plans`). Settings > Pages > Source: **GitHub Actions**.
2. For a project repo set repository variable `NEXT_PUBLIC_BASE_PATH = /meal-plans`. For `<user>.github.io` or a custom domain leave it unset.
3. Custom domain: add `public/CNAME`, set DNS, tick Enforce HTTPS.

### 10.2 Workflow `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm audit --prod --audit-level=high
      - run: pnpm build
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ vars.NEXT_PUBLIC_BASE_PATH }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 10.3 Build rules

- `out/` must contain `.nojekyll`, `index.html`, `404.html`, `robots.txt`, `sitemap.xml`.
- Add `scripts/preview-pages.sh` (build then `npx serve out`) so the owner can check the base path locally.
- Keep `public/food/` under 40 MB total.

---

## 11. Performance and Accessibility

- Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
- The first plate (`elite`) is the LCP element: `<link rel="preload" as="image">` plus `fetchPriority="high"`. Other plates preload after it.
- Plate images are `<img>` with explicit width/height, WebP with alpha, `decoding="async"`.
- Plan switcher is fully keyboard operable: thumbnails are `<button role="tab" aria-selected>`, the group is `role="tablist"`, arrows keys move between tabs, the hero content region is `role="tabpanel"` with `aria-labelledby`.
- Announce plan changes via `aria-live="polite"`: "Showing Just Protein plan".
- Colour contrast 4.5:1 on all text over the wall background.
- `lang="en-IN"`, Open Graph and Twitter meta from `siteConfig`, `public/og.jpg` 1200x630.
- JSON-LD `Restaurant` or `FoodEstablishment` with `hasMenu` listing the three plans and three sandwiches, built from the data files.

---

## 12. Folder Structure

```
meal-plans/
  PROJECT_PLAN.md
  README.md
  .env.example
  .gitignore
  next.config.ts
  package.json
  tsconfig.json
  vercel.json
  netlify.toml
  .github/
    workflows/deploy.yml
    dependabot.yml
  scripts/
    optimise-images.mjs
    preview-pages.sh
  public/
    .nojekyll
    robots.txt
    sitemap.xml
    404.html
    og.jpg
    logo.svg
    food/
      README.md                 # the file-name table from Section 8
      plate-elite.png
      plate-protein.png
      plate-custom.png
      sandwich-paneer.png
      sandwich-chicken.png
      sandwich-egg.png
      wall.jpg
      items/
  src/
    app/        layout.tsx, page.tsx, globals.css, not-found.tsx
    config/     site.ts
    data/       plans.ts, sandwiches.ts, items.ts, faq.ts, testimonials.ts
    components/
      layout/   Navbar.tsx, Footer.tsx, SmoothScroll.tsx
      hero/     PlanSwitcher.tsx, Plate.tsx, SplitHeadline.tsx, InfoCard.tsx, PlanSelector.tsx, IconRow.tsx, DotIndicator.tsx, BackdropArc.tsx
      builder/  PlateBuilder.tsx, ItemRing.tsx, PlateSlot.tsx, SummaryChip.tsx
      sections/ Sandwiches.tsx, HowItWorks.tsx, WhyUs.tsx, Testimonials.tsx, Pricing.tsx, Faq.tsx, Contact.tsx
      ui/       Button.tsx, Chip.tsx, Card.tsx, Reveal.tsx, FoodImage.tsx (handles missing-file fallback)
    lib/        cn.ts, paths.ts, validation.ts, schema.ts, whatsapp.ts
    hooks/      useReducedMotion.ts, usePlanSwitcher.ts, useSwipe.ts
```

---

## 13. Build Checklist

### Phase 1

- [ ] Scaffold Next.js 15 + TS + Tailwind v4 + ESLint + Prettier + pnpm; GitHub Pages config; `.nojekyll`; `withBasePath`
- [ ] `.github/workflows/deploy.yml`, `dependabot.yml`
- [ ] `siteConfig`, `plans.ts`, `sandwiches.ts`, `items.ts`, `faq.ts`, `testimonials.ts` with realistic placeholder copy (Indian context, INR prices)
- [ ] `FoodImage` component with missing-file fallback; `public/food/README.md`
- [ ] Global styles, tokens, fonts, Lenis
- [ ] Navbar with mobile drawer and focus trap
- [ ] **PlanSwitcher** with the full transition from Section 6.2, including direction-aware paths, letter stagger, pill slide, swipe, keyboard, reduced-motion fallback
- [ ] Customize state shows items in a ring around the empty plate
- [ ] **PlateBuilder** with ring, slots, `layoutId` moves, summary chip, 6-item limit, WhatsApp order
- [ ] Sandwiches section with 3 cards and hover motion
- [ ] All remaining sections from Section 5 with Reveal animations
- [ ] Contact form with zod, honeypot, time trap, mailto and WhatsApp fallbacks
- [ ] Meta CSP, referrer, frame-buster, robots, sitemap, OG, JSON-LD
- [ ] `scripts/optimise-images.mjs` (preserve alpha), `scripts/preview-pages.sh`
- [ ] README: run, build, replace images, edit plans and prices, deploy, custom domain
- [ ] `pnpm lint`, `pnpm build`, `pnpm audit --prod` clean
- [ ] Preview with `NEXT_PUBLIC_BASE_PATH=/meal-plans` and confirm every image resolves
- [ ] Playwright via `/webapp-testing`: screenshots at 375/768/1280/1920; click each plan and assert the headline text changes and the plate `src` changes; keyboard ArrowRight switches plan; builder adds and removes an item; reduced-motion shows crossfade only
- [ ] Keyboard-only pass and screen-reader labels pass

### Phase 2 (owner content)

- [ ] Drop real images into `public/food/` with the exact names
- [ ] Fill `siteConfig` name, phone, WhatsApp, email, domain
- [ ] Confirm prices and plan descriptions
- [ ] Add real testimonials and OG image

---

## 14. Defaults When Unsure

- Prefer the simpler static option. Local assets only. Config and data files over hardcoded strings.
- Match the recording's mood (calm, airy, physical motion) over its exact layout.
- Placeholder copy must read as a real Hyderabad meal-plan business, no lorem ipsum.
- No em dashes in any user-facing copy.
- If an animation and accessibility conflict, accessibility wins; give reduced-motion users a crossfade.

---

## 15. Definition of Done

Phase 1 is done when a fresh clone with `pnpm install && pnpm build` produces a static `out/` with zero lint, type and high/critical audit findings, meets the Lighthouse targets, tapping any plan plays the full Section 6.2 transition at 60fps on a mid-range phone, the Customize plan shows the item ring and the builder works end to end, the sandwiches section renders three cards, every image either loads from `public/food/` or falls back cleanly, and a push to `main` deploys to GitHub Pages with all assets resolving under the base path.
