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

/**
 * 处理进度:step 为 PROCESS_STEPS 下标(0 = 加载模型)。
 * pct 仅在 step 0 下载模型时出现,0..1 单调递增。
 */
export type ProgressInfo = { step: number; pct?: number };
