// 端到端验证:上传 → 抠图 → 选背景合成 → 下载 HD / 透明 PNG → 重置
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const modelReqs = [];
page.on("request", (r) => {
  const u = r.url();
  if (u.includes("/models/") || u.includes("staticimgly")) modelReqs.push(u);
});

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("h1:has-text('Photo Background Changer')");

// 跨域隔离 + 自托管断言
const isolated = await page.evaluate(() => crossOriginIsolated);
console.log("crossOriginIsolated:", isolated);
if (!isolated) throw new Error("COOP/COEP 未生效");

// 状态①:点示例图上传
await page.click('button:has-text("Product")');
console.log("clicked sample: product");

// 处理 → 状态②(未选背景提示出现)
await page.waitForSelector("text=Pick a background below", { timeout: 360_000 });
console.log("state 2: cutout ready, no bg selected");
await page.screenshot({ path: "shot-state2.png" });

// 状态③:选白色纯色背景 → 合成预览出现
await page.click('button[title="White"]');
await page.waitForSelector('img[alt="Photo with new background"]', {
  timeout: 30_000,
});
console.log("state 3: composite preview shown");
await page.screenshot({ path: "shot-state3.png" });

// 切换照片背景(图库 People 第一张)
await page.click('button[title="City lights"]');
await page.waitForTimeout(1500); // 等重新合成

// 原图/结果切换
await page.click('button:has-text("Original")');
await page.waitForSelector('img[alt="Original photo"]');
await page.click('button:has-text("Result")');
await page.waitForSelector('img[alt="Photo with new background"]');
console.log("compare toggle OK");

// 下载 HD(JPEG)
const jpg = page.waitForEvent("download", { timeout: 60_000 });
await page.click('button:has-text("Download HD")');
const d1 = await jpg;
console.log("HD download:", d1.suggestedFilename());
if (!d1.suggestedFilename().endsWith("-switchbg.jpg"))
  throw new Error("HD 文件名不符合约定");

// 透明 PNG
const png = page.waitForEvent("download", { timeout: 30_000 });
await page.click('button:has-text("Transparent PNG")');
const d2 = await png;
console.log("PNG download:", d2.suggestedFilename());

// 重置回状态①
await page.click('button:has-text("Start over")');
await page.waitForSelector('button:has-text("Upload a photo")');
console.log("reset to idle OK");

const selfHosted = modelReqs.filter((u) => u.includes("/models/")).length;
const external = modelReqs.filter((u) => u.includes("staticimgly")).length;
console.log(`model requests: ${selfHosted} self-hosted, ${external} external CDN`);
if (external > 0) throw new Error("仍有请求打到外部 CDN");

console.log(errors.length ? "console errors:\n" + errors.join("\n") : "no console errors");
await browser.close();
