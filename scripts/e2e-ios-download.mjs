// iOS 回归验证:iPhone 上 Chrome/Safari 均为 WebKit,对 <a download>+blob URL 支持不可靠。
// 预期:下载走 Web Share(系统分享面板),mock navigator.share 断言文件与命名。
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();

// 桌面 Chromium 没有 Web Share Level 2,注入 mock 让 iOS 分支可测:
// canShare(带文件)=true;share() 记录调用次数与最后一次文件名。
await page.addInitScript(() => {
  Object.defineProperty(navigator, "platform", { value: "iPhone", configurable: true });
  Object.defineProperty(navigator, "maxTouchPoints", { value: 5, configurable: true });
  Object.defineProperty(navigator, "canShare", {
    value: (data) => Boolean(data?.files?.length),
    configurable: true,
  });
  Object.defineProperty(navigator, "share", {
    value: async (data) => {
      window.__shareCount = (window.__shareCount ?? 0) + 1;
      window.__lastSharedName = data?.files?.[0]?.name ?? "";
    },
    configurable: true,
  });
});

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Upload photos", { timeout: 60_000 });
await page.click('button:has-text("Product")');
await page.waitForSelector("text=Pick a background below", { timeout: 360_000 });
console.log("cutout ready");

// 路径①:Transparent PNG 按钮 → 应唤起分享而非无响应
await page.click('button:has-text("Transparent PNG")');
await page.waitForFunction(() => window.__shareCount >= 1, null, { timeout: 15_000 });
const name1 = await page.evaluate(() => window.__lastSharedName);
console.log("shared (Transparent PNG):", name1);
if (!name1.endsWith("-switchbg.png")) throw new Error(`PNG 文件名不符合约定: ${name1}`);

// 路径②:Download HD(未选背景 = 透明路径)→ 同样应走分享,成功后按钮变 Downloaded
await page.click('button:has-text("Download HD")');
await page.waitForFunction(() => window.__shareCount >= 2, null, { timeout: 15_000 });
const name2 = await page.evaluate(() => window.__lastSharedName);
console.log("shared (Download HD):", name2);
if (!name2.endsWith("-switchbg.png")) throw new Error(`HD 文件名不符合约定: ${name2}`);
await page.waitForSelector('button:has-text("Downloaded")', { timeout: 5_000 });
console.log("button shows Downloaded");

console.log("iOS download OK");
await browser.close();
