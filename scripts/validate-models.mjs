/**
 * 构建前校验模型资源:仅在自托管模式(设置了 NEXT_PUBLIC_MODEL_BASE_URL)下
 * 生效 —— public/models/ 缺失或分块损坏(大小与 resources.json 不符)时让
 * 构建立即失败,避免"模型缺失但部署成功、用户端全部报 MODEL_DOWNLOAD"的
 * 静默故障。默认官方 CDN 模式直接跳过(模型不进部署包)。
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SELF_HOST_ENV = "NEXT_PUBLIC_MODEL_BASE_URL";
const OUT_DIR = "public/models";

if (!process.env[SELF_HOST_ENV]?.trim()) {
  console.log("未设置 NEXT_PUBLIC_MODEL_BASE_URL,使用官方 CDN,跳过模型校验。");
  process.exit(0);
}

const manifestPath = join(OUT_DIR, "resources.json");
if (!existsSync(manifestPath)) {
  console.error(
    `自托管模式(${SELF_HOST_ENV}=${process.env[SELF_HOST_ENV]})需要 ${manifestPath},但文件不存在。` +
      "请先运行: npm run prepare:models",
  );
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
let checked = 0;
for (const [key, entry] of Object.entries(manifest)) {
  for (const chunk of entry.chunks) {
    const dest = join(OUT_DIR, chunk.name);
    const expect = chunk.offsets[1] - chunk.offsets[0];
    const actual = existsSync(dest) ? statSync(dest).size : -1;
    if (actual !== expect) {
      console.error(
        `模型分块损坏或缺失: ${key} → ${dest}(期望 ${expect} 字节,实际 ${actual < 0 ? "不存在" : actual})。` +
          "请重新运行: npm run prepare:models",
      );
      process.exit(1);
    }
    checked++;
  }
}
console.log(`模型资源校验通过:${checked} 个分块完整。`);
