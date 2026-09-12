import type { ErrorCode } from "@/types";

export const MAX_FILE_BYTES = 22 * 1024 * 1024; // 22MB,对齐 remove.bg
export const MAX_INPUT_DIMENSION = 12_000;
export const MAX_INPUT_PIXELS = 60_000_000;
export const PROCESS_MAX_DIMENSION = 4_096;
export const PROCESS_MAX_PIXELS = 16_000_000;

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ValidateResult =
  | { ok: true }
  | { ok: false; code: Extract<ErrorCode, "FORMAT" | "SIZE"> };

export type PreparedImage = {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  downsampled: boolean;
};

export class ImageValidationError extends Error {
  constructor(public readonly code: ErrorCode) {
    super(code);
    this.name = "ImageValidationError";
  }
}

/** 统一入口校验:所有输入通道(文件/拖放/粘贴/URL/示例)都走这里 */
export function validateImage(blob: Blob): ValidateResult {
  if (!ACCEPTED_TYPES.has(blob.type)) return { ok: false, code: "FORMAT" };
  if (blob.size > MAX_FILE_BYTES) return { ok: false, code: "SIZE" };
  return { ok: true };
}

/** 解码、像素检查，并把超出处理预算的手机大图等比缩小。 */
export async function prepareImage(blob: Blob): Promise<PreparedImage> {
  const verdict = validateImage(blob);
  if (!verdict.ok) throw new ImageValidationError(verdict.code);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    throw new ImageValidationError("DECODE");
  }

  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const pixels = originalWidth * originalHeight;
  if (
    originalWidth > MAX_INPUT_DIMENSION ||
    originalHeight > MAX_INPUT_DIMENSION ||
    pixels > MAX_INPUT_PIXELS
  ) {
    bitmap.close();
    throw new ImageValidationError("DIMENSIONS");
  }

  const scale = Math.min(
    1,
    PROCESS_MAX_DIMENSION / Math.max(originalWidth, originalHeight),
    Math.sqrt(PROCESS_MAX_PIXELS / pixels),
  );
  if (scale === 1) {
    bitmap.close();
    return {
      blob,
      width: originalWidth,
      height: originalHeight,
      originalWidth,
      originalHeight,
      downsampled: false,
    };
  }

  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new ImageValidationError("BROWSER_UNSUPPORTED");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const resized = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new ImageValidationError("DECODE")),
      "image/jpeg",
      0.92,
    );
  });
  return {
    blob: resized,
    width,
    height,
    originalWidth,
    originalHeight,
    downsampled: true,
  };
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
  DECODE: {
    title: "Couldn't read this image",
    hint: "The file may be damaged or incomplete. Try exporting it again or choose another photo.",
  },
  DIMENSIONS: {
    title: "Image dimensions are too large",
    hint: "Use an image under 60 megapixels with no side longer than 12,000 pixels.",
  },
  FETCH_URL: {
    title: "Couldn't load the image",
    hint: "The sample image failed to load. Check your connection and try again.",
  },
  MODEL_DOWNLOAD: {
    title: "AI model download failed",
    hint: "Check your network connection and retry. The model is cached after the first download.",
  },
  MODEL_CACHE: {
    title: "Browser cache is unavailable",
    hint: "Free some browser storage, leave private browsing, then retry the model download.",
  },
  BROWSER_UNSUPPORTED: {
    title: "This browser isn't supported",
    hint: "Use a current version of Chrome, Edge, Firefox or Safari with WebAssembly enabled.",
  },
  CANCELLED: {
    title: "Processing cancelled",
    hint: "Your photo stayed on this device. Choose Retry when you are ready.",
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
