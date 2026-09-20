/** 触发浏览器下载(锚点需先挂到 DOM,游离元素在 WebKit 里 click() 可能无效) */
export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** iOS 检测(iPadOS 13+ 会伪装成 Mac,需触点数辅助判断) */
function isIOSLike(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * 保存文件:iOS 全系浏览器(含 Chrome)均为 WebKit,对 <a download>+blob:URL
 * 支持不可靠,点击会静默无效 → 改走 Web Share(系统分享面板可"存储到照片")。
 * 其余平台仍用锚点下载。用户取消分享(AbortError)不算成功。
 * @returns 是否成功保存
 */
export async function saveBlob(blob: Blob, filename: string): Promise<boolean> {
  if (isIOSLike()) {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return false;
        // 其它异常(如上下文失效)→ 落回锚点下载
      }
    }
  }
  downloadBlob(blob, filename);
  return true;
}

/** 结果命名:<原文件名>-switchbg.<ext> */
export function resultFilename(originalName: string, ext: "png" | "jpg") {
  const base = originalName.replace(/\.[^.]+$/, "") || "image";
  return `${base}-switchbg.${ext}`;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function formatElapsed(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.round(ms)} ms`;
}
