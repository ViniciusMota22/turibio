import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const width of [360, 768, 1440]) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  await p.goto("http://127.0.0.1:4173");
  await p.waitForTimeout(800);
  await p.screenshot({ path: `reports/hero-${width}.png` });
  for (const selector of [
    ".clinic-section",
    ".team-coverflow-section",
    ".space-section",
  ]) {
    await p.locator(selector).scrollIntoViewIfNeeded();
    await p.waitForTimeout(850);
    await p
      .locator(selector)
      .screenshot({ path: `reports/${selector.slice(1)}-${width}.png` });
  }
  results.push({
    width,
    images: await p
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.map((i) => ({
          src: i.currentSrc,
          loaded: i.complete && i.naturalWidth > 0,
        })),
      ),
    overflow: await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
  await p.close();
}
await b.close();
await writeFile("reports/images.json", JSON.stringify(results, null, 2));
console.log(
  results.map((r) => ({
    width: r.width,
    overflow: r.overflow,
    missing: r.images.filter((i) => !i.loaded),
  })),
);
