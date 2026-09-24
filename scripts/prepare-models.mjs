/**
 * 自托管 AI 模型与 ORT 运行时:从 imgly 官方 CDN 按库版本锁定下载
 * 所需资源分块到 public/models/,并生成子集 resources.json。
 *
 * 为什么不用 npm 的 @imgly/background-removal-data:
 * 该包(1.4.5)与库 1.7.0 实际消费的清单不兼容 —— 哈希、ORT 版本、
 * .mjs 条目均不同,混用会导致运行时加载失败。
 *
 * 幂等:已存在且大小正确的分块会跳过,可反复执行。
 * 运行时机:npm install 后自动执行(postinstall),也可手动
 *   npm run prepare:models
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const LIB_VERSION = JSON.parse(
  readFileSync("node_modules/@imgly/background-removal/package.json", "utf8"),
).version;
const CDN = `https://staticimgly.com/@imgly/background-removal-data/${LIB_VERSION}/dist/`;
const OUT_DIR = "public/models";

/** 库在 device:'gpu' + model:'isnet_quint8' 下会请求的资源:
 *  GPU 走 jsep 变体,CPU 回退走普通 threaded 变体,两组都要备齐 */
const REQUIRED = [
  "/onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.jsep.mjs",
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.mjs",
  "/models/isnet_quint8",
];

/** 经 curl 下载(自动走系统代理,带重定向与重试) */
function download(url, dest) {
  const res = spawnSync(
    "curl",
    ["-fsSL", "--retry", "3", "--retry-delay", "2", "-o", dest, url],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  if (res.status !== 0) {
    throw new Error(`curl 下载失败(${res.status}): ${url}`);
  }
}

async function main() {
  // postinstall 传 --if-selfhost:未设置 NEXT_PUBLIC_MODEL_BASE_URL 时
  // 走官方 CDN,模型不进部署包,直接跳过(自托管回退再手动执行即可)。
  if (
    process.argv.includes("--if-selfhost") &&
    !process.env.NEXT_PUBLIC_MODEL_BASE_URL?.trim()
  ) {
    console.log(
      "未设置 NEXT_PUBLIC_MODEL_BASE_URL,使用官方 CDN,跳过模型下载。" +
        "自托管回退请运行: npm run prepare:models",
    );
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });

  // 拉取官方清单(临时文件放系统目录,不进 public 避免被静态服务)
  const manifestPath = join(tmpdir(), "rmbg-cdn-resources.json");
  download(new URL("resources.json", CDN).href, manifestPath);
  const full = JSON.parse(readFileSync(manifestPath, "utf8"));

  // 过滤出所需资源,分块补 name 字段(库用 chunk.name 拼 URL)
  const subset = {};
  for (const key of REQUIRED) {
    const entry = full[key];
    if (!entry) {
      throw new Error(
        `CDN 清单(${CDN})中缺少 ${key},库版本 ${LIB_VERSION} 与清单不匹配`,
      );
    }
    subset[key] = {
      ...entry,
      chunks: entry.chunks.map((c) => ({ ...c, name: c.name ?? c.hash })),
    };
  }

  // 逐分块下载(跳过已存在且大小正确的)
  let downloaded = 0;
  let skipped = 0;
  for (const [key, entry] of Object.entries(subset)) {
    for (const chunk of entry.chunks) {
      const dest = join(OUT_DIR, chunk.name);
      const expect = chunk.offsets[1] - chunk.offsets[0];
      if (existsSync(dest) && statSync(dest).size === expect) {
        skipped++;
        continue;
      }
      process.stdout.write(`下载 ${key} 分块 ${chunk.name.slice(0, 12)}…\n`);
      download(new URL(chunk.name, CDN).href, dest);
      downloaded++;
    }
  }

  // 写入库期望格式的子集清单
  writeFileSync(
    join(OUT_DIR, "resources.json"),
    JSON.stringify(subset, null, 1),
  );

  const totalMB = (
    Object.values(subset).reduce((s, e) => s + e.size, 0) /
    1024 /
    1024
  ).toFixed(1);
  console.log(
    `模型资源就绪:共 ${totalMB}MB,本次下载 ${downloaded} 块,跳过 ${skipped} 块 → ${OUT_DIR}/`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
