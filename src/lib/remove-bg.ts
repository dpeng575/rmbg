import type { ErrorCode, ProgressInfo } from "@/types";

/**
 * @imgly/background-removal 封装 —— 全项目技术核心。
 *
 * 关键事实(决定这里的写法):
 * - npm 包是纯 JS,模型与 ORT 运行时在运行时从 CDN 分块 fetch,
 *   因此只需动态 import,SSR 路径永不加载,Next.js 零配置。
 * - 库内部的 init 以 JSON.stringify(config) 为 key 做 memoize:函数被
 *   stringify 丢弃,所以第二次起拿到的是【第一次调用】的 config ——
 *   包括第一次的 progress 回调。直接把每次调用的回调传进去,后续图片
 *   的进度事件会全部发给已失效的旧闭包。因此 progress 固定为模块级
 *   函数,由 activeListener 转发给当前任务。
 * - 下载进度 key 形如 "fetch:<资源>",每个资源首次出现时才带上自己的
 *   total;模型(44MB)先下完,运行时 wasm 后出现 —— 按"已出现资源"
 *   求和会出现 100% → 66% 的回跳。这里用 resources.json 的已知体积
 *   预置分母,并保证百分比单调递增。
 * - CPU/WASM 推理跑在主线程,推理期间页面不会重绘。库的 4 个 compute
 *   里程碑是在同一段同步/微任务链里连续触发的,React 来不及绘制中间
 *   状态 —— 用户看到的就是"停在解码,然后直接出结果"。所以解码由我们
 *   自己做、PNG 编码也由我们自己做(库只输出原始 RGBA),每一步之前主动
 *   让出主线程等一帧绘制,再进入下一步。推理 + 遮罩放大在库内部是一段
 *   不可拆分的调用,合并为 "Cutting out the subject" 一步,不伪造中间态。
 * - 移动端 WebGPU 驱动稳定性差,统一使用 CPU/WASM,避免 GPU device loss
 *   让 Safari/Chrome 标签页被系统回收并表现为页面刷新。
 */

/** 处理流程的 4 个步骤;ProgressInfo.step 为其下标 */
export const PROCESS_STEPS = [
  "Loading AI model",
  "Decoding image",
  "Cutting out the subject",
  "Encoding PNG",
] as const;

const STEP = { model: 0, decode: 1, cutout: 2, encode: 3 } as const;

/** 每一步至少可见的时长,避免快速步骤一闪而过、看起来像"跳步" */
const MIN_STEP_MS = 220;

const MODEL = "isnet_quint8" as const; // ~42MB,首载友好;输出质量已足够

/**
 * @imgly/background-removal-data 1.7.0 resources.json 中的资源体积(字节)。
 * 仅用作下载百分比的分母预估:资源真正开始下载后以库报告的 total 为准。
 */
const RESOURCE_BYTES: Record<string, number> = {
  [`/models/${MODEL}`]: 44_348_940,
  "/onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm": 23_013_109,
  "/onnxruntime-web/ort-wasm-simd-threaded.jsep.mjs": 49_241,
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm": 11_819_815,
  "/onnxruntime-web/ort-wasm-simd-threaded.mjs": 25_539,
};

type LibProgress = (key: string, current: number, total: number) => void;

/** 当前任务的进度监听;库的 memoized config 永远只调用 forwardProgress */
let activeListener: LibProgress | null = null;
const forwardProgress: LibProgress = (key, current, total) => {
  activeListener?.(key, current, total);
};

/** 模型会话已在本页内存中就绪(后续图片无需再加载) */
let modelReady = false;
/**
 * 库把 init 的 Promise 永久缓存,一次失败(断网、取消)会让之后每次都
 * 拿到同一个 rejected Promise。失败后递增 attempt 改变 memo key,
 * zod 解析时会剥掉这个未知字段,对库行为无影响。
 */
let initAttempt = 0;

/** 模型是否已就绪 —— 界面据此决定初始步骤,避免已缓存时闪现"加载模型" */
export function isModelReady(): boolean {
  return modelReady;
}

/** 让出主线程,等浏览器真正绘制一帧(后台标签页 rAF 不触发,用超时兜底) */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, 100);
    requestAnimationFrame(() => setTimeout(done, 0));
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}

/**
 * 下载百分比:分母 = 预期资源的已知体积。wasm 有 jsep(WebGPU)与普通两种,
 * 若实际下载的变体与预估不同,看到后修正。
 */
function createDownloadTracker(onPct: (pct: number) => void) {
  // device 为 cpu,库只会下载非 jsep 的 wasm 变体
  const variant = "";
  const expected = new Map<string, number>([
    [`/models/${MODEL}`, RESOURCE_BYTES[`/models/${MODEL}`]],
    [`/onnxruntime-web/ort-wasm-simd-threaded${variant}.wasm`, RESOURCE_BYTES[`/onnxruntime-web/ort-wasm-simd-threaded${variant}.wasm`]],
    [`/onnxruntime-web/ort-wasm-simd-threaded${variant}.mjs`, RESOURCE_BYTES[`/onnxruntime-web/ort-wasm-simd-threaded${variant}.mjs`]],
  ]);
  const loaded = new Map<string, number>();
  let shown = 0;

  return (resource: string, current: number, total: number) => {
    if (!expected.has(resource) && resource.startsWith("/onnxruntime-web/")) {
      // 实际走了另一种 wasm 变体:替换掉同扩展名的预估项
      const ext = resource.slice(resource.lastIndexOf("."));
      for (const key of expected.keys()) {
        if (key.startsWith("/onnxruntime-web/") && key.endsWith(ext)) expected.delete(key);
      }
    }
    expected.set(resource, total);
    loaded.set(resource, current);
    let cur = 0;
    let tot = 0;
    for (const [key, size] of expected) {
      tot += size;
      cur += Math.min(loaded.get(key) ?? 0, size);
    }
    // 单调递增;资源全部到手后还要编译 wasm、创建会话,封顶 99% 直到 init 完成
    const pct = Math.min(0.99, tot > 0 ? cur / tot : 0);
    if (pct > shown) {
      shown = pct;
      onPct(pct);
    }
  };
}

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

function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new DOMException("Cancelled", "AbortError"));
    if (signal.aborted) return onAbort();
    signal.addEventListener("abort", onAbort, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort));
  });
}

/** 解码为库可直接读取的原始 RGBA(image/x-rgba8),库内部不再二次解码 */
async function decodeToRgba(
  source: Blob,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(source);
  const { width, height } = bitmap;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Canvas 2D unavailable");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const { data } = context.getImageData(0, 0, width, height);
  canvas.width = canvas.height = 0; // 尽早释放画布显存(移动端尤其重要)
  return {
    blob: new Blob([data], {
      type: `image/x-rgba8;width=${width};height=${height}`,
    }),
    width,
    height,
  };
}

/** 原始 RGBA → 透明 PNG */
async function encodePng(raw: Blob, width: number, height: number): Promise<Blob> {
  const pixels = new Uint8ClampedArray(await raw.arrayBuffer());
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");
  context.putImageData(new ImageData(pixels, width, height), 0, 0);
  const png = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  canvas.width = canvas.height = 0;
  if (!png) throw new Error("PNG encoding failed: out of memory");
  return png;
}

/**
 * 抠图主入口。source 直接传 File/Blob,输出为全分辨率透明 PNG Blob。
 * 进度按 PROCESS_STEPS 逐步上报;模型已在内存中时直接从解码开始。
 */
export async function removeBg(
  source: Blob,
  onProgress: (p: ProgressInfo) => void,
  signal?: AbortSignal,
): Promise<{ blob: Blob }> {
  // 只在用户事件触发的调用栈里动态导入,永不进 SSR / 首屏 chunk
  const { preload, removeBackground } = await import("@imgly/background-removal");
  throwIfAborted(signal);

  // 不传 fetchArgs.signal:它会被 memoize 进共享的 init。取消时只让本次
  // 调用提前返回,下载在后台继续,用户重试时直接复用。
  const config = {
    device: "cpu" as const, // 移动端禁用 WebGPU,避免驱动崩溃导致页面刷新
    model: MODEL,
    publicPath: resolveModelPublicPath(),
    output: { format: "image/x-rgba8" as const, quality: 1 },
    progress: forwardProgress,
    attempt: initAttempt, // 仅用于改变 memo key,见 initAttempt
  };

  const emit = (progress: ProgressInfo) => {
    if (!signal?.aborted) onProgress(progress);
  };
  let stepShownAt = 0;
  /** 保证上一步至少可见 MIN_STEP_MS,上报新步骤并等它真正绘制出来 */
  const enterStep = async (step: number) => {
    const elapsed = performance.now() - stepShownAt;
    if (stepShownAt > 0 && elapsed < MIN_STEP_MS) await sleep(MIN_STEP_MS - elapsed);
    throwIfAborted(signal);
    emit({ step });
    await nextPaint();
    throwIfAborted(signal);
    stepShownAt = performance.now();
  };

  if (!modelReady) {
    await enterStep(STEP.model);
    const track = createDownloadTracker((pct) => emit({ step: STEP.model, pct }));
    activeListener = (key, current, total) => {
      if (key.startsWith("fetch:")) track(key.slice("fetch:".length), current, total);
    };
    const init = withOrtNoiseSilenced(() => preload(config));
    init.then(
      () => {
        modelReady = true;
      },
      () => {
        initAttempt += 1;
      },
    );
    try {
      await abortable(init, signal);
    } finally {
      activeListener = null;
    }
    emit({ step: STEP.model, pct: 1 });
  }

  await enterStep(STEP.decode);
  const decoded = await decodeToRgba(source);

  await enterStep(STEP.cutout);
  const raw = await withOrtNoiseSilenced(() =>
    removeBackground(decoded.blob, config),
  );

  await enterStep(STEP.encode);
  const blob = await encodePng(raw, decoded.width, decoded.height);
  throwIfAborted(signal);

  // 最后一步同样保留最短可见时长,再交给界面切换到结果
  const elapsed = performance.now() - stepShownAt;
  if (elapsed < MIN_STEP_MS) await sleep(MIN_STEP_MS - elapsed);
  throwIfAborted(signal);
  return { blob };
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
