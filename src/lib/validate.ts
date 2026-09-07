import type { ErrorCode } from "@/types";

export const MAX_FILE_BYTES = 22 * 1024 * 1024; // 22MB,对齐 remove.bg

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ValidateResult =
  | { ok: true }
  | { ok: false; code: Extract<ErrorCode, "FORMAT" | "SIZE"> };

/** 统一入口校验:所有输入通道(文件/拖放/粘贴/URL/示例)都走这里 */
export function validateImage(blob: Blob): ValidateResult {
  if (!ACCEPTED_TYPES.has(blob.type)) return { ok: false, code: "FORMAT" };
  if (blob.size > MAX_FILE_BYTES) return { ok: false, code: "SIZE" };
  return { ok: true };
}

/** 错误码 → 用户可读文案 */
export const ERROR_COPY: Record<
  ErrorCode,
  { title: string; hint: string }
> = {
  FORMAT: {
    title: "不支持的图片格式",
    hint: "仅支持 JPG、PNG 和 WebP 图片,GIF 等格式请先转换。",
  },
  SIZE: {
    title: "文件太大了",
    hint: "请上传 22MB 以内的图片。",
  },
  FETCH_URL: {
    title: "无法获取链接图片",
    hint: "该地址可能不允许跨域访问。试试直接的图片地址,或改用本地上传。",
  },
  MODEL_DOWNLOAD: {
    title: "AI 模型下载失败",
    hint: "请检查网络连接后重试,模型下载完成后会缓存到本地。",
  },
  INFERENCE: {
    title: "处理失败",
    hint: "请重试,或换一张主体更清晰的图片。",
  },
  MEMORY: {
    title: "内存不足",
    hint: "图片尺寸过大,请换一张较小的图片再试。",
  },
};
