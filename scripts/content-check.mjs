import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const before = execFileSync("git", ["show", "80d1488:src/main.jsx"], {
  encoding: "utf8",
});
const after = readFileSync("src/main.jsx", "utf8");
function services(source) {
  const start = source.indexOf("const services =");
  const end = source.indexOf("function Tooth", start);
  return vm.runInNewContext(
    source.slice(start, end) + "; JSON.stringify(services)",
    {
      CircleDot: "CircleDot",
      Smile: "Smile",
      ShieldCheck: "ShieldCheck",
      HeartHandshake: "HeartHandshake",
    },
  );
}
assert.equal(services(before), services(after));
assert.ok(after.includes("5562981195003"));
assert.equal(
  (before.match(/08:00 às 18:00/g) || []).length,
  (after.match(/08:00 às 18:00/g) || []).length,
);
assert.equal(
  (before.match(/08:00 às 12:30/g) || []).length,
  (after.match(/08:00 às 12:30/g) || []).length,
);
writeFileSync(
  "reports/content-check.json",
  JSON.stringify(
    { treatmentsUnchanged: true, phoneUnchanged: true, hoursUnchanged: true },
    null,
    2,
  ),
);
console.log("Content checks passed");
