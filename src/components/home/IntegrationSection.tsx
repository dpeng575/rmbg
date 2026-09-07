import {
  ArrowRight,
  Braces,
  Laptop,
  Monitor,
  Smartphone,
  Terminal,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { Section } from "./Section";
import { integrations } from "@/content/home";

const ICONS: Record<string, LucideIcon> = {
  wand: Wand2,
  monitor: Monitor,
  laptop: Laptop,
  terminal: Terminal,
  smartphone: Smartphone,
  braces: Braces,
};

export function IntegrationSection() {
  return (
    <Section
      id="integrations"
      kicker="02 · 工具与集成"
      title="融入你的工作流"
      sub="为常用的设计软件、桌面系统与开发场景准备的工具和插件。核心引擎始终在本地运行,隐私不打折扣。"
    >
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = ICONS[integration.icon];
          return (
            <a
              key={integration.name}
              href="#"
              className="group flex items-center gap-4 rounded-2xl border border-mist bg-panel p-5 shadow-panel transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-mist-deep"
            >
              <span className="checkerboard-fine flex size-12 shrink-0 items-center justify-center rounded-xl border border-mist text-ink">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{integration.name}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">
                  {integration.desc}
                </span>
              </span>
              <ArrowRight
                className="ml-auto size-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink"
              />
            </a>
          );
        })}
      </div>
    </Section>
  );
}
