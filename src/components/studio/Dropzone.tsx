"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { ImagePlus, Link2, Scissors, Upload } from "lucide-react";
import { ERROR_COPY } from "@/lib/validate";
import type { ErrorCode } from "@/types";

const SAMPLES = [
  { src: "/samples/portrait.jpg", label: "人像" },
  { src: "/samples/product.jpg", label: "商品" },
  { src: "/samples/pet.jpg", label: "宠物" },
] as const;

type Props = {
  onStart: (blob: Blob, name: string) => void;
  onError: (code: ErrorCode) => void;
  error: ErrorCode | null;
};

async function fetchImageUrl(url: string): Promise<Blob> {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

function nameFromUrl(url: string): string {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    return last && /\.[a-z0-9]+$/i.test(last) ? last : "url-image";
  } catch {
    return "url-image";
  }
}

/** 上传区:点击 / 拖放 / 粘贴图片 / 输入 URL / 示例图,五通道归一到 onStart */
export function Dropzone({ onStart, onError, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const [url, setUrl] = useState("");
  const [urlBusy, setUrlBusy] = useState(false);

  const pickFile = useCallback(
    (file: File | Blob | null | undefined, fallbackName = "pasted-image") => {
      if (!file) return;
      const name = file instanceof File && file.name ? file.name : fallbackName;
      onStart(file, name);
    },
    [onStart],
  );

  // —— 粘贴通道:全局监听,剪贴板里有图片就开工 ——
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          pickFile(item.getAsFile(), "pasted-image");
          return;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [pickFile]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    pickFile(e.target.files?.[0]);
    e.target.value = ""; // 允许重复选择同一文件
  };

  // —— 拖放通道:计数器防子元素闪烁 ——
  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };
  const onDragOver = (e: DragEvent) => e.preventDefault();
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      pickFile(file);
      return;
    }
    // 从其他标签页拖来的图片:走 URL 通道
    const uri =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");
    if (uri && /^https?:\/\//i.test(uri.trim())) submitUrl(uri.trim());
  };

  // —— URL 通道 ——
  const submitUrl = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      if (!value || urlBusy) return;
      setUrlBusy(true);
      try {
        const blob = await fetchImageUrl(value);
        onStart(blob, nameFromUrl(value));
        setUrl("");
      } catch {
        onError("FETCH_URL");
      } finally {
        setUrlBusy(false);
      }
    },
    [onError, onStart, urlBusy],
  );

  const onUrlSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitUrl(url);
  };

  // —— 示例图通道:同源 fetch 成 Blob ——
  const loadSample = useCallback(
    async (src: string, label: string) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        onStart(blob, `示例-${label}.jpg`);
      } catch {
        onError("FETCH_URL");
      }
    },
    [onError, onStart],
  );

  return (
    <div className="mx-auto max-w-3xl">
      {error && (
        <div
          role="alert"
          className="animate-pop mb-4 rounded-2xl border border-vermilion/30 bg-vermilion-wash px-5 py-4"
        >
          <p className="text-sm font-semibold text-vermilion-deep">
            {ERROR_COPY[error].title}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{ERROR_COPY[error].hint}</p>
        </div>
      )}

      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={[
          "relative rounded-3xl border-2 border-dashed bg-panel px-6 py-12 text-center shadow-panel transition-[border-color,background-color,transform] duration-200 sm:px-10 sm:py-16",
          dragging
            ? "scale-[1.01] border-vermilion bg-vermilion-wash"
            : "border-mist-deep hover:border-vermilion/50",
        ].join(" ")}
      >
        {/* 拖放时的棋盘格暗示:角落透明纹理 */}
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute top-4 right-4 size-10 rounded-lg transition-opacity duration-200",
            dragging ? "checkerboard-fine opacity-100" : "opacity-0",
          ].join(" ")}
        />

        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-ink text-paper shadow-panel">
          <Scissors className="size-6" strokeWidth={1.75} />
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-vermilion px-8 py-3.5 text-base font-semibold text-white shadow-panel transition-[background-color,transform] duration-150 hover:bg-vermilion-deep active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
        >
          <Upload className="size-5" strokeWidth={2} />
          上传图片
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onInputChange}
        />

        <p className="mt-4 text-sm text-ink-soft">
          或将图片<span className="font-medium text-ink">拖到这里</span>
          ,也可以直接
          <kbd className="mx-1 rounded-md border border-mist-deep bg-mist px-1.5 py-0.5 font-mono text-xs">
            Ctrl/⌘ + V
          </kbd>
          粘贴
        </p>

        {/* URL 通道 */}
        <form
          onSubmit={onUrlSubmit}
          className="mx-auto mt-6 flex max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="粘贴图片 URL…"
              className="w-full rounded-full border border-mist-deep bg-paper py-2.5 pr-4 pl-10 text-sm transition-colors placeholder:text-ink-faint focus:border-vermilion focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || urlBusy}
            className="rounded-full border border-ink/15 bg-panel px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {urlBusy ? "获取中…" : "获取"}
          </button>
        </form>

        {/* 示例图通道 */}
        <div className="mt-8">
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
            <ImagePlus className="size-3.5" />
            没有图片?试试这些
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            {SAMPLES.map((s) => (
              <button
                key={s.src}
                type="button"
                onClick={() => void loadSample(s.src, s.label)}
                className="group relative size-16 overflow-hidden rounded-xl border border-mist-deep shadow-panel transition-transform duration-150 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion sm:size-20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={`示例:${s.label}`}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-ink/55 py-0.5 text-center text-[11px] text-white backdrop-blur-sm">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        上传即表示同意本站的演示条款。图片仅在浏览器内存中处理,
        <span className="font-medium text-ink-soft">
          刷新或关闭页面后即刻消失,不经过任何服务器
        </span>
        。
      </p>
    </div>
  );
}
