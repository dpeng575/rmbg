import Link from "next/link";

import { HashLink } from "@/components/site/HashLink";
import Image from "next/image";

/**
 * 顶部导航:锚文本带目标词,服务端直出 <a>。
 * V2.0 五个页面已全部上线,导航全量挂载。
 */
const NAV = [
  { label: "Change Background", href: "/change-background" },
  { label: "Add Background", href: "/add-background" },
  { label: "White Background", href: "/change-background-to-white" },
  { label: "Alternatives", href: "/alternatives/remove-bg-alternative" },
  { label: "Guides", href: "/guide/how-to-change-background" },
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

        <HashLink
          href="/#tool"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
        >
          Change a background
        </HashLink>
      </div>
    </header>
  );
}
