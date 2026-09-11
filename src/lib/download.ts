/** 触发浏览器下载 */
export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
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
