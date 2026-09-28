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
          // HSTS 分阶段:首发用 5 分钟无 includeSubDomains,全站(含所有子域)
          // 稳定走 HTTPS 一到两周后再调 max-age=63072000; includeSubDomains。
          // HSTS 被浏览器记住后无法服务端回滚,首发就下 2 年风险过高。
          { key: "Strict-Transport-Security", value: "max-age=300" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline':Next 无 nonce 的内联引导脚本;GA 经 googletagmanager 注入
              // 'wasm-unsafe-eval' + blob::ORT 编译 WASM,且 JSEP 后端以 import(blob:.mjs) 加载
              // 'unsafe-eval':ORT JSEP/WebGPU 路径运行时会 new Function 求值
              // (EvalError: Evaluating a string as JavaScript),wasm-unsafe-eval
              // 不覆盖它。代价是放松了 CSP,但功能优先;staticimgly.com:官方
              // CDN 模式下 ORT 的 .mjs 以动态 import 加载
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://staticimgly.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              // blob:/data::上传预览与合成结果走 object URL
              "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
              "font-src 'self'",
              // GA 上报 + 模型资源(自托管为同源 'self',CDN 模式为 staticimgly)
              // blob::ORT fetch 已 import 的 blob 模块/编译 WASM
              // www.google.com:GA4 的 /g/collect 上报端点之一,不带 google-analytics.com 后缀
              "connect-src 'self' blob: https://staticimgly.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
