import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 跨域隔离(COOP + COEP)→ crossOriginIsolated 成立 →
   * SharedArrayBuffer 可用 → ORT WASM 多线程生效(Android CPU 路径 2~4x 加速)。
   * 前提:页面所有跨源子资源需带 CORP —— 本站字体(next/font 构建期自托管)、
   * 示例图与 /models/ 模型分块均为同源,满足要求。
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
