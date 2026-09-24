import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 用局域网 IP(如 http://192.168.0.101:3000)访问 dev 服务器时,
   * Next 默认拦截非允许来源的 /_next/* 请求(含 HMR WebSocket),
   * 导致控制台报 "WebSocket connection to ws://.../_next/hmr failed"。
   * 放行 192.168.0.* 内网段即可(DHCP 换 IP 无需再改)。
   */
  allowedDevOrigins: ["192.168.0.*"],
  /**
   * 跨域隔离(COOP + COEP)→ crossOriginIsolated 成立 →
   * SharedArrayBuffer 可用 → ORT WASM 多线程生效(Android CPU 路径 2~4x 加速)。
   * 前提:页面所有跨源子资源需带 CORP —— 本站字体(next/font 构建期自托管)、
   * 示例图与 /models/ 模型分块均为同源,满足要求。
   */
  async headers() {
    return [
      {
        /**
         * 自托管回退模式(NEXT_PUBLIC_MODEL_BASE_URL=/models/)下的模型分块:
         * 文件名即内容哈希,可安全 immutable。默认 Next 对 public/ 静态文件
         * 是 max-age=0,等于每次访问都回源校验 76MB,带宽白扔。
         */
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
