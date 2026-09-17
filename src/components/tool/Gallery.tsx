"use client";

import { Check, EyeOff, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  LIBRARY,
  QUICK_BACKGROUNDS,
  swatchStyle,
  type BackgroundOption,
  type BgCategory,
} from "@/lib/backgrounds";

type Props = {
  selected: BackgroundOption | null;
  onSelect: (bg: BackgroundOption) => void;
  onUpload: (file: File) => void;
  compact?: boolean;
};

/** 透明选项的缩略(棋盘格 + 关闭眼睛 = 无背景) */
function TransparentSwatch() {
  return (
    <span className="checkerboard-fine absolute inset-0 rounded-[inherit]" aria-hidden />
  );
}

/** 背景图库:快速项(透明/纯色/渐变)+ 三分类照片网格 */
export function Gallery({ selected, onSelect, onUpload, compact = false }: Props) {
  const inputId = "custom-background-upload";
  return (
    <div className={compact ? "" : "mt-10"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          Pick a background
        </h2>
        <p className="text-xs text-muted-foreground">
          or keep it transparent and add your own later
        </p>
      </div>

      {/* 快速项:透明 + 纯色 + 渐变 */}
      <div
        role="group"
        aria-label="Quick backgrounds"
        className="mt-3 flex flex-wrap gap-2"
      >
        {QUICK_BACKGROUNDS.map((bg) => {
          const active = selected?.id === bg.id;
          return (
            <button
              key={bg.id}
              type="button"
              title={bg.label}
              aria-pressed={active}
              onClick={() => onSelect(bg)}
              className={[
                "relative size-10 cursor-pointer overflow-hidden rounded-lg border transition-all",
                active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50",
              ].join(" ")}
            >
              {bg.kind === "transparent" ? (
                <>
                  <TransparentSwatch />
                  <EyeOff className="absolute inset-0 m-auto size-4 text-foreground/70" />
                </>
              ) : (
                <span
                  className="absolute inset-0"
                  style={{ background: swatchStyle(bg) ?? undefined }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium">Use your own background</p>
          <p className="truncate text-xs text-muted-foreground">Choose a local JPG, PNG, or WebP. It stays on this device.</p>
        </div>
        <label htmlFor={inputId} className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/50">
          <Upload className="size-3.5" /> Upload
          <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.target.value = ""; }} />
        </label>
      </div>

      {/* 照片图库:三分类 */}
      <Tabs defaultValue="people" className="mt-6">
        <TabsList className="h-auto">
          {CATEGORY_ORDER.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="px-4 py-1.5">
              {CATEGORY_LABELS[cat as BgCategory]}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORY_ORDER.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <BackgroundGrid
              category={cat}
              selected={selected}
              onSelect={onSelect}
              compact={compact}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function BackgroundGrid({
  category,
  selected,
  onSelect,
  compact,
}: {
  category: BgCategory;
  selected: BackgroundOption | null;
  onSelect: (bg: BackgroundOption) => void;
  compact: boolean;
}) {
  return (
    <div className={`mt-4 grid grid-cols-3 gap-2.5 ${compact ? "" : "sm:grid-cols-6"}`}>
      {LIBRARY[category].map((bg) => {
        const active = selected?.id === bg.id;
        return (
          <button
            key={bg.id}
            type="button"
            title={bg.label}
            aria-pressed={active}
            onClick={() => onSelect(bg)}
            className={[
              "group relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-all",
              active
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bg.kind === "image" ? bg.src : ""}
              alt={bg.label}
              loading="lazy"
              draggable={false}
              className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
            />
            {active && (
              <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
