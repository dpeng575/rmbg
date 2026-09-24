// 验证模型加载来源:上传示例 → 抠图成功 → 统计模型请求的来源
// 用法:node scripts/verify-model-source.mjs (BASE_URL 可覆盖)
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const modelReqs = [];
page.on("request", (r) => {
  const u = r.url();
  if (u.includes("/models/") || u.includes("staticimgly")) modelReqs.push(u);
});
const failed = [];
page.on("requestfailed", (r) => {
  const u = r.url();
  if (u.includes("staticimgly") || u.includes("/models/"))
    failed.push(`${r.failure()?.errorText}: ${u}`);
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector('button:has-text("Upload photos")');

await page.click('img[alt="Sample: Portrait"]');
await page.waitForSelector("text=Pick a background below", { timeout: 600_000 });
console.log("cutout ready");

const selfHosted = modelReqs.filter((u) => u.includes("/models/")).length;
const external = modelReqs.filter((u) => u.includes("staticimgly")).length;
console.log(`model requests: ${selfHosted} self-hosted, ${external} external CDN`);
console.log("crossOriginIsolated:", await page.evaluate(() => crossOriginIsolated));
if (failed.length) console.log("failed model requests:\n" + failed.join("\n"));
if (selfHosted === 0 && external === 0) throw new Error("没有观察到任何模型请求");
if (failed.length) throw new Error("有模型请求失败");

console.log(errors.length ? "page errors:\n" + errors.join("\n") : "no page errors");
await browser.close();
console.log("done");
