import type { ErrorCode, ProgressInfo, StageTimings } from "@/types";

/**
 * @imgly/background-removal 封装 —— 全项目技术核心。
 *
 * 关键事实(决定这里的写法):
 * - npm 包是纯 JS,模型与 ORT 运行时在运行时从 CDN 分块 fetch,
 *   因此只需动态 import,SSR 路径永不加载,Next.js 零配置。
 * - progress 回调:下载阶段 key 形如 "fetch:<资源>"(current/total 为字节,
 *   跨多个资源多次触发);推理阶段只有 4 个里程碑
 *   compute:decode → inference → mask → encode,没有细粒度进度。
 * - CPU/WASM 推理跑在主线程(proxyToWorker 对 CPU 有已知 bug,不开)。
 * - 移动端 WebGPU 驱动稳定性差，统一使用 CPU/WASM，避免 GPU device loss
 *   让 Safari/Chrome 标签页被系统回收并表现为页面刷新。
 */

const STEP_INDEX: Record<string, number> = {
  decode: 0,
  inference: 1,
  mask: 2,
  encode: 3,
};

export const COMPUTE_STEPS = [
  "Decoding image",
  "AI cutout",
  "Building mask",
  "Encoding PNG",
] as const;

/**
 * onnxruntime 的良性内部提示:部分图节点按设计留在 CPU 执行器、
 * 非跨域隔离环境回退单线程。它们不影响结果,但走 console.error
 * 通道,在 Next dev 下会像报错一样被转发到终端 —— 处理期间静音。
 */
const ORT_NOISE_PATTERNS = [
  "VerifyEachNodeIsAssignedToAnEp",
  "Rerunning with verbose output",
  "env.wasm.numThreads",
  "WebAssembly multi-threading is not supported",
];

function isOrtNoise(args: unknown[]): boolean {
  return ORT_NOISE_PATTERNS.some((pattern) =>
    args.some((arg) => typeof arg === "string" && arg.includes(pattern)),
  );
}

async function withOrtNoiseSilenced<T>(fn: () => Promise<T>): Promise<T> {
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args: unknown[]) => {
    if (!isOrtNoise(args)) originalError(...args);
  };
  console.warn = (...args: unknown[]) => {
    if (!isOrtNoise(args)) originalWarn(...args);
  };
  try {
    return await fn();
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

/**
 * 模型资源基址:默认 undefined → 库使用自带官方 CDN 地址,部署包不含
 * 76MB 模型,出口带宽成本为零。设置 NEXT_PUBLIC_MODEL_BASE_URL(如
 * "/models/" 或绝对 URL)即切换到自托管回退 —— 模型需先经
 * npm run prepare:models 下载到 public/models/。imgly CDN 无 SLA、
 * 版本目录可能被清理,这是保留自托管路径的原因。库内部用
 * new URL(name, publicPath) 拼地址,相对路径必须补全为绝对 URL。
 */
function resolveModelPublicPath(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_MODEL_BASE_URL?.trim();
  if (!raw) return undefined;
  const base = raw.endsWith("/") ? raw : `${raw}/`;
  return /^https?:\/\//.test(base)
    ? base
    : `${window.location.origin}${base}`;
}

/**
 * 抠图主入口。source 直接传 File/Blob,输出为全分辨率透明 PNG Blob
 * (mask 会被缩放回原图分辨率)。同时返回各阶段耗时拆分。
 */
export async function removeBg(
  source: Blob,
  onProgress: (p: ProgressInfo) => void,
  signal?: AbortSignal,
): Promise<{ blob: Blob; timings: StageTimings }> {
  // 只在用户事件触发的调用栈里动态导入,永不进 SSR / 首屏 chunk
  const { removeBackground } = await import("@imgly/background-removal");

  // —— 阶段计时:compute 里程碑(0=decode 1=inference 2=mask 3=encode)
  //    首次进入某阶段时记录时间戳,区间差归入上一阶段的耗时桶 ——
  const timings: StageTimings = {
    downloadMs: 0,
    decodeMs: 0,
    inferenceMs: 0,
    outputMs: 0,
  };
  const stageStart = performance.now();
  const marks = new Map<number, number>(); // stepIndex → 首次进入时间戳
  const fetchProgress = new Map<string, { cur: number; total: number }>();
  let lastDownloadPct = 0;

  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");

  const blob = await withOrtNoiseSilenced(() =>
    removeBackground(source, {
      device: "cpu", // 移动端禁用 WebGPU，避免驱动崩溃导致页面刷新
      model: "isnet_quint8", // ~42MB,首载友好;输出质量已足够
      publicPath: resolveModelPublicPath(),
      fetchArgs: signal ? { signal } : undefined,
      output: { format: "image/png", quality: 1 },
      progress: (key: string, current: number, total: number) => {
        if (key.startsWith("fetch:")) {
          fetchProgress.set(key, { cur: current, total });
          let cur = 0;
          let tot = 0;
          for (const v of fetchProgress.values()) {
            cur += v.cur;
            tot += v.total;
          }
          const pct = tot > 0 ? Math.min(0.99, cur / tot) : 0;
          lastDownloadPct = Math.max(lastDownloadPct, pct);
          onProgress({ stage: "download", pct: lastDownloadPct });
        } else {
          const step = key.split(":")[1] ?? "";
          const idx = STEP_INDEX[step] ?? 0;
          if (!marks.has(idx)) {
            const now = performance.now();
            marks.set(idx, now);
            if (idx === 0) timings.downloadMs = now - stageStart;
            else if (idx === 1)
              timings.decodeMs = now - marks.get(0)!;
            else if (idx === 2)
              timings.inferenceMs = now - marks.get(1)!;
            else if (idx === 3)
              timings.outputMs += now - marks.get(2)!;
          }
          onProgress({ stage: "compute", stepIndex: idx });
        }
      },
    }),
  );

  // encode(4/4) 里程碑到 promise resolve 之间的收尾也计入输出阶段
  if (marks.has(3)) {
    timings.outputMs += performance.now() - marks.get(3)!;
  } else if (marks.has(2)) {
    timings.outputMs += performance.now() - marks.get(2)!;
  }

  return { blob, timings };
}

/** 把库抛出的各种异常形态归类为用户可读的错误码 */
export function classifyError(err: unknown): ErrorCode {
  const msg =
    err instanceof Error ? `${err.name}: ${err.message}` : String(err ?? "");
  if (/aborterror|cancelled|canceled/i.test(msg)) return "CANCELLED";
  if (/indexeddb|cache storage|quota|storage.*denied|incognito/i.test(msg)) {
    return "MODEL_CACHE";
  }
  if (
    /failed to fetch|networkerror|resource metadata|download|enotfound|timeout/i.test(
      msg,
    )
  ) {
    return "MODEL_DOWNLOAD";
  }
  if (/webassembly|wasm.*(?:disabled|unsupported)|canvas 2d unavailable/i.test(msg)) {
    return "BROWSER_UNSUPPORTED";
  }
  if (/memory|allocat|out of bounds/i.test(msg)) return "MEMORY";
  return "INFERENCE";
}
