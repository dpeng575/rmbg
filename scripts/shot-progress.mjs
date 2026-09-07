// 截取处理视图(下载阶段中段)验证进度条样式
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=上传图片", { timeout: 60_000 });

await page.click('button:has-text("宠物")');
await page.waitForSelector("text=正在加载 AI 模型", { timeout: 60_000 });

// 等到百分比涨过 30% 再截,能看到明显的中段填充
await page.waitForFunction(
  () => {
    const el = document.querySelector('[aria-live="polite"]');
    const m = el?.textContent?.match(/(\d+)%/);
    return !!m && Number(m[1]) > 30;
  },
  null,
  { timeout: 120_000 },
);
await page.screenshot({ path: "shot-progress.png" });
console.log("progress screenshot saved");
await browser.close();
