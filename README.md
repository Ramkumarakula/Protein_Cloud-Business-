# RK Protein Cloud: meal plans website

A static, single-page site for a meal-plan business at SRM KTR, Chennai: an animated plan switcher
(Elite, Just Protein, Customize), a tap-to-build custom plate, sandwiches, pricing, FAQ and a
WhatsApp-first contact form. Built with Next.js 15 (static export), Tailwind CSS v4 and
Framer Motion, and hosted on GitHub Pages.

`PROJECT_PLAN.md` is the full spec.

## Run it

Requires Node 20 and pnpm 9.

```bash
pnpm install
pnpm images      # once, or after changing photos: builds WebP copies and the image manifest
pnpm dev         # http://localhost:3000
```

## Build and check

```bash
pnpm lint                          # ESLint (zero warnings) + TypeScript
pnpm build                         # static site in out/ (runs the image step first)
pnpm audit --prod --audit-level=high
pnpm exec playwright install chromium   # first time only
pnpm test:e2e                      # Playwright against out/; screenshots land in screenshots/
```

## Replace images

Put photos in `public/food/` with the exact names listed in `public/food/README.md`, then run
`pnpm images` (or just `pnpm build`). Plates and sandwiches need transparent backgrounds.
Builder items ship as SVG illustrations; drop `public/food/items/<id>.png` to replace any
of them with a real photo.

To regenerate the item illustrations: `python scripts/generate-item-svgs.py`.
To regenerate the placeholder social image: `node scripts/make-og.mjs "Your Name" "Your tagline"`.

## Edit plans, prices and text

| What                                                 | File                     |
| ---------------------------------------------------- | ------------------------ |
| Business name, phone, WhatsApp, email, areas, domain | `src/config/site.ts`     |
| Plans (copy, prices per day and week, colours)       | `src/data/plans.ts`      |
| Builder items (calories, protein, add-on price)      | `src/data/items.ts`      |
| Sandwiches                                           | `src/data/sandwiches.ts` |
| FAQ                                                  | `src/data/faq.ts`        |

Prices are in INR. The site is in pre-launch mode:

- `showPrices: false` in `src/config/site.ts` shows "₹ ?" instead of prices. Set it to `true`
  to show the prices from the data files.
- Every order / add button calls `requestOrder()` (`src/lib/orderPrompt.ts`), which shows a
  "Hope you liked it" message and jumps to the contact form. A 10 digit WhatsApp number automatically gets the +91 country code.

## Deploy to GitHub Pages

1. Push this repo to GitHub. In **Settings > Pages**, set **Source: GitHub Actions**.
2. Project repo (`username.github.io/meal-plans`): add a repository variable
   `NEXT_PUBLIC_BASE_PATH` = `/meal-plans` (**Settings > Secrets and variables > Actions >
   Variables**). For a `username.github.io` repo or a custom domain, leave it unset.
3. Every push to `main` runs `.github/workflows/deploy.yml`: lint, audit, build, deploy.

Check the base path locally before pushing:

```bash
bash scripts/preview-pages.sh /meal-plans   # then open http://localhost:4173/meal-plans/
BASE_PATH=/meal-plans pnpm test:e2e         # same tests against the base-path build
```

## Custom domain

1. Add `public/CNAME` containing your domain, for example `www.example.in`.
2. At your DNS provider, add a `CNAME` record for `www` pointing to `username.github.io`
   (or the four GitHub Pages `A` records for an apex domain).
3. In **Settings > Pages**, enter the domain and tick **Enforce HTTPS**.
4. Leave `NEXT_PUBLIC_BASE_PATH` unset, and update `url` in `src/config/site.ts`.

## Security notes

GitHub Pages cannot send HTTP headers, so the Content Security Policy is a meta tag in
`src/app/layout.tsx`, plus a frame-buster script. `vercel.json` and `netlify.toml` carry the
full header set in case the site moves. There are no third-party scripts, no remote images and
no backend; form input is validated with zod and URL-encoded before it reaches `wa.me` or
`mailto:` links.
