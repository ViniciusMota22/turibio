import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--remote-debugging-port=9224"],
});
try {
  const result = await lighthouse("http://127.0.0.1:4173", {
    port: 9224,
    output: ["html", "json"],
    onlyCategories: ["performance", "accessibility"],
    logLevel: "error",
  });
  await writeFile("reports/lighthouse-mobile.report.html", result.report[0]);
  await writeFile("reports/lighthouse-mobile.report.json", result.report[1]);
  console.log(
    Object.fromEntries(
      Object.entries(result.lhr.categories).map(([k, v]) => [k, v.score]),
    ),
  );
} finally {
  await browser.close();
}
