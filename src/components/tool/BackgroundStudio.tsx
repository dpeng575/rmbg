"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  AlertCircle,
  Check,
  Download,
  FileImage,
  ImageDown,
  Layers,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gallery } from "./Gallery";
import {
  countBucket,
  durationBucket,
  trackEvent,
  type BackgroundType,
  type FailureReason,
  type UploadSource,
} from "@/lib/analytics";
import { previewSize, renderComposite } from "@/lib/composite";
import { saveBlob, formatElapsed, resultFilename } from "@/lib/download";
import { COMPUTE_STEPS, classifyError, removeBg } from "@/lib/remove-bg";
import {
  ERROR_COPY,
  ImageValidationError,
  prepareImage,
} from "@/lib/validate";
import type { BackgroundOption } from "@/lib/backgrounds";
import type { ErrorCode, ProgressInfo } from "@/types";

type Phase = "idle" | "validating" | "processing" | "ready" | "error";
type Mode = "single" | "batch";

type Cutout = {
  bitmap: ImageBitmap;
  url: string;
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  downsampled: boolean;
  fileName: string;
  elapsedMs: number;
};

type State = {
  phase: Phase;
  progress: ProgressInfo | null;
  error: ErrorCode | null;
  cutout: Cutout | null;
  originalUrl: string | null;
  originalName: string;
  retryBlob: Blob | null;
  selected: BackgroundOption | null;
  previewUrl: string | null;
  compositing: boolean;
  compare: "result" | "original";
  exporting: boolean;
  downloaded: boolean;
};

type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
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
  | { type: "validating"; name: string; blob: Blob }
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
      return {
        ...INITIAL,
        phase: "validating",
        selected: state.selected,
        originalName: action.name,
        retryBlob: action.blob,
      };
    case "processing":
      return {
        ...state,
        phase: "processing",
        // 默认进入 compute 清单视图:模型已缓存时库不发任何下载进度事件,
        // 若用 null(被 ProcessingPanel 解释为下载中)会卡在 0% 直到出结果。
        // 真要在下载时会立刻收到 download 事件并把视图切回百分比。
        progress: { stage: "compute", stepIndex: 0 },
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

type BatchStatus = "queued" | "validating" | "processing" | "done" | "error";
type BatchItem = {
  id: number;
  source: Blob | null;
  name: string;
  sourceUrl: string;
  status: BatchStatus;
  progress: ProgressInfo | null;
  error: ErrorCode | null;
  outputBlob: Blob | null;
  outputUrl: string | null;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  downsampled: boolean;
  elapsedMs: number;
};

type InputSource = { blob: Blob; name: string };

const SAMPLES = [
  { src: "/samples/portrait.jpg", label: "Portrait", width: 1200, height: 1800 },
  { src: "/samples/product.jpg", label: "Product", width: 1200, height: 800 },
  { src: "/samples/pet-studio.jpg", label: "Pet", width: 960, height: 810 },
] as const;

function errorCode(error: unknown): ErrorCode {
  return error instanceof ImageValidationError ? error.code : classifyError(error);
}

function backgroundType(background: BackgroundOption | null): BackgroundType {
  if (!background || background.kind === "transparent") return "transparent";
  if (background.kind === "image") {
    return background.id === "custom-background" ? "custom" : "library";
  }
  return background.kind;
}

function failureReason(code: ErrorCode): FailureReason {
  return code.toLowerCase() as FailureReason;
}

export function BackgroundStudio({ initialBackground }: { initialBackground?: BackgroundOption } = {}) {
  const [state, dispatch] = useReducer(reducer, INITIAL, (init) =>
    initialBackground ? { ...init, selected: initialBackground } : init,
  );
  const [mode, setMode] = useState<Mode>("single");
  const modeRef = useRef<Mode>("single");
  const [dragging, setDragging] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchBusy, setBatchBusy] = useState(false);
  const [batchPaused, setBatchPaused] = useState(false);
  const [batchExporting, setBatchExporting] = useState<number | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const batchItemsRef = useRef<BatchItem[]>([]);
  const batchRunningRef = useRef(false);
  const batchStopRef = useRef(false);
  const nextBatchIdRef = useRef(1);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const taskIdRef = useRef(0);
  const compositeIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const singleUrlsRef = useRef(new Set<string>());
  const batchUrlsRef = useRef(new Set<string>());
  const selectedRef = useRef(state.selected);
  const cutoutRef = useRef(state.cutout);
  const previewUrlRef = useRef<string | null>(null);
  const customBackgroundRef = useRef<string | null>(null);

  const updateBatch = useCallback(
    (updater: (current: BatchItem[]) => BatchItem[]) => {
      const next = updater(batchItemsRef.current);
      batchItemsRef.current = next;
      setBatchItems(next);
    },
    [],
  );

  const trackSingle = useCallback((url: string) => {
    singleUrlsRef.current.add(url);
    return url;
  }, []);
  const trackBatch = useCallback((url: string) => {
    batchUrlsRef.current.add(url);
    return url;
  }, []);
  const revokeUrl = useCallback((set: Set<string>, url: string | null) => {
    if (!url || !set.delete(url)) return;
    URL.revokeObjectURL(url);
  }, []);

  const releaseSingle = useCallback(() => {
    cutoutRef.current?.bitmap.close();
    cutoutRef.current = null;
    for (const url of singleUrlsRef.current) URL.revokeObjectURL(url);
    singleUrlsRef.current.clear();
    previewUrlRef.current = null;
  }, []);
  const releaseCustomBackground = useCallback(() => {
    if (customBackgroundRef.current) URL.revokeObjectURL(customBackgroundRef.current);
    customBackgroundRef.current = null;
  }, []);
  const releaseBatch = useCallback(() => {
    for (const url of batchUrlsRef.current) URL.revokeObjectURL(url);
    batchUrlsRef.current.clear();
    batchItemsRef.current = [];
    setBatchItems([]);
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    selectedRef.current = state.selected;
    cutoutRef.current = state.cutout;
  });
  useEffect(() => {
    if (mode === "single" && state.phase === "idle") return;
    requestAnimationFrame(() => {
      toolRef.current
        ?.querySelector<HTMLElement>("[data-status-focus]")
        ?.focus({ preventScroll: true });
    });
  }, [mode, state.phase]);
  useEffect(
    () => () => {
      controllerRef.current?.abort();
      taskIdRef.current += 1;
      releaseSingle();
      releaseCustomBackground();
      releaseBatch();
    },
    [releaseBatch, releaseCustomBackground, releaseSingle],
  );

  const setPreview = useCallback(
    (url: string | null) => {
      revokeUrl(singleUrlsRef.current, previewUrlRef.current);
      previewUrlRef.current = url;
      if (url) trackSingle(url);
      dispatch({ type: "preview", url });
    },
    [revokeUrl, trackSingle],
  );

  const applyComposite = useCallback(
    async (cutout: Cutout, background: BackgroundOption | null) => {
      const compositeId = ++compositeIdRef.current;
      if (!background || background.kind === "transparent") {
        setPreview(null);
        dispatch({ type: "compositing", on: false });
        return;
      }
      dispatch({ type: "compositing", on: true });
      try {
        const blob = await renderComposite(
          cutout.bitmap,
          background,
          previewSize(cutout.width, cutout.height),
          0.9,
        );
        if (compositeId !== compositeIdRef.current || cutoutRef.current !== cutout) return;
        setPreview(URL.createObjectURL(blob));
      } catch {
        if (compositeId === compositeIdRef.current) setPreview(null);
      } finally {
        if (compositeId === compositeIdRef.current) {
          dispatch({ type: "compositing", on: false });
        }
      }
    },
    [setPreview],
  );

  const runSingle = useCallback(
    async (source: Blob, name: string, inputSource: UploadSource, countUpload = true) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const taskId = ++taskIdRef.current;
      compositeIdRef.current += 1;
      releaseSingle();
      dispatch({ type: "validating", name, blob: source });
      if (countUpload) {
        trackEvent("upload_started", {
          input_source: inputSource,
          mode: "single",
          item_count_bucket: "1",
        });
      }
      let processingStarted = false;
      try {
        const prepared = await prepareImage(source);
        if (taskId !== taskIdRef.current) return;
        dispatch({
          type: "processing",
          originalUrl: trackSingle(URL.createObjectURL(source)),
          name,
          blob: source,
        });
        processingStarted = true;
        trackEvent("processing_started", { mode: "single" });
        const startedAt = performance.now();
        const { blob: cutoutBlob } = await removeBg(
          prepared.blob,
          (progress) => {
            if (taskId === taskIdRef.current) dispatch({ type: "progress", progress });
          },
          controller.signal,
        );
        const bitmap = await createImageBitmap(cutoutBlob);
        if (taskId !== taskIdRef.current) {
          bitmap.close();
          return;
        }
        const cutout: Cutout = {
          bitmap,
          url: trackSingle(URL.createObjectURL(cutoutBlob)),
          blob: cutoutBlob,
          width: prepared.width,
          height: prepared.height,
          originalWidth: prepared.originalWidth,
          originalHeight: prepared.originalHeight,
          downsampled: prepared.downsampled,
          fileName: name,
          elapsedMs: performance.now() - startedAt,
        };
        cutoutRef.current = cutout;
        dispatch({ type: "done", cutout });
        trackEvent("processing_completed", {
          mode: "single",
          duration_bucket: durationBucket(cutout.elapsedMs),
          downsampled: cutout.downsampled,
        });
        const preselected = selectedRef.current;
        if (preselected && preselected.kind !== "transparent") {
          void applyComposite(cutout, preselected);
        }
      } catch (error) {
        if (taskId !== taskIdRef.current) return;
        const code = errorCode(error);
        console.error("[switchbg] processing failed:", error);
        dispatch({ type: "failed", code });
        trackEvent(processingStarted ? "processing_failed" : "image_validation_failed", {
          mode: "single",
          reason: failureReason(code),
        });
      }
    },
    [applyComposite, releaseSingle, trackSingle],
  );

  const cancelSingle = useCallback(() => {
    controllerRef.current?.abort();
    taskIdRef.current += 1;
    compositeIdRef.current += 1;
    dispatch({ type: "failed", code: "CANCELLED" });
    trackEvent("processing_failed", { mode: "single", reason: "cancelled" });
  }, []);

  const drainBatch = useCallback(async () => {
    if (batchRunningRef.current) return;
    batchRunningRef.current = true;
    batchStopRef.current = false;
    setBatchBusy(true);
    setBatchPaused(false);
    try {
      while (!batchStopRef.current) {
        const item = batchItemsRef.current.find((candidate) => candidate.status === "queued");
        if (!item) break;
        if (!item.source) {
          updateBatch((items) => items.filter((candidate) => candidate.id !== item.id));
          continue;
        }
        const source = item.source;
        updateBatch((items) =>
          items.map((candidate) =>
            candidate.id === item.id
              ? { ...candidate, status: "validating", error: null, progress: null }
              : candidate,
          ),
        );
        const controller = new AbortController();
        controllerRef.current = controller;
        const startedAt = performance.now();
        let processingStarted = false;
        let processingStartedAt = 0;
        try {
          const prepared = await prepareImage(source);
          if (batchStopRef.current) {
            updateBatch((items) =>
              items.map((candidate) =>
                candidate.id === item.id
                  ? { ...candidate, status: "queued", progress: null }
                  : candidate,
              ),
            );
            break;
          }
          updateBatch((items) =>
            items.map((candidate) =>
              candidate.id === item.id
                ? {
                    ...candidate,
                    status: "processing",
                    width: prepared.width,
                    height: prepared.height,
                    originalWidth: prepared.originalWidth,
                    originalHeight: prepared.originalHeight,
                    downsampled: prepared.downsampled,
                  }
                : candidate,
            ),
          );
          processingStarted = true;
          processingStartedAt = performance.now();
          trackEvent("processing_started", { mode: "batch" });
          const { blob } = await removeBg(
            prepared.blob,
            (progress) =>
              updateBatch((items) =>
                items.map((candidate) =>
                  candidate.id === item.id ? { ...candidate, progress } : candidate,
                ),
              ),
            controller.signal,
          );
          if (batchStopRef.current) {
            updateBatch((items) =>
              items.map((candidate) =>
                candidate.id === item.id
                  ? { ...candidate, status: "queued", progress: null }
                  : candidate,
              ),
            );
            break;
          }
          const outputUrl = trackBatch(URL.createObjectURL(blob));
          revokeUrl(batchUrlsRef.current, item.sourceUrl);
          updateBatch((items) =>
            items.map((candidate) =>
              candidate.id === item.id
                ? {
                    ...candidate,
                    status: "done",
                    source: null,
                    sourceUrl: "",
                    progress: null,
                    outputBlob: blob,
                    outputUrl,
                    elapsedMs: performance.now() - startedAt,
                  }
                : candidate,
            ),
          );
          trackEvent("processing_completed", {
            mode: "batch",
            duration_bucket: durationBucket(performance.now() - processingStartedAt),
            downsampled: prepared.downsampled,
          });
        } catch (error) {
          if (batchStopRef.current) {
            updateBatch((items) =>
              items.map((candidate) =>
                candidate.id === item.id
                  ? { ...candidate, status: "queued", progress: null }
                  : candidate,
              ),
            );
            break;
          }
          const code = errorCode(error);
          console.error("[switchbg] batch item failed:", error);
          updateBatch((items) =>
            items.map((candidate) =>
              candidate.id === item.id
                ? { ...candidate, status: "error", progress: null, error: code }
                : candidate,
            ),
          );
          trackEvent(processingStarted ? "processing_failed" : "image_validation_failed", {
            mode: "batch",
            reason: failureReason(code),
          });
        }
      }
    } finally {
      controllerRef.current = null;
      batchRunningRef.current = false;
      setBatchBusy(false);
      setBatchPaused(
        batchStopRef.current && batchItemsRef.current.some((item) => item.status === "queued"),
      );
      const completedItems = batchItemsRef.current;
      if (completedItems.length > 0 && !completedItems.some((item) => item.status === "queued")) {
        const completedCount = completedItems.filter((item) => item.status === "done").length;
        trackEvent("batch_completed", {
          item_count_bucket: countBucket(completedItems.length),
          success_count_bucket: countBucket(completedCount),
          failed: completedCount !== completedItems.length,
        });
      }
    }
  }, [revokeUrl, trackBatch, updateBatch]);

  const addToBatch = useCallback(
    (sources: InputSource[], inputSource: UploadSource) => {
      controllerRef.current?.abort();
      taskIdRef.current += 1;
      compositeIdRef.current += 1;
      releaseSingle();
      const additions = sources.map(({ blob, name }) => ({
        id: nextBatchIdRef.current++,
        source: blob,
        name,
        sourceUrl: trackBatch(URL.createObjectURL(blob)),
        status: "queued" as const,
        progress: null,
        error: null,
        outputBlob: null,
        outputUrl: null,
        width: 0,
        height: 0,
        originalWidth: 0,
        originalHeight: 0,
        downsampled: false,
        elapsedMs: 0,
      }));
      modeRef.current = "batch";
      setMode("batch");
      updateBatch((items) => [...items, ...additions]);
      const itemCount = countBucket(sources.length);
      trackEvent("upload_started", {
        input_source: inputSource,
        mode: "batch",
        item_count_bucket: itemCount,
      });
      trackEvent("batch_started", { item_count_bucket: itemCount });
      queueMicrotask(() => void drainBatch());
    },
    [drainBatch, releaseSingle, trackBatch, updateBatch],
  );

  const acceptSources = useCallback(
    (sources: InputSource[], inputSource: UploadSource) => {
      if (!sources.length) return;
      if (modeRef.current === "batch" || sources.length > 1) {
        addToBatch(sources, inputSource);
      } else {
        void runSingle(sources[0].blob, sources[0].name, inputSource);
      }
    },
    [addToBatch, runSingle],
  );

  const clearSingle = useCallback(() => {
      controllerRef.current?.abort();
      taskIdRef.current += 1;
      compositeIdRef.current += 1;
      releaseSingle();
      releaseCustomBackground();
      dispatch({ type: "reset" });
  }, [releaseCustomBackground, releaseSingle]);
  const resetSingle = useCallback(
    (ask = true) => {
      if (ask && state.phase !== "idle") {
        setConfirmRequest({
          title: "Start over with a new photo?",
          description: "Your current photo and background result will be cleared.",
          confirmLabel: "Clear photo",
          onConfirm: clearSingle,
        });
        return;
      }
      clearSingle();
    },
    [clearSingle, state.phase],
  );
  const cancelBatch = useCallback(() => {
    batchStopRef.current = true;
    controllerRef.current?.abort();
  }, []);
  const clearBatchNow = useCallback((exit: boolean) => {
      cancelBatch();
      releaseBatch();
      setBatchPaused(false);
      if (exit) {
        modeRef.current = "single";
        setMode("single");
        dispatch({ type: "reset" });
      }
  }, [cancelBatch, releaseBatch]);
  const clearBatch = useCallback(
    (exit: boolean) => {
      if (batchItemsRef.current.length > 0) {
        setConfirmRequest({
          title: exit ? "Exit batch mode?" : "Clear the batch queue?",
          description: exit
            ? "The queued photos and their results will be removed."
            : "All photos in the queue and their results will be removed.",
          confirmLabel: exit ? "Exit batch mode" : "Clear queue",
          onConfirm: () => clearBatchNow(exit),
        });
        return;
      }
      clearBatchNow(exit);
    },
    [clearBatchNow],
  );
  const removeBatchItem = useCallback(
    (id: number) => {
      const item = batchItemsRef.current.find((candidate) => candidate.id === id);
      if (!item || item.status === "processing" || item.status === "validating") return;
      revokeUrl(batchUrlsRef.current, item.sourceUrl);
      revokeUrl(batchUrlsRef.current, item.outputUrl);
      updateBatch((items) => items.filter((candidate) => candidate.id !== id));
    },
    [revokeUrl, updateBatch],
  );
  const retryBatchItem = useCallback(
    (id: number) => {
      updateBatch((items) =>
        items.map((item) => (item.id === id ? { ...item, status: "queued", error: null } : item)),
      );
      queueMicrotask(() => void drainBatch());
    },
    [drainBatch, updateBatch],
  );

  const downloadBatchItem = useCallback(async (item: BatchItem) => {
    if (!item.outputBlob) return;
    const background = selectedRef.current;
    setBatchExporting(item.id);
    try {
      if (!background || background.kind === "transparent") {
        const saved = await saveBlob(item.outputBlob, resultFilename(item.name, "png"));
        if (!saved) return;
        trackEvent("download_completed", {
          mode: "batch",
          format: "png",
          background_type: "transparent",
        });
        return;
      }
      const bitmap = await createImageBitmap(item.outputBlob);
      try {
        const blob = await renderComposite(
          bitmap,
          background,
          { width: item.width, height: item.height },
          0.95,
        );
        const saved = await saveBlob(blob, resultFilename(item.name, "jpg"));
        if (!saved) return;
        trackEvent("download_completed", {
          mode: "batch",
          format: "jpeg",
          background_type: backgroundType(background),
        });
      } finally {
        bitmap.close();
      }
    } catch (error) {
      console.error("[switchbg] batch export failed:", error);
    } finally {
      setBatchExporting(null);
    }
  }, []);

  const onSelect = useCallback(
    (background: BackgroundOption) => {
      selectedRef.current = background;
      dispatch({ type: "select", bg: background });
      trackEvent("background_selected", { background_type: backgroundType(background) });
      if (modeRef.current === "single" && cutoutRef.current) {
        void applyComposite(cutoutRef.current, background);
      }
    },
    [applyComposite],
  );
  const onUploadBackground = useCallback((file: File) => {
    releaseCustomBackground();
    const src = URL.createObjectURL(file);
    customBackgroundRef.current = src;
    onSelect({ kind: "image", id: "custom-background", label: file.name, src });
  }, [onSelect, releaseCustomBackground]);
  const onDownload = useCallback(async () => {
    const cutout = cutoutRef.current;
    if (!cutout) return;
    const selected = selectedRef.current;
    if (!selected || selected.kind === "transparent") {
      const saved = await saveBlob(cutout.blob, resultFilename(cutout.fileName, "png"));
      if (!saved) return;
      dispatch({ type: "downloaded" });
      trackEvent("download_completed", {
        mode: "single",
        format: "png",
        background_type: "transparent",
      });
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
      const saved = await saveBlob(blob, resultFilename(cutout.fileName, "jpg"));
      if (!saved) return;
      dispatch({ type: "downloaded" });
      trackEvent("download_completed", {
        mode: "single",
        format: "jpeg",
        background_type: backgroundType(selected),
      });
    } catch (error) {
      console.error("[switchbg] export failed:", error);
    } finally {
      dispatch({ type: "exporting", on: false });
    }
  }, []);

  const loadSample = useCallback(
    async (src: string, label: string) => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        acceptSources([{ blob, name: `sample-${label.toLowerCase()}.jpg` }], "sample");
      } catch {
        dispatch({ type: "invalid", code: "FETCH_URL" });
        trackEvent("image_validation_failed", { mode: "single", reason: "fetch_url" });
      }
    },
    [acceptSources],
  );

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      for (const item of event.clipboardData?.items ?? []) {
        if (!item.type.startsWith("image/")) continue;
        const file = item.getAsFile();
        if (!file) return;
        event.preventDefault();
        acceptSources([{ blob: file, name: file.name || "pasted-image.png" }], "paste");
        return;
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [acceptSources]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    acceptSources(files.map((file) => ({ blob: file, name: file.name })), "file");
    event.target.value = "";
  };
  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragLeave = (event: DragEvent) => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };
  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    acceptSources(files.map((file) => ({ blob: file, name: file.name })), "drop");
  };

  const onCompare = useCallback((view: "result" | "original") => {
    dispatch({ type: "compare", view });
    trackEvent("comparison_used", { view });
  }, []);

  const onTransparentDownload = useCallback(async () => {
    const cutout = cutoutRef.current;
    if (!cutout) return;
    const saved = await saveBlob(cutout.blob, resultFilename(cutout.fileName, "png"));
    if (!saved) return;
    dispatch({ type: "downloaded" });
    trackEvent("download_completed", {
      mode: "single",
      format: "png",
      background_type: "transparent",
    });
  }, []);

  const ready = state.phase === "ready" && state.cutout;
  const transparentView = ready && (!state.selected || state.selected.kind === "transparent");
  const doneCount = batchItems.filter((item) => item.status === "done").length;

  return (
    <section id="tool" className="scroll-mt-20 pt-10 pb-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div ref={toolRef} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={onInputChange}
          />
          {mode === "batch" ? (
            <BatchPanel
              items={batchItems}
              busy={batchBusy}
              paused={batchPaused}
              doneCount={doneCount}
              exportingId={batchExporting}
              onAdd={() => inputRef.current?.click()}
              onCancel={cancelBatch}
              onResume={() => void drainBatch()}
              onClear={() => clearBatch(false)}
              onExit={() => clearBatch(true)}
              onRemove={removeBatchItem}
              onRetry={retryBatchItem}
              onDownload={(item) => void downloadBatchItem(item)}
            />
          ) : (
            <>
              {state.phase === "idle" && (
                <UploadPanel
                  error={state.error}
                  dragging={dragging}
                  onChoose={() => inputRef.current?.click()}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onSample={loadSample}
                />
              )}
              {(state.phase === "validating" || state.phase === "processing") && (
                <ProcessingPanel progress={state.progress} phase={state.phase} onCancel={cancelSingle} />
              )}
              {state.phase === "error" && state.error && (
                <div data-status-focus className="flex flex-col items-center py-10 text-center" role="alert" tabIndex={-1}>
                  <span className="animate-pop flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertCircle className="size-7" strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-5 text-xl font-bold">{ERROR_COPY[state.error].title}</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">{ERROR_COPY[state.error].hint}</p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {state.retryBlob && (
                      <Button onClick={() => void runSingle(state.retryBlob!, state.originalName, "file", false)}>
                        <RotateCcw className="size-4" /> Retry
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => resetSingle(false)}>
                      <Upload className="size-4" /> Change photo
                    </Button>
                  </div>
                </div>
              )}
              {ready && state.cutout && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.8fr)] lg:items-start">
                  <ReadyPanel
                    state={{ ...state, cutout: state.cutout }}
                    transparentView={Boolean(transparentView)}
                    onCompare={onCompare}
                    onReset={() => resetSingle(true)}
                    onDownload={() => void onDownload()}
                    onTransparentDownload={onTransparentDownload}
                  />
                  <aside className="border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                    <Gallery compact selected={state.selected} onSelect={onSelect} onUpload={onUploadBackground} />
                  </aside>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmDialog request={confirmRequest} onClose={() => setConfirmRequest(null)} />
    </section>
  );
}

function ConfirmDialog({ request, onClose }: { request: ConfirmRequest | null; onClose: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!request) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, request]);

  if (!request) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start gap-4 px-6 pt-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-card-foreground">{request.title}</h2>
            <p id="confirm-dialog-description" className="mt-1.5 text-sm leading-6 text-muted-foreground">{request.description}</p>
          </div>
          <Button variant="ghost" size="icon-xs" className="-mr-2 -mt-1 text-muted-foreground" onClick={onClose} aria-label="Close dialog">
            <X />
          </Button>
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-border bg-muted/35 px-6 py-4">
          <Button ref={cancelRef} variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onClose(); request.onConfirm(); }}>{request.confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

function UploadPanel({ error, dragging, onChoose, onDragEnter, onDragLeave, onDrop, onSample }: {
  error: ErrorCode | null;
  dragging: boolean;
  onChoose: () => void;
  onDragEnter: (event: DragEvent) => void;
  onDragLeave: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
  onSample: (src: string, label: string) => Promise<void>;
}) {
  return (
    <>
      {error && (
        <div role="alert" className="animate-pop mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-semibold text-destructive">{ERROR_COPY[error].title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{ERROR_COPY[error].hint}</p>
        </div>
      )}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ${dragging ? "scale-[1.005] border-primary bg-primary/5" : "border-input hover:border-primary/50"}`}
      >
        <span className="mx-auto flex size-13 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Upload className="size-6" strokeWidth={1.75} />
        </span>
        <Button size="lg" className="mt-5 px-8" onClick={onChoose}>
          <Upload className="size-4.5" /> Upload photos
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">Choose one photo, or select several for batch processing</p>
        <p className="mt-2 text-sm text-muted-foreground">Drag & drop, or paste from clipboard (⌘/Ctrl + V)</p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground/80">
          <FileImage className="size-3.5" />
          JPG · PNG · WebP, up to 22 MB · first use downloads about 76 MB · processed locally
        </p>
        <div className="mt-6">
          <p className="text-xs text-muted-foreground/80">No image? Try one:</p>
          <div className="mt-2.5 flex items-center justify-center gap-2.5">
            {SAMPLES.map((sample) => (
              <button key={sample.src} type="button" onClick={() => void onSample(sample.src, sample.label)} className="group relative size-14 overflow-hidden rounded-lg border border-border transition-transform duration-150 hover:-translate-y-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.src}
                  alt={`Sample: ${sample.label}`}
                  width={sample.width}
                  height={sample.height}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-foreground/55 py-px text-center text-[10px] font-medium text-white backdrop-blur-sm">{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ProcessingPanel({ phase, progress, onCancel }: {
  phase: "validating" | "processing";
  progress: ProgressInfo | null;
  onCancel: () => void;
}) {
  // 只有真实收到 download 事件才算下载中;null/compute 都展示步骤清单
  // (模型已缓存时库不发任何下载事件,旧逻辑会把界面卡在 0% 下载视图)
  const downloading = progress?.stage === "download";
  const pct = downloading ? Math.floor(progress.pct * 100) : 0;
  const stepIndex = progress?.stage === "compute" ? progress.stepIndex : 0;
  return (
    <div data-status-focus tabIndex={-1} className="flex flex-col items-center py-12 text-center" aria-live="polite" aria-busy="true">
      <div className="animate-breathe flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Layers className="size-6" strokeWidth={1.75} />
      </div>
      <h2 className="mt-6 text-lg font-semibold">
        {phase === "validating" ? "Reading your photo…" : downloading ? "Loading the AI model" : "Cutting out the subject…"}
      </h2>
      <div className="mt-6 w-full max-w-sm">
        {downloading ? (
          <>
            <p className="font-mono text-4xl font-bold tabular-nums text-primary">{pct}<span className="text-xl">%</span></p>
            <Progress value={pct} className="mt-4 h-2" />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">First use downloads about 76 MB of model and runtime files. Browsers normally cache them; your image stays on this device.</p>
          </>
        ) : (
          <ol className="mx-auto max-w-xs space-y-2.5 text-left">
            {COMPUTE_STEPS.map((label, index) => {
              const done = index < stepIndex;
              const current = index === stepIndex;
              return (
                <li key={label} className={`flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm ${current ? "bg-primary/10 font-medium text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${done ? "border-accent bg-accent text-accent-foreground" : current ? "border-primary" : "border-input"}`}>
                    {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        )}
      </div>
      <Button variant="outline" size="sm" className="mt-7" onClick={onCancel}><X className="size-4" /> Cancel</Button>
    </div>
  );
}

function ReadyPanel({ state, transparentView, onCompare, onReset, onDownload, onTransparentDownload }: {
  state: State & { cutout: Cutout };
  transparentView: boolean;
  onCompare: (view: "result" | "original") => void;
  onReset: () => void;
  onDownload: () => void;
  onTransparentDownload: () => void;
}) {
  const sizeLabel = state.cutout.downsampled
    ? `${state.cutout.originalWidth}×${state.cutout.originalHeight} → ${state.cutout.width}×${state.cutout.height}`
    : `${state.cutout.width}×${state.cutout.height}`;
  return (
    <div className="min-w-0">
      <div data-status-focus className="flex flex-wrap items-center justify-between gap-3" tabIndex={-1}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"><Check className="size-4.5" strokeWidth={2.5} /></span>
          <p className="truncate font-mono text-xs text-muted-foreground">{state.cutout.fileName} · {sizeLabel} · {formatElapsed(state.cutout.elapsedMs)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={state.compare} onValueChange={(value) => onCompare(value as "result" | "original")}>
            <TabsList><TabsTrigger value="result">Result</TabsTrigger><TabsTrigger value="original">Original</TabsTrigger></TabsList>
          </Tabs>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground"><RotateCcw className="size-4" /> Start over</Button>
        </div>
      </div>
      {state.cutout.downsampled && <p className="mt-3 text-xs text-muted-foreground" role="status">This large image was resized for reliable in-browser processing.</p>}
      <div className="relative mt-4 flex justify-center">
        <div className={`relative inline-block min-h-40 min-w-40 max-w-full overflow-hidden rounded-xl border border-border ${state.compare !== "original" && transparentView ? "checkerboard" : ""}`}>
          {state.compare === "original" && state.originalUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.originalUrl} alt="Original photo" className="mx-auto block max-h-[62vh] w-auto max-w-full" />
          ) : transparentView ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.cutout.url} alt="Cutout with transparent background" className="mx-auto block max-h-[62vh] w-auto max-w-full" />
          ) : state.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.previewUrl} alt="Photo with new background" className="mx-auto block max-h-[62vh] w-auto max-w-full" />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          )}
          {state.compositing && state.previewUrl && <div className="absolute inset-0 animate-pulse bg-background/30" />}
          {transparentView && state.compare === "result" && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-background/80 to-transparent px-4 pt-10 pb-3">
              <span className="rounded-full bg-foreground/80 px-4 py-1.5 text-xs font-medium text-background backdrop-blur-sm">Pick a background below</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" disabled={state.exporting} onClick={onDownload} className="bg-accent px-8 text-accent-foreground hover:bg-accent/90">
            {state.exporting ? <Loader2 className="size-4.5 animate-spin" /> : state.downloaded ? <Check className="size-4.5" /> : <Download className="size-4.5" />}
            {state.exporting ? "Exporting…" : state.downloaded ? "Downloaded" : "Download HD"}
          </Button>
          <Button variant="outline" onClick={onTransparentDownload}><ImageDown className="size-4" /> Transparent PNG</Button>
        </div>
        <p className="font-mono text-xs text-muted-foreground/80">No watermark · Full processing resolution · {transparentView ? "PNG with alpha" : "HD JPEG"}</p>
      </div>
    </div>
  );
}

function BatchPanel({ items, busy, paused, doneCount, exportingId, onAdd, onCancel, onResume, onClear, onExit, onRemove, onRetry, onDownload }: {
  items: BatchItem[];
  busy: boolean;
  paused: boolean;
  doneCount: number;
  exportingId: number | null;
  onAdd: () => void;
  onCancel: () => void;
  onResume: () => void;
  onClear: () => void;
  onExit: () => void;
  onRemove: (id: number) => void;
  onRetry: (id: number) => void;
  onDownload: (item: BatchItem) => void;
}) {
  return (
    <div data-status-focus tabIndex={-1} aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Batch queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "photo" : "photos"} · {doneCount} complete</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onAdd}><Plus className="size-4" /> Add photos</Button>
          {busy ? (
            <Button variant="outline" size="sm" onClick={onCancel}><X className="size-4" /> Cancel current</Button>
          ) : paused || items.some((item) => item.status === "queued") ? (
            <Button size="sm" onClick={onResume}><RotateCcw className="size-4" /> Resume queue</Button>
          ) : null}
          <Button variant="ghost" size="icon" title="Clear queue" aria-label="Clear queue" onClick={onClear}><Trash2 className="size-4" /></Button>
          <Button variant="ghost" size="icon" title="Exit batch mode" aria-label="Exit batch mode" onClick={onExit}><X className="size-4" /></Button>
        </div>
      </div>
      <div className="mt-5 space-y-2" aria-busy={busy}>
        {items.map((item) => {
          const active = item.status === "validating" || item.status === "processing";
          const progressLabel = item.progress?.stage === "download"
            ? `${Math.floor(item.progress.pct * 100)}% model download`
            : item.progress?.stage === "compute"
              ? COMPUTE_STEPS[item.progress.stepIndex]
              : item.status;
          return (
            <div key={item.id} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-2.5">
              <div className={`relative size-12 overflow-hidden rounded-md border border-border ${item.outputUrl ? "checkerboard-fine" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.outputUrl ?? item.sourceUrl} alt="" className="size-full object-cover" />
                {active && <span className="absolute inset-0 flex items-center justify-center bg-background/70"><Loader2 className="size-4 animate-spin" /></span>}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className={`mt-0.5 truncate text-xs ${item.error ? "text-destructive" : "text-muted-foreground"}`}>
                  {item.error ? ERROR_COPY[item.error].title : progressLabel}
                  {item.downsampled ? ` · resized to ${item.width}×${item.height}` : ""}
                  {item.status === "done" ? ` · ${formatElapsed(item.elapsedMs)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {item.status === "done" && (
                  <Button variant="outline" size="icon" title={`Download ${item.name}`} aria-label={`Download ${item.name}`} disabled={busy || exportingId !== null} onClick={() => onDownload(item)}>
                    {exportingId === item.id ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  </Button>
                )}
                {item.status === "error" && (
                  <Button variant="outline" size="icon" title={`Retry ${item.name}`} aria-label={`Retry ${item.name}`} disabled={busy} onClick={() => onRetry(item.id)}><RotateCcw className="size-4" /></Button>
                )}
                <Button variant="ghost" size="icon" title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`} disabled={active} onClick={() => onRemove(item.id)}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Photos process one at a time to limit memory use. Choose a background below, then download each completed result.</p>
    </div>
  );
}
