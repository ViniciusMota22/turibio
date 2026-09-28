import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const reduced of [false, true])
    for (const width of [360, 768, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 800 },
        reducedMotion: reduced ? "reduce" : "no-preference",
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:4173/", {
        waitUntil: "domcontentloaded",
      });
      const cta = page.locator(".hero-action .button");
      await cta.waitFor({ state: "attached" });
      const initial = await cta.evaluate((el) => {
        const box = el.getBoundingClientRect();
        let opacity = 1;
        for (let n = el; n instanceof HTMLElement; n = n.parentElement)
          opacity *= Number(getComputedStyle(n).opacity);
        return {
          opacity,
          visibleInViewport: box.top >= 0 && box.bottom <= innerHeight,
          hit: el.contains(
            document.elementFromPoint(
              box.x + box.width / 2,
              box.y + box.height / 2,
            ),
          ),
          time: performance.now(),
        };
      });
      assert.equal(initial.opacity, 1);
      assert.ok(initial.visibleInViewport && initial.hit);
      await cta.click({ trial: true });
      await page.waitForTimeout(1100);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        mask: getComputedStyle(document.querySelector(".hero-photo-frame"))
          .clipPath,
        words: [...document.querySelectorAll(".hero-word")].every(
          (e) => getComputedStyle(e).opacity === "1",
        ),
        animations: document.getAnimations().length,
        heading: document.querySelector("h1").getAttribute("aria-label"),
      }));
      assert.equal(state.overflow, false);
      assert.ok(state.words);
      if (reduced) assert.equal(state.animations, 0);
      assert.equal(errors.length, 0);
      await page.screenshot({
        path: `reports/hero-focus-${width}${reduced ? "-reduced" : ""}.png`,
      });
      if (!reduced) {
        await page.evaluate(() => scrollTo(0, 300));
        await page.waitForTimeout(200);
        const parallax = await page
          .locator(".hero-parallax")
          .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42);
        assert.ok(parallax >= 0 && parallax <= 40);
      }
      results.push({ width, reduced, initial, ...state, errors });
      await page.close();
    }
  await writeFile("reports/hero-focus.json", JSON.stringify(results, null, 2));
  console.log(
    results.map((r) => ({
      width: r.width,
      reduced: r.reduced,
      cta: r.initial,
      overflow: r.overflow,
    })),
  );
} finally {
  await browser.close();
}
