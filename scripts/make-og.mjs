// Generates a placeholder public/og.jpg (1200x630) from the Elite plate and siteConfig-like text.
// OWNER: replace public/og.jpg with a designed image whenever you like.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2] ?? "RK Protein Cloud";
const tagline = process.argv[3] ?? "Real food. Planned for you.";

const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const backdrop = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ECEBE8"/>
  <circle cx="300" cy="315" r="330" fill="#F2994A" opacity=".18"/>
  <text x="640" y="250" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="40" font-weight="300" letter-spacing="6" fill="#1E1E1E">HEALTHY MEAL PLANS</text>
  <text x="636" y="345" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="64" font-weight="800" fill="#1E1E1E">${esc(name.toUpperCase())}</text>
  <text x="640" y="410" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="30" fill="#646462">${esc(tagline)}</text>
  
</svg>`);

const plate = await sharp(path.join(root, "public/food/plate-elite.png"))
  .resize(560, 560)
  .toBuffer();

await sharp(backdrop)
  .composite([{ input: plate, left: 30, top: 35 }])
  .flatten({ background: "#ECEBE8" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(root, "public/og.jpg"));
console.log("wrote public/og.jpg");
