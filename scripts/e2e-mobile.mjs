// 移动端视口 + 格式校验错误路径验证
import { chromium } from "playwright";
import { writeFileSync, rmSync } from "node:fs";

const browser = await chromium.launch({ channel: "chrome" });

// —— 移动端 ——
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const mpage = await mctx.newPage();
await mpage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await mpage.waitForSelector("text=上传图片", { timeout: 60_000 });
await mpage.screenshot({ path: "shot-mobile.png", fullPage: true });
console.log("mobile screenshot saved");

// —— 桌面:错误路径(伪造 GIF)——
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=上传图片", { timeout: 60_000 });

writeFileSync("/tmp/fake.gif", "GIF89a");
await page.setInputFiles('input[type="file"]', "/tmp/fake.gif");
await page.waitForSelector("text=不支持的图片格式", { timeout: 15_000 });
console.log("format error banner shown");
await page.screenshot({ path: "shot-error-format.png" });

// —— 错误 URL 路径 ——
await page.fill('input[type="url"]', "https://example.com/nonexistent.jpg");
await page.click('button:has-text("获取")');
await page.waitForSelector("text=无法获取链接图片", { timeout: 30_000 });
console.log("fetch-url error banner shown");

rmSync("/tmp/fake.gif");
console.log("done");
await browser.close();
