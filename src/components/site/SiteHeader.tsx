import Link from "next/link";
import { Replace } from "lucide-react";

const NAV = [
  { label: "How it works", href: "/#how" },
  { label: "Backgrounds", href: "/#backgrounds" },
  { label: "Why SwitchBG", href: "/#why" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SwitchBG home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Replace className="size-4.5" strokeWidth={2} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Switch<span className="text-primary">BG</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#tool"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
        >
          Change a background
        </Link>
      </div>
    </header>
  );
}
