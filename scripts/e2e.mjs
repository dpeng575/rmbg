// 端到端验证:示例图 → 处理 → 结果 → 下载
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", {
  waitUntil: "networkidle",
  timeout: 60_000,
});

// 点击「宠物」示例图
await page.click('button:has-text("宠物")');
console.log("clicked sample: pet");

// 等待处理视图出现(模型加载中)
await page.waitForSelector("text=正在加载 AI 模型", { timeout: 60_000 });
console.log("processing view shown (model loading)");

// 等待结果:最长 6 分钟(首载需下载 ~54MB 模型)
await page.waitForSelector("text=背景消除完成", { timeout: 360_000 });
console.log("result view shown");
await page.waitForTimeout(1200); // 等 wipe 动画落定
await page.screenshot({ path: "shot-result.png" });

// 触发下载并验证文件名
const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
await page.click('button:has-text("下载透明 PNG")');
const download = await downloadPromise;
console.log("download filename:", download.suggestedFilename());

// 评分交互
await page.click('button[aria-label="好评"]');
await page.waitForSelector("text=感谢反馈");
console.log("rating feedback shown");

// 重置回首页
await page.click('button:has-text("再处理一张")');
await page.waitForSelector("text=上传图片");
console.log("reset to idle OK");

console.log(errors.length ? "console errors:\n" + errors.join("\n") : "no console errors");
await browser.close();
