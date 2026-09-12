import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Model License", href: "/model-license" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
        <p>© 2026 SwitchBG</p>
        <p className="font-mono">
          Images are processed in your browser and are not uploaded by SwitchBG.
        </p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Legal">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
