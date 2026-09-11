/**
 * 下载背景图库照片素材(Unsplash License)到 public/backgrounds/。
 * 幂等可重跑;校验 HTTP 200 + JPEG 魔数,失败的会列出以便换图。
 * 产物直接入仓(约 5MB),与 src/lib/backgrounds.ts 的 src 路径一一对应。
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MANIFEST = {
  people: {
    p1: "photo-1502691876148-a84978e59af8", // 城市灯光虚化
    p2: "photo-1495474472287-4d71bcdd2085", // 粉彩渐变墙
    p3: "photo-1518837695005-2083093ee35b", // 海洋蓝
    p4: "photo-1500462918059-b1a0cb512f1d", // 柔和渐变
    p5: "photo-1519074069444-1ba4fff66d16", // 工作室米色
    p6: "photo-1521295121783-8a321d551ad2", // 金色树叶虚化
  },
  products: {
    pr1: "photo-1557682250-33bd709cbe85", // 紫色渐变网
    pr2: "photo-1618220179428-22790b461013", // 极简米色
    pr3: "photo-1524758631624-e2822e304c36", // 木桌
    pr4: "photo-1595428774223-ef52624120d2", // 白色大理石
    pr5: "photo-1556228453-efd6c1ff04f6", // 石材纹理
    pr6: "photo-1550859492-d5da9d8e45f3", // 柔光渐变
  },
  cars: {
    c1: "photo-1503376780353-7e6692767b70", // 敞开公路
    c2: "photo-1494976388531-d1058494cdd8", // 经典车头
    c3: "photo-1489824904134-891ab64532f1", // 城市车流
    c4: "photo-1533473359331-0135ef1b58bf", // 山路
    c5: "photo-1449965408869-eaa3f722e40d", // 日落公路
    c6: "photo-1511919884226-fd3cad34687c", // 夜间车道
  },
};

const W = 2400;
const failed = [];
let ok = 0;

for (const [dir, files] of Object.entries(MANIFEST)) {
  const outDir = join("public/backgrounds", dir);
  mkdirSync(outDir, { recursive: true });
  for (const [name, photoId] of Object.entries(files)) {
    const dest = join(outDir, `${name}.jpg`);
    const url = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${W}&q=80`;
    if (existsSync(dest) && statSync(dest).size > 20_000) {
      ok++;
      continue;
    }
    const res = spawnSync("curl", ["-fsSL", "--max-time", "60", "-o", dest, url]);
    const valid =
      res.status === 0 &&
      existsSync(dest) &&
      statSync(dest).size > 20_000 &&
      readFileSync(dest).subarray(0, 2).toString("hex") === "ffd8"; // JPEG 魔数
    if (valid) {
      ok++;
      console.log(`✓ ${dir}/${name}.jpg (${(statSync(dest).size / 1024).toFixed(0)}KB)`);
    } else {
      failed.push(`${dir}/${name} ← ${photoId}`);
      console.error(`✗ ${dir}/${name} (${photoId})`);
    }
  }
}

console.log(`\n${ok}/18 张就绪`);
if (failed.length) {
  console.log("失败清单(需换图):");
  for (const f of failed) console.log("  " + f);
  process.exit(1);
}
