import {
  Building2,
  Camera,
  Car,
  Code,
  Heart,
  Megaphone,
  Newspaper,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { Section } from "./Section";
import { useCases } from "@/content/home";

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  camera: Camera,
  megaphone: Megaphone,
  code: Code,
  cart: ShoppingCart,
  newspaper: Newspaper,
  car: Car,
  building: Building2,
};

export function UseCaseSection() {
  return (
    <Section
      id="use-cases"
      kicker="01 · 使用场景"
      title={
        <>
          提升创造力
          <span className="text-vermilion">和</span>效率
        </>
      }
      sub="无论是为朋友做一张难忘的贺卡,还是在短时间内处理上千张商品照片,裁云都能帮你把时间还给创作本身。"
    >
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.map((useCase) => {
          const Icon = ICONS[useCase.icon];
          return (
            <article
              key={useCase.title}
              className="group rounded-2xl border border-mist bg-panel p-6 shadow-panel transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-mist-deep"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-mist text-ink transition-colors duration-200 group-hover:bg-vermilion-wash group-hover:text-vermilion">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-semibold">{useCase.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {useCase.desc}
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
