// 12MP 真实场景基准:有头 Chrome(WebGPU 可用),读回各阶段耗时
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: false });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=上传图片", { timeout: 60_000 });

console.log("crossOriginIsolated:", await page.evaluate(() => crossOriginIsolated));
console.log("WebGPU adapter:", await page.evaluate(async () => {
  if (!navigator.gpu) return "unavailable";
  const a = await navigator.gpu.requestAdapter();
  return a ? a.info?.vendor || "ok" : "null-adapter";
}));

await page.setInputFiles('input[type="file"]', "/tmp/test-12mp.jpg");
console.log("uploaded 12MP test image, processing...");

await page.waitForSelector("text=背景消除完成", { timeout: 300_000 });
const metas = await page.$$eval("p.font-mono.text-xs", (els) =>
  els.map((e) => e.textContent?.trim()),
);
console.log("breakdown:", JSON.stringify(metas, null, 1));
await browser.close();
