import type { ReactNode } from "react";

export function LegalDocument({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase text-primary">SwitchBG</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {summary}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated: September 12, 2026
        </p>
      </header>
      <div className="space-y-9 py-9 text-sm leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  );
}
