"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { HashLink } from "@/components/site/HashLink";

const SHOWCASE = [
  {
    id: "people",
    title: "People",
    detail: "Full-resolution hair and skin-edge fidelity.",
    before: "/samples/people1.jpg",
    beforeAlt: "Portrait photo before background removal",
    after: "/samples/people1-cutout.webp",
    afterAlt: "Portrait cutout with transparent background",
  },
  {
    id: "products",
    title: "Products",
    detail: "Marketplace-clean edges on studio or flat shots.",
    before: "/samples/product-bag.jpg",
    beforeAlt: "Product photo before background removal",
    after: "/samples/product-bag-cutout.webp",
    afterAlt: "Product cutout with transparent background",
  },
  {
    id: "pets",
    title: "Pets",
    detail: "Fur and whiskers survive the cut, strand by strand.",
    before: "/samples/pet-dog.jpg",
    beforeAlt: "Pet photo before background removal",
    after: "/samples/pet-dog-cutout.webp",
    afterAlt: "Pet cutout with transparent background",
  },
] as const;

const MIN_POS = 0;
const MAX_POS = 100;

/** 棋盘格:透明结果区域的视觉约定,避免被误认为白底 */
export const CHECKER_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

/** 单张可拖动前后对比卡:before 原图左 / after 抠图右(棋盘底) */
function CompareCard(props: (typeof SHOWCASE)[number]) {
  const [pos, setPos] = useState(50);
  const stageRef = useRef<HTMLDivElement>(null);

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) updateFromClientX(e.clientX);
        }}
        className="relative aspect-[4/3] cursor-ew-resize touch-none select-none overflow-hidden"
        style={CHECKER_STYLE}
      >
        <Image
          src={props.after}
          alt={props.afterAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {/* before 原图:滑块左侧 */}
        <Image
          src={props.before}
          alt={props.beforeAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        <span className="absolute top-3 left-3 z-10 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          Before
        </span>
        <span className="absolute top-3 right-3 z-10 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          After
        </span>

        <div
          role="slider"
          aria-label={`Compare original and result for ${props.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute inset-y-0 z-10 w-0.5 cursor-ew-resize bg-background shadow-[0_0_0_1px_hsl(var(--border))] focus-visible:outline-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md">
            <MoveHorizontal className="size-5" aria-hidden />
          </div>
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-semibold">{props.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{props.detail}</p>
      </div>
    </div>
  );
}

export function QualityShowcase() {
  return (
    <section id="quality" className="scroll-mt-20 rounded-t-[20px] bg-background py-16 shadow-[0_-8px_30px_-18px_hsl(var(--foreground)/0.08)] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            See the cutout quality for yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Drag the handle to compare the original with the result. These
            samples were produced by the same model that runs in your browser.
          </p>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Hair, fur, and semi-transparent edges are where most background
            changers fall apart. SwitchBG keeps fine strands and soft outlines
            intact, and it works on the full image rather than a preview-sized
            copy. Zoom in before you download — what you see on screen is what
            lands in the file.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-0 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE.map((item) => (
            <CompareCard key={item.id} {...item} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Results depend on the source photo — clear subjects with even lighting
          cut out cleanest.
        </p>

        <div className="mt-6 text-center">
          <HashLink
            href="/#tool"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Try it with your own photo
          </HashLink>
        </div>
      </div>
    </section>
  );
}
