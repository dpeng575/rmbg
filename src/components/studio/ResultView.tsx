"use client";

import { useState } from "react";
import {
  Check,
  Download,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { CompareSlider } from "./CompareSlider";
import {
  downloadResult,
  formatBytes,
  formatElapsed,
} from "@/lib/download";
import type { ResultState } from "@/types";

type ViewMode = "compare" | "original" | "result";

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: "compare", label: "对比" },
  { key: "original", label: "原图" },
  { key: "result", label: "效果" },
];

type Props = {
  result: ResultState;
  onReset: () => void;
};

export function ResultView({ result, onReset }: Props) {
  const [view, setView] = useState<ViewMode>("compare");
  const [downloaded, setDownloaded] = useState(false);
  const [rating, setRating] = useState<"up" | "down" | null>(null);

  const handleDownload = () => {
    downloadResult(result.resultBlob, result.fileName);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2600);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* 顶部信息条 */}
      <div className="animate-rise flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-jade-wash text-jade">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              背景消除完成
            </p>
            <p className="truncate font-mono text-xs text-ink-faint">
              {result.fileName}
              {result.width > 0 &&
                ` · ${result.width}×${result.height}`}
              {" · "}
              {formatElapsed(result.elapsedMs)}
            </p>
          </div>
        </div>

        {/* 三视图切换 */}
        <div
          role="tablist"
          aria-label="查看模式"
          className="flex rounded-full border border-mist-deep bg-panel p-1"
        >
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={view === tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                view === tab.key
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:text-ink",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 主视图 */}
      <div className="animate-rise mt-6" style={{ animationDelay: "80ms" }}>
        {view === "compare" && (
          <CompareSlider
            beforeUrl={result.originalUrl}
            afterUrl={result.resultUrl}
            width={result.width}
            height={result.height}
          />
        )}
        {view === "original" && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={result.originalUrl}
            alt="原图"
            className="mx-auto max-h-[70vh] w-auto rounded-2xl border border-mist shadow-panel"
          />
        )}
        {view === "result" && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={result.resultUrl}
            alt="抠图结果"
            className="checkerboard mx-auto max-h-[70vh] w-auto rounded-2xl shadow-panel"
          />
        )}
      </div>

      {/* 操作条 */}
      <div
        className="animate-rise mt-8 flex flex-col items-center gap-4"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2.5 rounded-full bg-vermilion px-8 py-3.5 text-base font-semibold text-white shadow-lift transition-[background-color,transform] duration-150 hover:bg-vermilion-deep active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
          >
            {downloaded ? (
              <Check className="size-5" strokeWidth={2.5} />
            ) : (
              <Download className="size-5" strokeWidth={2} />
            )}
            {downloaded ? "已开始下载" : "下载透明 PNG"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-panel px-6 py-3.5 text-sm font-medium transition-colors hover:border-ink/40"
          >
            <RotateCcw className="size-4" />
            再处理一张
          </button>
        </div>

        <p className="font-mono text-xs text-ink-faint">
          免费 · 全分辨率 · {formatBytes(result.resultSize)} · 透明背景
        </p>

        {/* 评分 */}
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          {rating ? (
            <p className="animate-pop">
              {rating === "up" ? "太好了,感谢反馈!" : "收到,我们会继续改进。"}
            </p>
          ) : (
            <>
              <span>给这个结果评分:</span>
              <button
                type="button"
                aria-label="好评"
                onClick={() => setRating("up")}
                className="flex size-9 items-center justify-center rounded-full border border-mist-deep bg-panel transition-colors hover:border-jade hover:text-jade"
              >
                <ThumbsUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label="差评"
                onClick={() => setRating("down")}
                className="flex size-9 items-center justify-center rounded-full border border-mist-deep bg-panel transition-colors hover:border-vermilion hover:text-vermilion"
              >
                <ThumbsDown className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
