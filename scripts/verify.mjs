import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const width of [360, 768, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173");
  await page.waitForTimeout(800);
  const initial = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    images: performance
      .getEntriesByType("resource")
      .filter((r) => r.name.includes("/images/"))
      .reduce((sum, r) => sum + r.transferSize, 0),
    fonts: [
      getComputedStyle(document.querySelector("h1")).fontFamily,
      getComputedStyle(document.body).fontFamily,
    ],
    animations: document.getAnimations().length,
  }));
  await page.screenshot({ path: `reports/home-${width}.png`, fullPage: true });
  const faq = page.locator(".faq-item button").first();
  await faq.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const faqOpen = await page
    .locator("#answer-0")
    .evaluate((e) => !e.inert && e.getBoundingClientRect().height > 0);
  await page.keyboard.press("Enter");
  const faqClosed = await page.locator("#answer-0").evaluate((e) => e.inert);
  await page.locator(".coverflow-card.is-active").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(100);
  const coverflow = await page.locator(".coverflow-controls span").innerText();
  assert.equal(
    await page
      .locator(".coverflow-card.is-active")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  for (let index = 0; index < 7; index++) {
    await page
      .getByRole("button", { name: `Ir para foto ${index + 1}`, exact: true })
      .click();
    const img = page.locator(".coverflow-card.is-active img");
    await img.evaluate((i) => i.decode());
    assert.equal(await img.evaluate((i) => i.naturalWidth > 0), true);
  }
  const mask = page.locator(".photo-mask").first();
  await mask.scrollIntoViewIfNeeded();
  assert.equal(
    await mask.evaluate((e) => getComputedStyle(e).clipPath),
    "none",
  );
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  if (width === 360) {
    await page.locator(".menu-toggle").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
  }
  await page.locator(".treatment-card").first().click();
  await page.waitForURL("**/tratamentos/implantes");
  await page.waitForTimeout(200);
  const treatment = await page.locator("h1").innerText();
  await page.getByRole("link", { name: "Privacidade", exact: true }).click();
  await page.waitForURL("**/privacidade");
  await page.waitForTimeout(200);
  const privacy = await page.locator("h1").innerText();
  assert.equal(initial.overflow, false);
  assert.equal(initial.animations, 0);
  assert.equal(faqOpen, true);
  assert.equal(faqClosed, true);
  assert.equal(errors.length, 0);
  assert.ok(initial.images < 600000);
  results.push({
    width,
    ...initial,
    faqOpen,
    faqClosed,
    coverflow,
    treatment,
    privacy,
    errors,
  });
  await page.close();
}
await browser.close();
await writeFile(
  "reports/layout-keyboard.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
