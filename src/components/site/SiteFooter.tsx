import Link from "next/link";
import { AnalyticsSettingsButton } from "@/components/analytics/AnalyticsSettingsButton";

const LEGAL_LINKS = [
  { label: "Model License", href: "/model-license" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/**
 * 页脚四列:锚文本用目标词的长尾变体(导航已占精确词,避免同词重复)。
 * 标 TEMP 的 href 是未建页面的临时映射——页面建成时按旁边 TODO 换成
 * 最终 URL,避免给全站制造 404 出链。
 */
const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string; finalHref?: string }[];
}[] = [
  {
    title: "Tools",
    links: [
      { label: "Change the background of a photo", href: "/change-background" },
      { label: "Add a background to a photo", href: "/add-background/" },
      { label: "White background maker", href: "/change-background-to-white/" },
      // TODO: 页面建成后 → /transparent-background/
      { label: "Transparent PNG background", href: "/", finalHref: "/transparent-background/" },
      // TODO: 页面建成后 → /photo-background-editor/
      { label: "Photo background editor", href: "/", finalHref: "/photo-background-editor/" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Product photos", href: "/#ideas" },
      { label: "Headshots", href: "/#ideas" },
      { label: "Passport photos", href: "/change-background-to-white/#faq" },
      { label: "Pets & resale", href: "/change-background-to-white/" },
    ],
  },
  {
    title: "Coming from remove.bg",
    links: [
      // TODO: 汇总页建成后 → /alternatives/best-free-alternatives/
      { label: "remove.bg alternatives", href: "/alternatives/remove-bg-alternative/" },
      // TODO: 关停公告页建成后 → /remove-bg-shutdown/
      { label: "remove.bg shutdown", href: "/change-background-to-white/#faq", finalHref: "/remove-bg-shutdown/" },
      // TODO: 汇总页建成后 → /alternatives/best-free-alternatives/
      { label: "Best free alternatives", href: "/change-background-to-white/#faq", finalHref: "/alternatives/best-free-alternatives/" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "How to change the background of a photo", href: "/guide/how-to-change-background" },
      { label: "Change a background to white", href: "/change-background-to-white/" },
      { label: "How it works in three steps", href: "/#how" },
      { label: "Photo tips for cleaner cutouts", href: "/#tips" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <nav
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Footer"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© 2026 SwitchBG</p>
          <p className="font-mono">
            Images are processed in your browser and are not uploaded by
            SwitchBG.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <AnalyticsSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
