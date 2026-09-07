import { LogoMark } from "@/components/Logo";

const NAV = [
  { label: "使用场景", href: "#use-cases" },
  { label: "集成", href: "#integrations" },
  { label: "博客", href: "#blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#studio" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">
            裁云
            <span className="ml-1.5 font-mono text-sm font-medium text-ink-soft">
              rmbg
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#studio"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
        >
          开始抠图
        </a>
      </div>
    </header>
  );
}
