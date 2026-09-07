"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { Dropzone } from "./Dropzone";
import { ProcessingView } from "./ProcessingView";
import { ResultView } from "./ResultView";
import { ErrorView } from "./ErrorView";
import { classifyError, removeBg } from "@/lib/remove-bg";
import { validateImage } from "@/lib/validate";
import type {
  ErrorCode,
  PendingFile,
  Phase,
  ProgressInfo,
  ResultState,
} from "@/types";

type State = {
  phase: Phase;
  progress: ProgressInfo | null;
  error: ErrorCode | null;
  file: PendingFile | null;
  result: ResultState | null;
};

const INITIAL: State = {
  phase: "idle",
  progress: null,
  error: null,
  file: null,
  result: null,
};

type Action =
  | { type: "validating" }
  | { type: "validated"; file: PendingFile }
  | { type: "invalid"; code: ErrorCode }
  | { type: "progress"; progress: ProgressInfo }
  | { type: "done"; result: ResultState }
  | { type: "failed"; code: ErrorCode }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "validating":
      return { ...INITIAL, phase: "validating" };
    case "validated":
      return {
        ...state,
        phase: "modelLoading",
        file: action.file,
        progress: null,
      };
    case "invalid":
      return { ...INITIAL, error: action.code };
    case "progress": {
      const phase: Phase =
        action.progress.stage === "download" ? "modelLoading" : "processing";
      return { ...state, phase, progress: action.progress };
    }
    case "done":
      return { ...state, phase: "done", result: action.result, error: null };
    case "failed":
      return { ...state, phase: "error", error: action.code };
    case "reset":
      return INITIAL;
  }
}

/**
 * 工作台状态机宿主:idle(Hero + 上传区)→ processing → done。
 * 营销区块以 children 传入(Server Component),仅在 idle 相位渲染,
 * 处理/结果视图全屏接管,视觉上等同"换页"。
 */
export function RembgStudio({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  /** objectURL 生命周期统一管理:重置/卸载时统一 revoke */
  const urlsRef = useRef(new Set<string>());
  const track = useCallback((url: string) => {
    urlsRef.current.add(url);
    return url;
  }, []);
  const revokeAll = useCallback(() => {
    for (const url of urlsRef.current) URL.revokeObjectURL(url);
    urlsRef.current.clear();
  }, []);

  useEffect(() => revokeAll, [revokeAll]);

  /** 上传 → 校验 → 抠图的完整管线,五种输入通道都汇入这里 */
  const run = useCallback(
    async (blob: Blob, name: string) => {
      const verdict = validateImage(blob);
      if (!verdict.ok) {
        dispatch({ type: "invalid", code: verdict.code });
        return;
      }
      revokeAll(); // 清理上一轮
      dispatch({ type: "validating" });

      let width = 0;
      let height = 0;
      try {
        const bmp = await createImageBitmap(blob);
        width = bmp.width;
        height = bmp.height;
        bmp.close();
      } catch {
        /* 读不出尺寸不阻塞流程,结果视图会退回默认宽高比 */
      }

      const file: PendingFile = {
        blob,
        url: track(URL.createObjectURL(blob)),
        name,
        size: blob.size,
      };
      dispatch({ type: "validated", file });

      const startedAt = performance.now();
      try {
        const resultBlob = await removeBg(blob, (progress) =>
          dispatch({ type: "progress", progress }),
        );
        dispatch({
          type: "done",
          result: {
            originalUrl: file.url,
            resultUrl: track(URL.createObjectURL(resultBlob)),
            resultBlob,
            fileName: name,
            resultSize: resultBlob.size,
            elapsedMs: performance.now() - startedAt,
            width,
            height,
          },
        });
      } catch (err) {
        dispatch({ type: "failed", code: classifyError(err) });
      }
    },
    [revokeAll, track],
  );

  /** URL / 粘贴文本等通道自身的失败(如跨域拒绝)单独上报 */
  const reportError = useCallback((code: ErrorCode) => {
    dispatch({ type: "invalid", code });
  }, []);

  const reset = useCallback(() => {
    revokeAll();
    dispatch({ type: "reset" });
  }, [revokeAll]);

  /** 离开 idle 时滚回顶部,让处理/结果视图完整呈现 */
  useEffect(() => {
    if (state.phase !== "idle") window.scrollTo({ top: 0 });
  }, [state.phase]);

  if (state.phase === "done" && state.result) {
    return (
      <section id="studio" className="animate-wipe">
        <ResultView result={state.result} onReset={reset} />
      </section>
    );
  }

  if (state.phase === "error" && state.file && state.error) {
    return (
      <ErrorView
        code={state.error}
        onRetry={() => run(state.file!.blob, state.file!.name)}
        onReset={reset}
      />
    );
  }

  if (state.phase !== "idle") {
    return (
      <section id="studio">
        <ProcessingView
          phase={state.phase}
          progress={state.progress}
          file={state.file}
        />
      </section>
    );
  }

  return (
    <>
      <section id="studio" className="relative overflow-hidden">
        {/* 朱砂色微光,纸张氛围 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(232,68,46,0.07),transparent)]"
        />
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="animate-rise mx-auto inline-flex items-center gap-2 rounded-full border border-mist-deep bg-panel px-4 py-1.5 font-mono text-xs text-ink-soft"
              style={{ animationDelay: "0ms" }}
            >
              <span className="inline-block size-1.5 rounded-full bg-jade" />
              AI 模型本地运行 · 图片不上传服务器
            </p>

            <h1
              className="animate-rise mt-6 text-balance text-4xl leading-tight font-bold tracking-tight sm:text-6xl"
              style={{ animationDelay: "90ms" }}
            >
              上传图片,
              <span className="relative inline-block whitespace-nowrap">
                <span className="text-vermilion">一键剪掉</span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full text-vermilion/60"
                >
                  <path
                    d="M2 8 H130"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                  />
                  <path d="M138 8 H198" stroke="none" />
                </svg>
              </span>
              背景
            </h1>

            <p
              className="animate-rise mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              100% 自动、数秒完成、免费输出全分辨率透明 PNG。
              一切都发生在你的浏览器里 —— 完成后,背景就真的消失了。
            </p>

            <div
              className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-ink-faint"
              style={{ animationDelay: "240ms" }}
            >
              <span>JPG · PNG · WebP</span>
              <span aria-hidden>·</span>
              <span>最大 22MB</span>
              <span aria-hidden>·</span>
              <span>透明背景输出</span>
            </div>
          </div>

          {/* 上传区 */}
          <div
            className="animate-rise mt-12"
            style={{ animationDelay: "320ms" }}
          >
            <Dropzone
              onStart={run}
              onError={reportError}
              error={state.error}
            />
          </div>
        </div>
      </section>
      {children}
    </>
  );
}
