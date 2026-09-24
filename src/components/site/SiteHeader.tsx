import Link from "next/link";
import Image from "next/image";

const NAV = [
  { label: "How it works", href: "/#how" },
  { label: "Ideas", href: "/#ideas" },
  { label: "Better results", href: "/#tips" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="SwitchBG home">
          <Image
            src="/logo.png"
            alt="SwitchBG"
            width={474}
            height={160}
            priority
            className="h-8 w-auto"
          />
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
