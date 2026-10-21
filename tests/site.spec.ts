import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PLANS = [
  { key: "elite", headline: "THE ELITE", plate: "plate-elite" },
  { key: "protein", headline: "JUST PROTEIN", plate: "plate-protein" },
  { key: "custom", headline: "MAKE IT YOURS", plate: "plate-custom" },
] as const;

async function open(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("./", { waitUntil: "networkidle" });
  // Wait for hydration: the tabs only respond once React is attached.
  await expect(page.getByTestId("plan-tab-elite")).toHaveAttribute("aria-selected", "true");
  await page.waitForTimeout(300);
  return errors;
}

const headline = (page: Page) => page.getByTestId("hero-headline").locator(".sr-only");
/** The settled (non-exiting) plate image. */
const plateImg = (page: Page, key: string) =>
  page.locator(`[data-testid="hero-plate"][data-plan="${key}"] img`);

test("clicking each plan changes the headline and the plate image", async ({ page }) => {
  const errors = await open(page);
  // Visit in an order that exercises both directions.
  for (const plan of [PLANS[1], PLANS[2], PLANS[0], PLANS[2], PLANS[1]]) {
    await page.getByTestId(`plan-tab-${plan.key}`).click();
    await expect(page.getByTestId(`plan-tab-${plan.key}`)).toHaveAttribute("aria-selected", "true");
    await expect(headline(page)).toHaveText(plan.headline);
    await expect(plateImg(page, plan.key)).toHaveAttribute("src", new RegExp(plan.plate));
    await expect(page.getByTestId("plan-announcer")).toContainText("plan");
    // Old plate leaves the DOM once its exit animation finishes.
    await expect(page.locator('[data-testid="hero-plate"]')).toHaveCount(1, { timeout: 4000 });
  }
  expect(errors).toEqual([]);
});

test("Customize shows the item ring around the empty plate, and hides it on leave", async ({
  page,
}) => {
  await open(page);
  await expect(page.getByTestId("hero-item-ring")).toHaveCount(0);
  await page.getByTestId("plan-tab-custom").click();
  const ring = page.getByTestId("hero-item-ring");
  await expect(ring).toBeVisible();
  await expect(ring.locator("img")).toHaveCount(12);
  await page.getByTestId("plan-tab-elite").click();
  await expect(ring).toHaveCount(0, { timeout: 4000 });
});

test("keyboard: ArrowRight switches plan from the tabs and from inside the hero", async ({
  page,
}) => {
  await open(page);
  await page.getByTestId("plan-tab-elite").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("plan-tab-protein")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("plan-tab-protein")).toBeFocused();
  await expect(headline(page)).toHaveText("JUST PROTEIN");

  // Focus elsewhere in the hero (the info card panel) and use the arrow again.
  await page.getByTestId("info-card").focus();
  await page.keyboard.press("ArrowRight");
  await expect(headline(page)).toHaveText("MAKE IT YOURS");
  await page.keyboard.press("ArrowRight");
  await expect(headline(page)).toHaveText("THE ELITE"); // wraps around
  await page.keyboard.press("ArrowLeft");
  await expect(headline(page)).toHaveText("MAKE IT YOURS");
});

test("builder: add, remove, live summary, 6 item limit and order prompt", async ({ page }) => {
  await open(page);
  await expect(page.getByTestId("plate-builder")).toHaveCount(0);
  await page.getByTestId("open-builder").click();
  const builder = page.getByTestId("plate-builder");
  await expect(builder).toBeVisible();
  await expect(page.getByTestId("plan-tab-custom")).toHaveAttribute("aria-selected", "true");

  const chip = page.getByTestId("summary-chip");
  await expect(chip).toHaveText(/0 items\s*·\s*0 kcal\s*·\s*0 g protein\s*·\s*₹ \?\/day/);
  await expect(page.getByTestId("order-plate")).toBeDisabled();

  // Add one item: it moves onto the plate and the summary updates.
  const chicken = page.getByTestId("builder-item-grilled-chicken");
  await chicken.click();
  await expect(chicken).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("plate-slot-grilled-chicken")).toBeVisible();
  await expect(chip).toHaveText(/1 item\s*·\s*198 kcal\s*·\s*37 g protein\s*·\s*₹ \?\/day/);
  await expect(page.getByTestId("builder-status")).toHaveText(/Added Grilled chicken/);

  // Remove it by tapping it on the plate.
  await page.getByTestId("plate-slot-grilled-chicken").click();
  await expect(page.getByTestId("plate-slot-grilled-chicken")).toHaveCount(0);
  await expect(chicken).toHaveAttribute("aria-pressed", "false");
  await expect(chip).toHaveText(/0 items/);

  // Fill to 6, then a 7th is refused.
  const six = ["grilled-chicken", "paneer", "quinoa", "broccoli", "spinach", "berries"];
  for (const id of six) await page.getByTestId(`builder-item-${id}`).click();
  await expect(chip).toHaveText(/6 items/);
  await page.getByTestId("builder-item-apple").click();
  await expect(page.getByTestId("builder-item-apple")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("builder-full")).toBeVisible();
  await expect(chip).toHaveText(/6 items/);

  // Removing via the ring button works too.
  await page.getByTestId("builder-item-paneer").click();
  await expect(chip).toHaveText(/5 items/);

  await page.getByTestId("order-plate").click();
  await expect(page.getByTestId("order-prompt")).toContainText("Hope you liked it");
});

test("pre-launch: prices show ?, no likes or testimonials, every order button prompts and goes to the form", async ({
  page,
}) => {
  await open(page);
  // Prices are hidden everywhere.
  await expect(page.getByTestId("info-card")).toContainText("₹ ?");
  expect(await page.locator("body").innerText()).not.toMatch(/₹\d/);
  // Likes and testimonials are gone; location is SRM KTR, Chennai.
  await expect(page.getByTestId("info-card")).not.toContainText("1,284");
  await expect(page.getByText("LOVED IN")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("Hyderabad");
  await expect(page.locator("footer")).toContainText("SRM KTR, Chennai");

  const buttons = [
    "info-card-cta",
    "hero-order",
    "pricing-order-elite",
    "pricing-order-custom",
    "sandwich-add-veg",
    "sandwich-add-egg",
  ];
  for (const id of buttons) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId(id).click();
    await expect(page.getByTestId("order-prompt")).toHaveText(
      /Hope you liked it!\s*RK Protein Cloud is launching soon\. Subscribe below to know when we go live\./,
    );
    await expect(page.locator("#contact-heading")).toBeInViewport({ timeout: 4000 });
    await page.getByRole("button", { name: "Close message" }).click();
    await expect(page.getByTestId("order-prompt")).toHaveCount(0);
  }
  // The contact section has the new heading and sample text.
  await expect(page.locator("#contact-heading")).toHaveText(/LOVED IT\? DON'T WAIT\s*LET US KNOW/);
  await expect(page.locator('#contact-form input[name="name"]')).toHaveAttribute(
    "placeholder",
    "Yumm",
  );
  await expect(page.locator('#contact-form input[name="phone"]')).toHaveAttribute(
    "placeholder",
    "+91 90592 57599",
  );
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("plan swap is a crossfade only: no rotation, no letter stagger", async ({ page }) => {
    await open(page);
    // No per-letter spans in the headline.
    await expect(page.getByTestId("hero-headline").locator("span.inline-block")).toHaveCount(0);
    await page.getByTestId("plan-tab-protein").click();
    // Sample the incoming plate mid-transition: opacity may change, transform must not.
    for (let i = 0; i < 4; i++) {
      const transform = await page
        .locator('[data-testid="hero-plate"][data-plan="protein"]')
        .evaluate((el) => getComputedStyle(el).transform);
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
      await page.waitForTimeout(40);
    }
    await expect(headline(page)).toHaveText("JUST PROTEIN");
    await expect(page.getByTestId("hero-headline").locator("span.inline-block")).toHaveCount(0);
  });
});

test("every image on the page resolves", async ({ page }) => {
  await open(page);
  await page.getByTestId("plan-tab-custom").click(); // mounts ring + builder images
  await page.waitForTimeout(1200);
  // Scroll through so lazy images load.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );
  expect(broken).toEqual([]);
  // No CSS fallbacks rendered (role=img spans are the missing-file placeholders).
  await expect(page.locator('span[role="img"][style*="radial-gradient"]')).toHaveCount(0);
});

test("keyboard-only: skip through nav, open and trap the drawer, Escape returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const menu = page.getByTestId("menu-button");
  await menu.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  // Tab many times: focus must never leave the dialog.
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(menu).toBeFocused();
});

test("accessibility: no axe violations (names, roles, contrast) in default and Customize states", async ({
  page,
}) => {
  await open(page);
  const scan = async () =>
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze())
      .violations;
  // Reveal every section first so contrast is measured on visible text.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  const fmt = (v: Awaited<ReturnType<typeof scan>>) =>
    v.map((x) => `${x.id}: ${x.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(fmt(await scan())).toEqual([]);
  await page.getByTestId("plan-tab-custom").click();
  await page.waitForTimeout(1500);
  expect(fmt(await scan())).toEqual([]);
});

for (const width of [375, 768, 1280, 1920]) {
  test(`screenshot ${width}px`, async ({ page }) => {
    const height = { 375: 812, 768: 1024, 1280: 800, 1920: 1080 }[width]!;
    await page.setViewportSize({ width, height });
    await open(page);
    await page.screenshot({ path: `screenshots/hero-${width}.png`, caret: "initial" });
    await page.getByTestId("plan-tab-custom").click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `screenshots/hero-custom-${width}.png`, caret: "initial" });
    for (const id of ["grilled-chicken", "quinoa", "broccoli", "berries"]) {
      await page.getByTestId(`builder-item-${id}`).click();
    }
    await page.waitForTimeout(900);
    await page
      .getByTestId("plate-builder")
      .screenshot({ path: `screenshots/builder-${width}.png`, caret: "initial" });
  });
}

test("hero has no dead icons, pricing is tiered, sandwich video loops behind its section", async ({
  page,
}) => {
  await open(page);
  // No search icon and no placeholder (drinks / profile / mic) buttons.
  await expect(page.getByRole("button", { name: "Browse plans" })).toHaveCount(0);
  await expect(page.locator('[aria-label*="coming soon"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Menu: jump to sandwiches" })).toBeVisible();

  // Pricing cards carry their level.
  await expect(page.getByTestId("pricing-card-elite")).toHaveAttribute("data-tier", "gold");
  await expect(page.getByTestId("pricing-card-protein")).toHaveAttribute("data-tier", "silver");
  await expect(page.getByTestId("pricing-card-custom")).toHaveAttribute("data-tier", "bronze");

  // The video sits inside the sandwiches section, muted and looping, and plays once in view.
  const video = page.locator("#sandwiches").getByTestId("sandwich-video");
  await expect(video).toHaveCount(1);
  await expect(page.getByTestId("sandwich-video")).toHaveCount(1);
  await page.locator("#sandwiches").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        video.evaluate(
          (v: HTMLVideoElement) => v.muted && v.loop && !v.paused && v.currentTime > 0,
        ),
      {
        timeout: 10_000,
      },
    )
    .toBe(true);
});
