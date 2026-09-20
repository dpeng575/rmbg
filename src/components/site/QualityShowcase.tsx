"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SHOWCASE = [
  {
    id: "people",
    label: "People",
    before: "/samples/portrait.jpg",
    after: "/samples/portrait-cutout.png",
    alt: "Portrait photo before and after background removal",
    width: 1200,
    height: 1800,
  },
  {
    id: "products",
    label: "Products",
    before: "/samples/product.jpg",
    after: "/samples/product-cutout.png",
    alt: "Product photo before and after background removal",
    width: 1200,
    height: 800,
  },
  {
    id: "pets",
    label: "Pets",
    before: "/samples/pet.jpg",
    after: "/samples/pet-cutout.png",
    alt: "Pet photo before and after background removal",
    width: 960,
    height: 810,
  },
] as const;

const STAGE_MAX_HEIGHT = 460;

const MIN_POS = 0;
const MAX_POS = 100;

/** 棋盘格:透明结果区域的视觉约定,避免被误认为白底 */
const CHECKER_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

export function QualityShowcase() {
  const [active, setActive] = useState<string>(SHOWCASE[0].id);
  const [pos, setPos] = useState(50);
  const stageRef = useRef<HTMLDivElement>(null);
  const sample = SHOWCASE.find((s) => s.id === active) ?? SHOWCASE[0];

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(MAX_POS, Math.max(MIN_POS, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(MIN_POS, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(MAX_POS, p + step));
    else if (e.key === "Home") setPos(MIN_POS);
    else if (e.key === "End") setPos(MAX_POS);
    else return;
    e.preventDefault();
  };

  return (
    <section id="quality" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            See the cutout quality for yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Drag the handle to compare the original with the result. These
            samples were produced by the same model that runs in your browser.
          </p>
        </div>

        <Tabs
          value={active}
          onValueChange={(v) => {
            setActive(v);
            setPos(50);
          }}
          className="mt-8 items-center"
        >
          <TabsList>
            {SHOWCASE.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) updateFromClientX(e.clientX);
          }}
          className="relative mx-auto mt-6 w-full cursor-ew-resize touch-none select-none"
          style={{
            aspectRatio: `${sample.width} / ${sample.height}`,
            maxWidth: `min(100%, ${STAGE_MAX_HEIGHT * (sample.width / sample.height)}px)`,
            maxHeight: STAGE_MAX_HEIGHT,
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[8px] border border-border"
            style={CHECKER_STYLE}
          >
            {/* 原图:滑块左侧 */}
            <Image
              key={`${sample.id}-before`}
              src={sample.before}
              alt={`Original photo (${sample.label})`}
              fill
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-contain"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              priority={false}
            />
            {/* 抠图结果:滑块右侧,透明处露出棋盘格 */}
            <Image
              key={`${sample.id}-after`}
              src={sample.after}
              alt={`Background removed (${sample.label})`}
              fill
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-contain"
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            />

            <span className="absolute top-3 left-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm">
              Before
            </span>
            <span className="absolute top-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              After
            </span>
          </div>

          <div
            role="slider"
            aria-label="Compare original and result"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="absolute inset-y-0 z-10 w-0.5 cursor-ew-resize bg-background shadow-[0_0_0_1px_hsl(var(--border))] focus-visible:outline-none"
            style={{ left: `${pos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md group-focus-visible:ring-2">
              <MoveHorizontal className="size-5" aria-hidden />
            </div>
          </div>

        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Results depend on the source photo — clear subjects with even lighting
          cut out cleanest.
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/#tool"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Try it with your own photo
          </Link>
        </div>
      </div>
    </section>
  );
}
