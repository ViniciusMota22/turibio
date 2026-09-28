import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto("http://127.0.0.1:4173");
const links = p.locator(".desktop-nav a");
await links.first().hover();
await p.waitForTimeout(450);
const first = await p.locator(".nav-indicator").boundingBox();
await links.last().hover();
await p.waitForTimeout(450);
const last = await p.locator(".nav-indicator").boundingBox();
assert.ok(last.x > first.x);
await p.locator(".coverflow-card.is-active").scrollIntoViewIfNeeded();
const box = await p.locator(".coverflow-card.is-active").boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.down();
await p.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, {
  steps: 8,
});
await p.mouse.up();
await p.waitForTimeout(500);
assert.match(await p.locator(".coverflow-controls span").innerText(), /02/);
await p.locator(".coverflow-card").nth(2).click({ force: true });
await p.waitForTimeout(500);
assert.match(await p.locator(".coverflow-controls span").innerText(), /03/);
await p.locator(".treatment-card").first().click();
await p.waitForURL("**/tratamentos/implantes");
await p.waitForTimeout(400);
await p.getByRole("link", { name: "← Todos os tratamentos" }).click();
await p.waitForURL("**/#tratamentos");
await p.waitForTimeout(500);
assert.ok(
  Math.abs(
    (await p
      .locator("#tratamentos")
      .evaluate((e) => e.getBoundingClientRect().top)) - 110,
  ) < 5,
);
assert.equal(errors.length, 0);
await writeFile(
  "reports/interactions.json",
  JSON.stringify(
    {
      slidingIndicator: true,
      swipe: true,
      cardClick: true,
      crossRouteAnchor: true,
      errors,
    },
    null,
    2,
  ),
);
await b.close();
console.log("Interaction checks passed");
