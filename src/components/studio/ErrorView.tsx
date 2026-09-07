"use client";

import { CircleAlert, RotateCcw, Upload } from "lucide-react";
import { ERROR_COPY } from "@/lib/validate";
import type { ErrorCode } from "@/types";

type Props = {
  code: ErrorCode;
  onRetry: () => void;
  onReset: () => void;
};

/** 处理失败:可重试同一文件,或换一张 */
export function ErrorView({ code, onRetry, onReset }: Props) {
  const copy = ERROR_COPY[code];
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="animate-pop flex size-16 items-center justify-center rounded-2xl bg-vermilion-wash text-vermilion">
        <CircleAlert className="size-8" strokeWidth={1.75} />
      </div>
      <h2 className="mt-6 text-2xl font-bold">{copy.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{copy.hint}</p>
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-vermilion px-6 py-3 text-sm font-semibold text-white shadow-panel transition-colors hover:bg-vermilion-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
        >
          <RotateCcw className="size-4" />
          重试
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-panel px-6 py-3 text-sm font-medium transition-colors hover:border-ink/40"
        >
          <Upload className="size-4" />
          换一张
        </button>
      </div>
    </div>
  );
}
