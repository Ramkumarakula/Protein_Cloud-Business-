// Runs before every build (pnpm prebuild) and dev start.
// 1. Converts every PNG/JPG in public/food/ to WebP at 1600/1000/600 px wide (alpha preserved).
// 2. Writes src/data/image-manifest.json listing which food images exist, so the site can
//    prefer a real PNG over an SVG placeholder, or show a CSS fallback without a 404.
import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const foodDir = path.join(publicDir, "food");
const manifestPath = path.join(root, "src", "data", "image-manifest.json");
const WIDTHS = [1600, 1000, 600, 300];
const RASTER = new Set([".png", ".jpg", ".jpeg"]);

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

const toPublicUrl = (file) => "/" + path.relative(publicDir, file).split(path.sep).join("/");

async function isFresh(output, source) {
  if (!existsSync(output)) return false;
  const [o, s] = await Promise.all([stat(output), stat(source)]);
  return o.mtimeMs >= s.mtimeMs;
}

const manifest = {};
let converted = 0;

for (const file of (await walk(foodDir)).sort()) {
  const ext = path.extname(file).toLowerCase();
  const url = toPublicUrl(file);

  if (ext === ".svg") {
    manifest[url] = { type: "svg" };
    continue;
  }
  if (!RASTER.has(ext) || /-\d+\.webp$/.test(file)) continue;

  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  const variants = [];
  for (const width of widths) {
    const out = file.slice(0, -ext.length) + `-${width}.webp`;
    if (!(await isFresh(out, file))) {
      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, alphaQuality: 90, effort: 5 })
        .toFile(out);
      converted += 1;
    }
    variants.push({ width, src: toPublicUrl(out) });
  }
  manifest[url] = { type: "raster", width: meta.width, height: meta.height, variants };
}

await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `optimise-images: ${Object.keys(manifest).length} images in manifest, ${converted} WebP files written`,
);
