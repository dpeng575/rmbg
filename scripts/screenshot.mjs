// 驱动系统 Chrome 截图:node scripts/screenshot.mjs [url] [outfile] [waitText]
import { chromium } from "playwright";

const [url = "http://localhost:3000", outfile = "shot-home.png", waitText] =
  process.argv.slice(2);

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
if (waitText) await page.waitForSelector(`text=${waitText}`, { timeout: 30_000 });
await page.waitForTimeout(800); // 等入场动画落定
await page.screenshot({ path: outfile, fullPage: true });

console.log("saved:", outfile);
if (errors.length) {
  console.log("console errors:", JSON.stringify(errors, null, 2));
} else {
  console.log("no console errors");
}
await browser.close();
