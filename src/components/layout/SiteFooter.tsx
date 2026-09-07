import { LogoMark } from "@/components/Logo";
import { footerColumns } from "@/content/home";

export function SiteFooter() {
  return (
    <footer className="border-t border-mist bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-lg font-bold tracking-tight">
                裁云
                <span className="ml-1.5 font-mono text-sm font-medium text-ink-soft">
                  rmbg
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              在浏览器里完成的一键 AI 抠图。你的图片,从未离开你的设备。
            </p>
            <p className="mt-6 font-mono text-xs text-ink-faint">
              本站为学习复刻项目,灵感来自 remove.bg
            </p>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-mist pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© 2026 裁云 rmbg · 纸墨与朱砂之间</p>
          <p className="font-mono">0 uploads · 0 servers · 100% local</p>
        </div>
      </div>
    </footer>
  );
}
