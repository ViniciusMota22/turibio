import sharp from "sharp";
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
const heroOnly = process.argv.includes("--hero");
const manifest = heroOnly
  ? JSON.parse(await readFile("src/data/images.json", "utf8"))
  : {};
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }
    const key = path.relative("originals", file).replaceAll("\\", "/");
    const base = key.replace(/\.[^.]+$/, "");
    if (heroOnly && base !== "hero-consultorio") continue;
    const meta = await sharp(file).metadata();
    const max = Math.min(meta.width, base === "hero-consultorio" ? 1600 : 1200);
    const widths = [...new Set([400, 800, max].filter((w) => w <= max))].sort(
      (a, b) => a - b,
    );
    const variants = [];
    for (const width of widths) {
      const stem = `/images/${base}-${width}`;
      await mkdir(path.dirname(`public${stem}`), { recursive: true });
      await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 76 })
        .toFile(`public${stem}.webp`);
      await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 46, effort: 4 })
        .toFile(`public${stem}.avif`);
      variants.push({ width, webp: stem + ".webp", avif: stem + ".avif" });
    }
    manifest[key] = {
      width: max,
      height: Math.round((meta.height * max) / meta.width),
      variants,
    };
  }
}
await walk("originals");
await writeFile("src/data/images.json", JSON.stringify(manifest, null, 2));

const hero = manifest["hero-consultorio.png"];
const html = await readFile("index.html", "utf8");
const preload = `<link rel="preload" as="image" type="image/avif" href="${hero.variants.at(-1).avif}" imagesrcset="${hero.variants.map((v) => `${v.avif} ${v.width}w`).join(", ")}" imagesizes="(max-width: 760px) 100vw, 50vw" fetchpriority="high" />`;
await writeFile(
  "index.html",
  html.replace(/<link\s+rel="preload"[\s\S]*?\/>/, preload),
);
