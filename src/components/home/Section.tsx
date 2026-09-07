import type { ReactNode } from "react";
import { Scissors } from "lucide-react";

/** 「裁切线」分隔符:剪刀 + 虚线,呼应剪掉背景的动作隐喻 */
export function CutLine() {
  return (
    <div aria-hidden className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div className="border-t-2 border-dashed border-mist-deep/80" />
      <Scissors
        className="absolute top-1/2 left-1/4 size-5 -translate-x-1/2 -translate-y-1/2 rotate-[135deg] bg-paper p-0.5 text-mist-deep"
        strokeWidth={1.75}
      />
    </div>
  );
}

type SectionProps = {
  id?: string;
  kicker: string;
  title: ReactNode;
  sub?: string;
  children: ReactNode;
};

/** 统一的区块骨架:编号 kicker + 标题 + 副标题 */
export function Section({ id, kicker, title, sub, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wide text-vermilion">
            {kicker}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {sub && (
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {sub}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
