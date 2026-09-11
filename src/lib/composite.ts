import type { BackgroundOption } from "./backgrounds";

/**
 * 合成引擎:前景(抠图 PNG)× 背景 → JPEG。
 * 预览走降采样(≤1400px,切背景即时出图);
 * 「下载 HD」时才用原分辨率离屏合成,大图不卡交互。
 */

export type Size = { width: number; height: number };

const PREVIEW_MAX = 1400;

/** 预览尺寸:保持宽高比,最长边压到 1400 */
export function previewSize(width: number, height: number): Size {
  const scale = Math.min(1, PREVIEW_MAX / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** 背景照片位图缓存(切背景时避免重复解码) */
const bgBitmapCache = new Map<string, ImageBitmap>();

export async function getBgBitmap(bg: BackgroundOption): Promise<ImageBitmap | null> {
  if (bg.kind !== "image") return null;
  let bmp = bgBitmapCache.get(bg.src);
  if (!bmp) {
    const res = await fetch(bg.src);
    const blob = await res.blob();
    bmp = await createImageBitmap(blob);
    bgBitmapCache.set(bg.src, bmp);
  }
  return bmp;
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  bg: BackgroundOption,
  width: number,
  height: number,
) {
  if (bg.kind === "color") {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (bg.kind === "gradient") {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bg.from);
    gradient.addColorStop(1, bg.to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (bg.kind === "image") {
    const bmp = bgBitmapCache.get(bg.src);
    if (!bmp) return;
    // cover-fit:等比放大铺满画布,居中裁切
    const scale = Math.max(width / bmp.width, height / bmp.height);
    const dw = bmp.width * scale;
    const dh = bmp.height * scale;
    ctx.drawImage(bmp, (width - dw) / 2, (height - dh) / 2, dw, dh);
  }
}

/**
 * 合成前景与背景。cutout 与目标画布同宽高比,直接铺满;
 * 输出 JPEG(背景填充后无透明需求),质量 preview 0.9 / HD 0.95。
 */
export async function renderComposite(
  cutout: ImageBitmap,
  bg: BackgroundOption,
  size: Size,
  quality = 0.9,
): Promise<Blob> {
  if (bg.kind === "transparent") {
    throw new Error("transparent background does not composite");
  }
  await getBgBitmap(bg); // 确保照片背景已解码进缓存

  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d unavailable");

  paintBackground(ctx, bg, size.width, size.height);
  ctx.drawImage(cutout, 0, 0, size.width, size.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("JPEG encode failed"))),
      "image/jpeg",
      quality,
    );
  });
}
