// 为首页效果展示区生成 cutout 素材:对每张示例图跑真实抠图管线,
// 下载透明 PNG 到 public/samples/<name>-cutout.png。
// 用法:先启动 dev server,再 node scripts/generate-showcase-cutouts.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = process.env.OUT_DIR ?? "public/samples";
const samples = [
  { label: "Portrait", file: "portrait-cutout.png" },
  { label: "Product", file: "product-cutout.png" },
  { label: "Pet", file: "pet-studio-cutout.png" },
];
const SAMPLES = process.env.SAMPLE
  ? samples.filter((sample) => sample.label.toLowerCase() === process.env.SAMPLE.toLowerCase())
  : samples;

if (!SAMPLES.length) throw new Error(`Unknown SAMPLE: ${process.env.SAMPLE}`);

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

for (const sample of SAMPLES) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('button[title="Upload photos"], button:has-text("Upload photos")');

  await page.click(`img[alt="Sample: ${sample.label}"]`);
  try {
    await page.waitForSelector("text=Pick a background below", { timeout: 360_000 });
  } catch (e) {
    console.error(`${sample.label}: failed. page errors:`, errors);
    const status = await page.locator("[role='status']").allTextContents().catch(() => []);
    console.error(`${sample.label}: status texts:`, status);
    throw e;
  }
  console.log(`${sample.label}: cutout ready`);

  const downloadPromise = page.waitForEvent("download", { timeout: 60_000 });
  await page.click('button:has-text("Transparent PNG")');
  const download = await downloadPromise;
  await download.saveAs(`${outDir}/${sample.file}`);
  console.log(`${sample.label}: saved ${sample.file}`);

  page.once("dialog", (dialog) => dialog.accept());
  await page.click('button:has-text("Start over")');
  await page.waitForSelector('button:has-text("Upload photos")');
}

await browser.close();
if (errors.length) {
  console.error("page errors:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("done");
