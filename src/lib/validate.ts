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
    title: "Unsupported image format",
    hint: "Only JPG, PNG and WebP images are supported. Convert GIF or other formats first.",
  },
  SIZE: {
    title: "File is too large",
    hint: "Please upload an image smaller than 22 MB.",
  },
  FETCH_URL: {
    title: "Couldn't load the image",
    hint: "The sample image failed to load. Check your connection and try again.",
  },
  MODEL_DOWNLOAD: {
    title: "AI model download failed",
    hint: "Check your network connection and retry. The model is cached after the first download.",
  },
  INFERENCE: {
    title: "Processing failed",
    hint: "Please retry, or try a photo with a clearer subject.",
  },
  MEMORY: {
    title: "Not enough memory",
    hint: "The image is very large. Try a smaller photo.",
  },
};
