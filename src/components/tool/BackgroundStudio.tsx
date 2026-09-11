"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  AlertCircle,
  Check,
  Download,
  FileImage,
  ImageDown,
  Layers,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gallery } from "./Gallery";
import {
  previewSize,
  renderComposite,
} from "@/lib/composite";
import { downloadBlob, formatElapsed, resultFilename } from "@/lib/download";
import { COMPUTE_STEPS, classifyError, removeBg } from "@/lib/remove-bg";
import { ERROR_COPY, validateImage } from "@/lib/validate";
import type { BackgroundOption } from "@/lib/backgrounds";
import type { ErrorCode, ProgressInfo } from "@/types";

/* ============================================================
   状态机:① idle(上传 + 图库) → processing → ready
   ready 又分:② 未选背景(棋盘格抠图 + 提示) ③ 已选背景(合成预览 + 下载 HD)
   ============================================================ */

type Phase = "idle" | "validating" | "processing" | "ready" | "error";

type Cutout = {
  bitmap: ImageBitmap;
  url: string; // objectURL,透明展示与下载用
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
  elapsedMs: number;
};

type State = {
  phase: Phase;
  progress: ProgressInfo | null;
  error: ErrorCode | null;
  cutout: Cutout | null;
  originalUrl: string | null;
  originalName: string; // 重试用
  retryBlob: Blob | null; // 重试用
  selected: BackgroundOption | null;
  previewUrl: string | null;
  compositing: boolean;
  compare: "result" | "original";
  exporting: boolean;
  downloaded: boolean;
};

const INITIAL: State = {
  phase: "idle",
  progress: null,
  error: null,
  cutout: null,
  originalUrl: null,
  originalName: "",
  retryBlob: null,
  selected: null,
  previewUrl: null,
  compositing: false,
  compare: "result",
  exporting: false,
  downloaded: false,
};

type Action =
  | { type: "validating" }
  | { type: "processing"; originalUrl: string; name: string; blob: Blob }
  | { type: "progress"; progress: ProgressInfo }
  | { type: "done"; cutout: Cutout }
  | { type: "failed"; code: ErrorCode }
  | { type: "invalid"; code: ErrorCode }
  | { type: "select"; bg: BackgroundOption }
  | { type: "preview"; url: string | null }
  | { type: "compositing"; on: boolean }
  | { type: "compare"; view: "result" | "original" }
  | { type: "exporting"; on: boolean }
  | { type: "downloaded" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "validating":
      return { ...INITIAL, phase: "validating", selected: state.selected };
    case "processing":
      return {
        ...state,
        phase: "processing",
        progress: null,
        error: null,
        originalUrl: action.originalUrl,
        originalName: action.name,
        retryBlob: action.blob,
        cutout: null,
        previewUrl: null,
      };
    case "progress":
      return { ...state, progress: action.progress };
    case "done":
      return { ...state, phase: "ready", cutout: action.cutout, error: null };
    case "failed":
      return { ...state, phase: "error", error: action.code };
    case "invalid":
      return { ...INITIAL, selected: state.selected, error: action.code };
    case "select":
      return { ...state, selected: action.bg, compare: "result" };
    case "preview":
      return { ...state, previewUrl: action.url };
    case "compositing":
      return { ...state, compositing: action.on };
    case "compare":
      return { ...state, compare: action.view };
    case "exporting":
      return { ...state, exporting: action.on };
    case "downloaded":
      return { ...state, downloaded: true };
    case "reset":
      return INITIAL;
  }
}

const SAMPLES = [
  { src: "/samples/portrait.jpg", label: "Portrait" },
  { src: "/samples/product.jpg", label: "Product" },
  { src: "/samples/pet.jpg", label: "Pet" },
] as const;

export function BackgroundStudio() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /** objectURL 与位图生命周期统一管理 */
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

  /** 回调里需要的最新引用 */
  const selectedRef = useRef(state.selected);
  const cutoutRef = useRef(state.cutout);
  useEffect(() => {
    selectedRef.current = state.selected;
    cutoutRef.current = state.cutout;
  });

  /** 合成预览(降采样,切背景即时出图) */
  const applyComposite = useCallback(
    async (cutout: Cutout, bg: BackgroundOption | null) => {
      if (!bg || bg.kind === "transparent") {
        dispatch({ type: "preview", url: null });
        return;
      }
      dispatch({ type: "compositing", on: true });
      try {
        const blob = await renderComposite(
          cutout.bitmap,
          bg,
          previewSize(cutout.width, cutout.height),
          0.9,
        );
        dispatch({ type: "preview", url: track(URL.createObjectURL(blob)) });
      } catch {
        dispatch({ type: "preview", url: null });
      } finally {
        dispatch({ type: "compositing", on: false });
      }
    },
    [track],
  );

  /** 上传 → 校验 → 抠图完整管线 */
  const run = useCallback(
    async (blob: Blob, name: string) => {
      const verdict = validateImage(blob);
      if (!verdict.ok) {
        dispatch({ type: "invalid", code: verdict.code });
        return;
      }
      revokeAll();
      dispatch({ type: "validating" });

      let width = 0;
      let height = 0;
      try {
        const bmp = await createImageBitmap(blob);
        width = bmp.width;
        height = bmp.height;
        bmp.close();
      } catch {
        /* 读不出尺寸不阻塞,合成时兜底 */
      }

      dispatch({
        type: "processing",
        originalUrl: track(URL.createObjectURL(blob)),
        name,
        blob,
      });

      const startedAt = performance.now();
      try {
        const { blob: cutoutBlob } = await removeBg(blob, (progress) =>
          dispatch({ type: "progress", progress }),
        );
        const bitmap = await createImageBitmap(cutoutBlob);
        const cutout: Cutout = {
          bitmap,
          url: track(URL.createObjectURL(cutoutBlob)),
          blob: cutoutBlob,
          width: width || bitmap.width,
          height: height || bitmap.height,
          fileName: name,
          elapsedMs: performance.now() - startedAt,
        };
        dispatch({ type: "done", cutout });

        // 状态①预选过背景 → 直接进入合成(跳过②)
        const preselected = selectedRef.current;
        if (preselected && preselected.kind !== "transparent") {
          void applyComposite(cutout, preselected);
        }
      } catch (err) {
        console.error("[switchbg] raw error:", err);
        dispatch({ type: "failed", code: classifyError(err) });
      }
    },
    [applyComposite, revokeAll, track],
  );

  const onSelect = useCallback(
    (bg: BackgroundOption) => {
      dispatch({ type: "select", bg });
      const cutout = cutoutRef.current;
      if (cutout) void applyComposite(cutout, bg);
    },
    [applyComposite],
  );

  const onDownload = useCallback(async () => {
    const cutout = cutoutRef.current;
    if (!cutout) return;
    const selected = selectedRef.current;
    // 未选背景 / 透明:下载抠图 PNG
    if (!selected || selected.kind === "transparent") {
      downloadBlob(cutout.blob, resultFilename(cutout.fileName, "png"));
      dispatch({ type: "downloaded" });
      return;
    }
    dispatch({ type: "exporting", on: true });
    try {
      const blob = await renderComposite(
        cutout.bitmap,
        selected,
        { width: cutout.width, height: cutout.height },
        0.95,
      );
      downloadBlob(blob, resultFilename(cutout.fileName, "jpg"));
      dispatch({ type: "downloaded" });
    } catch (err) {
      console.error("[switchbg] export failed:", err);
    } finally {
      dispatch({ type: "exporting", on: false });
    }
  }, []);

  const reset = useCallback(() => {
    cutoutRef.current?.bitmap.close();
    revokeAll();
    dispatch({ type: "reset" });
  }, [revokeAll]);

  const pickFile = useCallback(
    (file: Blob | null | undefined, fallbackName = "pasted-image") => {
      if (!file) return;
      const name =
        file instanceof File && file.name ? file.name : fallbackName;
      void run(file, name);
    },
    [run],
  );

  const loadSample = useCallback(
    async (src: string, label: string) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        void run(blob, `sample-${label.toLowerCase()}.jpg`);
      } catch {
        dispatch({ type: "invalid", code: "FETCH_URL" });
      }
    },
    [run],
  );

  /** 粘贴通道(仅 idle) */
  useEffect(() => {
    if (state.phase !== "idle") return;
    const onPaste = (e: ClipboardEvent) => {
      for (const item of e.clipboardData?.items ?? []) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          pickFile(item.getAsFile());
          return;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [state.phase, pickFile]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    pickFile(e.target.files?.[0]);
    e.target.value = "";
  };

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
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const ready = state.phase === "ready" && state.cutout;
  const transparentView =
    ready && (!state.selected || state.selected.kind === "transparent");

  return (
    <section id="tool" className="scroll-mt-20 pt-10 pb-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          {/* —— 状态① 上传 —— */}
          {state.phase === "idle" && (
            <>
              {state.error && (
                <div
                  role="alert"
                  className="animate-pop mb-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-destructive">
                    {ERROR_COPY[state.error].title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {ERROR_COPY[state.error].hint}
                  </p>
                </div>
              )}
              <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={[
                  "rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
                  dragging
                    ? "scale-[1.005] border-primary bg-primary/5"
                    : "border-input hover:border-primary/50",
                ].join(" ")}
              >
                <span className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="size-6" strokeWidth={1.75} />
                </span>
                <Button
                  size="lg"
                  className="mt-5 cursor-pointer px-8"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="size-4.5" />
                  Upload a photo
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onInputChange}
                />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag & drop, or paste from clipboard (⌘/Ctrl + V)
                </p>
                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80">
                  <FileImage className="size-3.5" />
                  JPG · PNG · WebP, up to 22 MB — processed locally, never uploaded
                </p>
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground/80">
                    No image? Try one:
                  </p>
                  <div className="mt-2.5 flex items-center justify-center gap-2.5">
                    {SAMPLES.map((s) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => void loadSample(s.src, s.label)}
                        className="group relative size-14 cursor-pointer overflow-hidden rounded-lg border border-border transition-transform duration-150 hover:-translate-y-0.5"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.src}
                          alt={`Sample: ${s.label}`}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-foreground/55 py-px text-center text-[10px] font-medium text-white backdrop-blur-sm">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* —— 处理中(校验瞬态 + 模型下载 + 推理) —— */}
          {(state.phase === "validating" || state.phase === "processing") && (
            <ProcessingPanel progress={state.progress} phase={state.phase} />
          )}

          {/* —— 处理失败 —— */}
          {state.phase === "error" && state.error && (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="animate-pop flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-7" strokeWidth={1.75} />
              </span>
              <h2 className="mt-5 text-xl font-bold">
                {ERROR_COPY[state.error].title}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {ERROR_COPY[state.error].hint}
              </p>
              <div className="mt-7 flex gap-3">
                <Button
                  onClick={() =>
                    state.retryBlob &&
                    void run(state.retryBlob, state.originalName)
                  }
                >
                  <RotateCcw className="size-4" />
                  Retry
                </Button>
                <Button variant="outline" onClick={reset}>
                  <Upload className="size-4" />
                  Change photo
                </Button>
              </div>
            </div>
          )}

          {/* —— 状态②③ 抠图完成 —— */}
          {ready && state.cutout && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Check className="size-4.5" strokeWidth={2.5} />
                  </span>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {state.cutout.fileName} · {state.cutout.width}×
                    {state.cutout.height} ·{" "}
                    {formatElapsed(state.cutout.elapsedMs)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs
                    value={state.compare}
                    onValueChange={(v) =>
                      dispatch({
                        type: "compare",
                        view: v as "result" | "original",
                      })
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="result">Result</TabsTrigger>
                      <TabsTrigger value="original">Original</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="cursor-pointer text-muted-foreground"
                  >
                    <RotateCcw className="size-4" />
                    Start over
                  </Button>
                </div>
              </div>

              {/* 预览区:原图 / 棋盘格抠图(②) / 合成结果(③) */}
              <div className="relative mt-4 flex justify-center">
                <div
                  className={[
                    "relative inline-block overflow-hidden rounded-xl border border-border",
                    transparentView || state.compare === "original"
                      ? ""
                      : "",
                    state.compare === "original" ? "" : transparentView ? "checkerboard" : "",
                  ].join(" ")}
                >
                  {state.compare === "original" && state.originalUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={state.originalUrl}
                      alt="Original photo"
                      className="block max-h-[62vh] w-auto max-w-full"
                    />
                  ) : /* eslint-disable-next-line @next/next/no-img-element */
                  transparentView ? (
                    <img
                      src={state.cutout.url}
                      alt="Cutout with transparent background"
                      className="block max-h-[62vh] w-auto max-w-full"
                    />
                  ) : state.previewUrl ? (
                    <img
                      src={state.previewUrl}
                      alt="Photo with new background"
                      className="block max-h-[62vh] w-auto max-w-full"
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* 合成中微遮罩 */}
                  {state.compositing && state.previewUrl && (
                    <div className="animate-pulse absolute inset-0 bg-background/30" />
                  )}

                  {/* 状态②:引导选背景 */}
                  {transparentView && state.compare === "result" && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-background/80 to-transparent px-4 pt-10 pb-3">
                      <span className="rounded-full bg-foreground/80 px-4 py-1.5 text-xs font-medium text-background backdrop-blur-sm">
                        Pick a background below ↓
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作条 */}
              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    size="lg"
                    disabled={state.exporting}
                    onClick={() => void onDownload()}
                    className="cursor-pointer bg-accent px-8 text-accent-foreground hover:bg-accent/90"
                  >
                    {state.exporting ? (
                      <Loader2 className="size-4.5 animate-spin" />
                    ) : state.downloaded ? (
                      <Check className="size-4.5" />
                    ) : (
                      <Download className="size-4.5" />
                    )}
                    {state.exporting
                      ? "Exporting…"
                      : state.downloaded
                        ? "Downloaded"
                        : transparentView
                          ? "Download HD"
                          : "Download HD"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      downloadBlob(
                        state.cutout!.blob,
                        resultFilename(state.cutout!.fileName, "png"),
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <ImageDown className="size-4" />
                    Transparent PNG
                  </Button>
                </div>
                <p className="font-mono text-xs text-muted-foreground/80">
                  No watermark · Full resolution ·{" "}
                  {transparentView ? "PNG with alpha" : "HD JPEG"}
                </p>
              </div>
            </>
          )}

          {/* 背景图库(所有相位可见,支持预选) */}
          <Gallery selected={state.selected} onSelect={onSelect} />
        </div>
      </div>
    </section>
  );
}

/** 处理视图:下载阶段真实百分比;推理阶段 4 步里程碑 */
function ProcessingPanel({
  phase,
  progress,
}: {
  phase: "validating" | "processing";
  progress: ProgressInfo | null;
}) {
  const downloading = progress === null || progress.stage === "download";
  const pct = progress?.stage === "download" ? Math.floor(progress.pct * 100) : 0;
  const stepIndex =
    progress?.stage === "compute" ? progress.stepIndex : -1;

  return (
    <div className="flex flex-col items-center py-12 text-center" aria-live="polite">
      <div className="animate-breathe flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Layers className="size-6" strokeWidth={1.75} />
      </div>
      <h2 className="mt-6 text-lg font-semibold">
        {phase === "validating"
          ? "Reading your photo…"
          : downloading
            ? "Loading the AI model"
            : "Cutting out the subject…"}
      </h2>
      <div className="mt-6 w-full max-w-sm">
        {downloading ? (
          <>
            <p className="font-mono text-4xl font-bold tabular-nums text-primary">
              {pct}
              <span className="text-xl">%</span>
            </p>
            <Progress value={pct} className="mt-4 h-2" />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The first run downloads a ~50 MB model (cached afterwards). The
              AI then runs locally in your browser — your photo never leaves
              this device.
            </p>
          </>
        ) : (
          <ol className="mx-auto max-w-xs space-y-2.5 text-left">
            {COMPUTE_STEPS.map((label, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              return (
                <li
                  key={label}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm transition-colors",
                    current
                      ? "bg-primary/10 font-medium text-primary"
                      : done
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      done
                        ? "border-accent bg-accent text-accent-foreground"
                        : current
                          ? "border-primary"
                          : "border-input",
                    ].join(" ")}
                  >
                    {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  {label}
                  {current && (
                    <span className="animate-shimmer shimmer-bar ml-auto h-2 w-9 rounded-full bg-primary/20" />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
