/** 共享类型:错误码 / 进度 / 阶段耗时(remove-bg.ts 与工具岛使用) */

/** 统一错误码,映射到用户可读文案 */
export type ErrorCode =
  | "FORMAT"
  | "SIZE"
  | "DECODE"
  | "DIMENSIONS"
  | "FETCH_URL"
  | "MODEL_DOWNLOAD"
  | "MODEL_CACHE"
  | "BROWSER_UNSUPPORTED"
  | "CANCELLED"
  | "INFERENCE"
  | "MEMORY";

/** 处理进度:下载阶段为真实百分比,推理阶段为 4 步里程碑 */
export type ProgressInfo =
  | { stage: "download"; pct: number }
  | { stage: "compute"; stepIndex: number };

/** 各阶段耗时拆分(毫秒),用于定位瓶颈 */
export type StageTimings = {
  downloadMs: number; // 模型/运行时下载(首载;缓存后≈0)
  decodeMs: number; // 图片解码 + ORT 会话创建
  inferenceMs: number; // AI 推理(与图片分辨率无关,约恒定)
  outputMs: number; // 遮罩放大合成 + PNG 编码(随分辨率线性增长)
};
