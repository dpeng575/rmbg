"use client";

import { Check, Scissors } from "lucide-react";
import { COMPUTE_STEPS } from "@/lib/remove-bg";
import { formatBytes } from "@/lib/download";
import type { PendingFile, Phase, ProgressInfo } from "@/types";

type Props = {
  phase: Phase;
  progress: ProgressInfo | null;
  file: PendingFile | null;
};

/**
 * 处理视图:下载阶段显示真实百分比,推理阶段显示 4 步里程碑。
 * 动画只用 transform/opacity(合成器驱动)—— CPU 推理会阻塞主线程,
 * JS 驱动的动画会冻结,而这些不会。
 */
export function ProcessingView({ phase, progress, file }: Props) {
  const downloading =
    progress === null || progress.stage === "download";
  const pct =
    progress?.stage === "download" ? Math.floor(progress.pct * 100) : 0;
  const stepIndex =
    progress && progress.stage === "compute" ? progress.stepIndex : -1;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      {file && (
        <p className="mb-10 max-w-full truncate rounded-full border border-mist-deep bg-panel px-4 py-1.5 font-mono text-xs text-ink-soft">
          {file.name} · {formatBytes(file.size)}
        </p>
      )}

      {/* 品牌标记:breathe 动画 = transform/opacity */}
      <div className="animate-breathe flex size-16 items-center justify-center rounded-2xl bg-ink text-paper shadow-lift">
        <Scissors className="size-7" strokeWidth={1.75} />
      </div>

      <div aria-live="polite" className="mt-8 w-full max-w-md">
        {downloading ? (
          <>
            <h2 className="text-xl font-semibold">
              {phase === "validating" ? "正在读取图片…" : "正在加载 AI 模型"}
            </h2>
            <p className="mt-2 font-mono text-5xl font-bold tabular-nums text-vermilion">
              {pct}
              <span className="text-2xl">%</span>
            </p>
            {/* scaleX 进度条:小尺寸棋盘格轨道(与条高对齐)+ 朱砂填充。
                填充不带圆角 —— scaleX 会把圆角横向压扁,由外层轨道裁剪端部 */}
            <div className="checkerboard-bar mt-6 h-3 overflow-hidden rounded-full">
              <div
                className="h-full origin-left bg-vermilion transition-transform duration-300 ease-out"
                style={{ transform: `scaleX(${Math.max(pct, 0.02)})` }}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              首次使用需下载约 50MB 模型(仅此一次,之后会缓存)。
              <br className="hidden sm:block" />
              下载完成后,AI 将在你的浏览器里本地完成抠图。
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">正在抠图…</h2>
            <p className="mt-2 text-sm text-ink-soft">
              模型就绪,正在本地推理。视设备性能,通常需要几秒钟。
            </p>
            <ol className="mx-auto mt-8 max-w-xs space-y-3 text-left">
              {COMPUTE_STEPS.map((label, i) => {
                const done = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <li
                    key={label}
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors duration-300",
                      current
                        ? "bg-vermilion-wash font-medium text-vermilion-deep"
                        : done
                          ? "text-ink-soft"
                          : "text-ink-faint",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                        done
                          ? "border-jade bg-jade text-white"
                          : current
                            ? "border-vermilion"
                            : "border-mist-deep",
                      ].join(" ")}
                    >
                      {done ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : (
                        i + 1
                      )}
                    </span>
                    {label}
                    {current && (
                      <span className="animate-shimmer shimmer-bar ml-auto h-2 w-10 rounded-full bg-vermilion/20" />
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
