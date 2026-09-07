"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";

type Props = {
  beforeUrl: string;
  afterUrl: string;
  width: number;
  height: number;
  alt?: string;
};

/**
 * 前后对比滑块:pointer capture 让拖出元素仍受控;
 * 两层图共享同一宽高比容器 + object-contain,保证像素级对齐;
 * 外层棋盘格透出结果图的透明区域。
 */
export function CompareSlider({
  beforeUrl,
  afterUrl,
  width,
  height,
  alt = "原图与抠图结果对比",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const moveTo = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 2));
    } else if (e.key === "Home") {
      setPos(0);
    } else if (e.key === "End") {
      setPos(100);
    }
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={alt}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
      }}
      className="checkerboard relative w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl shadow-panel outline-none select-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2"
      style={{ aspectRatio: width > 0 ? `${width} / ${height}` : "4 / 3" }}
    >
      {/* 底层:抠图结果(透明区透出棋盘格) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />
      {/* 上层:原图,按 pos 从左侧裁切 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* 分隔线 + 手柄 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(23,21,15,0.25)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-lift">
          <ChevronsLeftRight className="size-5" strokeWidth={2} />
        </span>
      </div>

      {/* 角标 */}
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/65 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        原图
      </span>
      <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-vermilion px-3 py-1 text-xs font-medium text-white">
        抠图后
      </span>
    </div>
  );
}
