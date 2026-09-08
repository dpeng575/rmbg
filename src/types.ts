/** 工作台状态机的六个相位 */
export type Phase =
  | "idle" // 首页上传态
  | "validating" // 校验/读取图片元信息(瞬态)
  | "modelLoading" // 下载模型,有真实字节百分比
  | "processing" // 推理中,只有 4 个里程碑
  | "done" // 结果展示
  | "error"; // 处理失败(可重试)

/** 处理进度:下载阶段为真实百分比,推理阶段为 4 步里程碑 */
export type ProgressInfo =
  | { stage: "download"; pct: number }
  | { stage: "compute"; stepIndex: number };

/** 统一错误码,映射到用户可读文案 */
export type ErrorCode =
  | "FORMAT"
  | "SIZE"
  | "FETCH_URL"
  | "MODEL_DOWNLOAD"
  | "INFERENCE"
  | "MEMORY";

/** 待处理文件(校验通过后进入状态机) */
export type PendingFile = {
  blob: Blob;
  url: string; // objectURL,预览用
  name: string;
  size: number;
};

/** 处理完成后的结果快照 */
export type ResultState = {
  originalUrl: string;
  resultUrl: string;
  resultBlob: Blob;
  fileName: string;
  resultSize: number;
  elapsedMs: number;
  width: number;
  height: number;
  timings: StageTimings;
};

/** 各阶段耗时拆分(毫秒),用于定位瓶颈 */
export type StageTimings = {
  downloadMs: number; // 模型/运行时下载(首载;缓存后≈0)
  decodeMs: number; // 图片解码 + ORT 会话创建
  inferenceMs: number; // AI 推理(与图片分辨率无关,约恒定)
  outputMs: number; // 遮罩放大合成 + PNG 编码(随分辨率线性增长)
};
