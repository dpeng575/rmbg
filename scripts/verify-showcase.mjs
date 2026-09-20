// 验证首页效果展示区:渲染、tab 切换、滑块拖拽、键盘操作
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && !m.text().includes("Download the React DevTools") && errors.push(m.text()));

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#quality h2");

// 初始渲染:原图 + 结果 + 滑块
await page.waitForSelector('#quality img[alt="Original photo (People)"]');
await page.waitForSelector('#quality img[alt="Background removed (People)"]');
const slider = page.locator('#quality [role="slider"]');
await slider.waitFor();
console.log("initial render OK");

// 拖拽滑块到 30% 位置(先滚入视口,鼠标事件只在视口坐标内生效)
const stage = page.locator("#quality .relative.mt-6");
await stage.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const box = await stage.boundingBox();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5, { steps: 5 });
await page.mouse.up();
let now = await slider.getAttribute("aria-valuenow");
console.log("after drag pos:", now);
if (Number(now) > 40 || Number(now) < 20) throw new Error("拖拽后位置不符合预期: " + now);

// 键盘操作
await slider.focus();
await page.keyboard.press("End");
now = await slider.getAttribute("aria-valuenow");
console.log("after End key pos:", now);
if (Number(now) !== 100) throw new Error("滑块无法到达最右端: " + now);
await page.keyboard.press("Home");
now = await slider.getAttribute("aria-valuenow");
if (Number(now) !== 0) throw new Error("滑块无法到达最左端: " + now);

// tab 切换到 Products / Pets
await page.click('#quality [role="tab"]:has-text("Products")');
await page.waitForSelector('#quality img[alt="Background removed (Products)"]');
await page.screenshot({ path: "shot-quality-products.png" });
await page.click('#quality [role="tab"]:has-text("Pets")');
await page.waitForSelector('#quality img[alt="Background removed (Pets)"]');
console.log("tab switch OK");

await page.locator("#quality").scrollIntoViewIfNeeded();
await page.screenshot({ path: "shot-quality.png" });

// 移动端视口
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(baseUrl, { waitUntil: "domcontentloaded" });
await mobile.waitForSelector("#quality h2");
await mobile.locator("#quality").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "shot-quality-mobile.png" });

console.log(errors.length ? "console errors:\n" + errors.join("\n") : "no console errors");
await browser.close();
console.log("done");
