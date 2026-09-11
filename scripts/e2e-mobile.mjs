// 移动端视口 + 格式校验错误路径验证(SwitchBG 流程)
import { chromium } from "playwright";
import { writeFileSync, rmSync } from "node:fs";

const browser = await chromium.launch({ channel: "chrome" });

// —— 移动端 390px:首页布局 ——
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const mpage = await mctx.newPage();
await mpage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await mpage.waitForSelector("text=Upload a photo", { timeout: 60_000 });
await mpage.waitForTimeout(800);
await mpage.screenshot({ path: "shot-mobile.png", fullPage: true });
console.log("mobile screenshot saved");

// —— 移动端完整流程:示例 → 抠图 → 选背景 ——
await mpage.click('button:has-text("Product")');
await mpage.waitForSelector("text=Pick a background below", { timeout: 360_000 });
console.log("mobile: cutout ready");
await mpage.click('button[title="White"]');
await mpage.waitForSelector('img[alt="Photo with new background"]', {
  timeout: 30_000,
});
console.log("mobile: composite shown");
await mpage.screenshot({ path: "shot-mobile-result.png" });

// —— 桌面:格式校验错误路径 ——
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Upload a photo", { timeout: 60_000 });

writeFileSync("/tmp/fake.gif", "GIF89a");
await page.setInputFiles('input[type="file"]', "/tmp/fake.gif");
await page.waitForSelector("text=Unsupported image format", { timeout: 15_000 });
console.log("format error banner shown");

rmSync("/tmp/fake.gif");
console.log("done");
await browser.close();
