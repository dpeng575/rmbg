import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HashLink } from "@/components/site/HashLink";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "remove.bg Alternatives – What to Use After the Shutdown | SwitchBG",
  description:
    "remove.bg closes on 1 December 2026. Compare the alternatives that still work, and move your photos, batches and API calls over in a few minutes.",
  alternates: { canonical: "/alternatives/remove-bg-alternative" },
};

/** 本页专属 8 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const SHUTDOWN_FAQS: { q: string; a: string }[] = [
  {
    q: "Is remove.bg shutting down?",
    a: "Its standalone website is closing, and the technology is moving into Canva. remove.bg's own banner says the background removal \"is moving to Canva\" and that \"the standalone website will no longer be available from 1 December 2026\".",
  },
  {
    q: "When does remove.bg close?",
    a: "1 December 2026 at 9:00am CET, according to the banner on remove.bg itself.",
  },
  {
    q: "Will remove.bg still work after December 2026?",
    a: "The standalone site won't. The background removal feature continues inside Canva. For the specifics — including what happens to existing accounts — check remove.bg's FAQ and its updated General Terms, both linked from its own banner.",
  },
  {
    q: "What happens to my remove.bg credits?",
    a: "That's answered by remove.bg's terms, not by us — its FAQ and General Terms pages set out the position.",
  },
  {
    q: "Is there a free remove.bg alternative?",
    a: "Yes. Several on the list above have free tiers with limits, and our photo background changer is free with no watermark and no account.",
  },
  {
    q: "Can I still use remove.bg's API?",
    a: "Its API documentation and terms are the place to confirm that, since the announcement covers the website. If you're planning a migration, budget time for it either way.",
  },
  {
    q: "Which alternative is closest to remove.bg?",
    a: "If you mainly used the free preview and the occasional HD download, most tools on the list will feel similar. If you relied on batch processing or an API, prioritise those two columns — that's where the differences actually bite.",
  },
  {
    q: "Do I have to start over with my photos?",
    a: "No. Your image files are yours and nothing is locked inside remove.bg. What needs redoing is the workflow around them — saved bookmarks, batch jobs and API calls.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SHUTDOWN_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const ALTERNATIVE_TOOLS: {
  tool: string;
  runs: string;
  best: string;
  watch: string;
  self?: boolean;
}[] = [
  {
    tool: "Canva",
    runs: "Web, account needed",
    best: "Where remove.bg's tech is going; design work in one place",
    watch: "Overkill if you only need a cutout",
  },
  {
    tool: "Photoroom",
    runs: "Web and mobile app",
    best: "Product photos, mobile-first editing",
    watch: "Full editor, not a single-purpose cutout",
  },
  {
    tool: "Erase.bg",
    runs: "Web",
    best: "A quick free cutout",
    watch: "Free-tier limits and exports vary by plan",
  },
  {
    tool: "Slazzer",
    runs: "Web, API",
    best: "Batch and API workflows",
    watch: "Plans are credit-based",
  },
  {
    tool: "Pixlr",
    runs: "Web",
    best: "Occasional edits alongside other tools",
    watch: "Ad-supported free tier",
  },
  {
    tool: "Photopea",
    runs: "Web",
    best: "Manual masking when the auto cutout gets it wrong",
    watch: "A full editor — a steeper learning curve",
  },
  {
    tool: "SwitchBG",
    runs: "Browser, no account",
    best: "Free cutouts and background swaps, up to 4096px on the long edge",
    watch: "Newer, and smaller than the names above",
    self: true,
  },
];

export default function RemoveBgAlternative() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        {/* —— H1 + 首屏 + 紧凑上传条 —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              remove.bg Alternatives: What to Use Now
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              remove.bg&apos;s standalone website closes on{" "}
              <strong className="font-semibold text-foreground">
                1 December 2026
              </strong>
              , and its background removal is moving into Canva. If you&apos;ve
              been using it for listings, headshots or an automated pipeline,
              here&apos;s what actually changes, what still works, and how to
              move your photos over without redoing everything.
            </p>
            <p
              className="animate-rise mt-4 text-xs italic text-muted-foreground"
              style={{ animationDelay: "160ms" }}
            >
              Last updated: 1 October 2026.
            </p>
            <div
              className="animate-rise mx-auto mt-8 flex max-w-xl flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-5 shadow-sm sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <p className="text-sm font-medium text-foreground">
                Try a cutout in your browser
              </p>
              <HashLink href="/change-background/#tool"
                className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              >
                Upload a photo
              </HashLink>
            </div>
          </div>
        </section>

        {/* —— What happens on 1 December 2026 —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What happens to remove.bg on 1 December 2026
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This is a migration, not a shutdown of the technology. remove.bg&apos;s
              own banner states it plainly:
            </p>
            <blockquote className="mt-6 border-l-4 border-primary/40 bg-secondary/40 px-6 py-4 leading-relaxed text-muted-foreground">
              &quot;remove.bg&apos;s background removal is moving to{" "}
              <strong className="text-foreground">Canva</strong>. The
              standalone website will no longer be available from{" "}
              <strong className="text-foreground">
                1 December 2026 at 9:00am CET
              </strong>
              .&quot;
            </blockquote>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Its help page carries the same message under the heading
              &quot;remove.bg is moving to Canva&quot;, and adds the context:
              &quot;remove.bg became part of Canva in 2021&quot; and
              &quot;we&apos;re now migrating remove.bg&apos;s background
              removal functionality into the Canva platform&quot;.
            </p>
            <p className="mt-6 font-medium text-foreground">
              The practical version, in order:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                ["2021", "Canva acquires remove.bg."],
                [
                  "2026",
                  "the migration is announced on the site itself, with a banner on every page.",
                ],
                [
                  "1 December 2026, 9:00am CET",
                  "the standalone site goes away. The cutout lives on inside Canva.",
                ],
              ].map(([when, what]) => (
                <li key={when} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {when}
                    </strong>{" "}
                    — {what}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              What that means for you depends on how you used it. The
              background removal itself doesn&apos;t disappear — but the place
              you used it does.
            </p>
          </div>
        </section>

        {/* —— What you lose —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What you lose when remove.bg&apos;s site closes
            </h2>
            {[
              [
                "The direct route.",
                "No more opening remove.bg, dropping a file and downloading. You'll be going through Canva, which means an account and a bigger product around a small task.",
              ],
              [
                "The free preview tier as you know it.",
                "remove.bg's upload page labels its free download as \"up to 0.25 megapixels\" — enough to check the cutout, not enough to publish. High-resolution downloads run on credits.",
              ],
              [
                "Your credit balance and its terms.",
                "What happens to credits you've already bought is a question for remove.bg's own FAQ and General Terms — check those directly rather than assuming they carry over.",
              ],
              [
                "Batch jobs and integrations.",
                "Its batch editing page and the Figma, Photoshop and Zapier integrations all point at remove.bg. If any of them sit in your weekly workflow, they need a new home before December.",
              ],
              [
                "The mobile app.",
                "Same story: a separate route to the same feature.",
              ],
            ].map(([lead, rest]) => (
              <div key={lead} className="mt-6">
                <h3 className="font-semibold">{lead}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {rest}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* —— What to look for —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What to look for in a remove.bg alternative
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The right choice comes down to three questions, and they&apos;re
              worth answering in this order.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Free downloads without a watermark
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The whole point of a background remover is the file you walk away
              with. Check whether the free tier gives you a usable image or a
              preview, and whether a watermark appears. A tool that only hands
              you a small preview on the free plan isn&apos;t a replacement
              for the tier you were using.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Batch and API access
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              If you process one photo at a time, this doesn&apos;t matter. If
              you&apos;re running a catalogue or an automated pipeline,
              it&apos;s the deciding factor — you need the same backdrop
              applied across a folder, and an API you can call from your own
              code.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Where your photos are processed
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Some tools upload your image to a server and return a cutout.
              Others run the segmentation in your browser, so the file never
              leaves your machine. For client work, ID photos and anything
              under an NDA, the second option is the easier one to sign off
              on.
            </p>
          </div>
        </section>

        {/* —— Which alternatives are worth a look —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Which alternatives are worth a look
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A short, honest list — including the tool we built, and the one
              most people will end up in.
            </p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Tool</th>
                    <th className="px-4 py-3 font-semibold">Where it runs</th>
                    <th className="px-4 py-3 font-semibold">Best for</th>
                    <th className="px-4 py-3 font-semibold">Watch out for</th>
                  </tr>
                </thead>
                <tbody>
                  {ALTERNATIVE_TOOLS.map((row) => (
                    <tr
                      key={row.tool}
                      className={`border-b border-border last:border-b-0 ${row.self ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {row.tool}
                        {row.self && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                            This site
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.runs}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.best}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.watch}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Plans and free-tier limits change often — check each site&apos;s
              current pricing before you commit.
            </p>
          </div>
        </section>

        {/* —— How to move your work off remove.bg —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to move your work off remove.bg
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Nothing here is complicated, but the order matters: prove the
              quality first, then move the volume, then touch your code.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Step 1: test one photo
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Pick the hardest photo you&apos;ve got — hair, fur, a product
              with a reflective edge. Run it through your shortlist and compare
              the cutout at full size against the result you used to get. This
              is the only step that can change your mind, so don&apos;t skip
              it.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Step 2: move your batch workflow
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Once one photo passes, run a folder through. The thing to check
              isn&apos;t just the cutouts — it&apos;s consistency. A catalogue
              where forty photos come back on four slightly different whites
              looks like four different sellers, and that&apos;s harder to fix
              later than it is to set up now.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Step 3: swap the API
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              If you call an API today, the migration is mostly about replacing
              one request with another: same image in, same cutout out, new
              endpoint and credentials. Test it on a small batch before you
              repoint production traffic, and keep the old call available until
              the new one has run clean for a week.
            </p>
          </div>
        </section>

        {/* —— Why SwitchBG —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why SwitchBG is a straightforward alternative
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                [
                  "Free, with no watermark and no account.",
                  "Upload, cut out and download without handing over an email.",
                ],
                [
                  "Your photo stays on your device.",
                  "The segmentation runs in the browser, so nothing is uploaded to be processed.",
                ],
                [
                  "Up to 4096px on the long edge, not a preview tier.",
                  "Photos within that limit download at their original size.",
                ],
                [
                  "Built for batches.",
                  "A folder in, the same backdrop applied across the set.",
                ],
              ].map(([lead, rest]) => (
                <li key={lead} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span className="leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {lead}
                    </strong>{" "}
                    {rest}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                />
                <span className="leading-relaxed text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    Does the next step too.
                  </strong>{" "}
                  Cut the subject out, then{" "}
                  <Link
                    href="/change-background"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    change the background
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/add-background"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    add a background
                  </Link>{" "}
                  without opening a second tool.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* —— FAQ —— */}
        <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions about the remove.bg shutdown
            </h2>
            <div className="mt-8 space-y-8">
              {SHUTDOWN_FAQS.map(({ q, a }, i) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                    {i === 4 && (
                      <>
                        {" "}
                        <Link
                          href="/"
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Try SwitchBG&apos;s photo background changer
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* —— More background tools —— */}
        <section className="scroll-mt-20 border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              More background tools
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/change-background",
                  h3: "Change the background of a photo",
                  desc: "Swap what's behind the subject, on any photo.",
                },
                {
                  href: "/add-background",
                  h3: "Add a background to a photo",
                  desc: "Starting from a cutout or a transparent PNG.",
                },
                {
                  href: "/change-background-to-white",
                  h3: "Change a background to white",
                  desc: "Pure white, ready for catalogue and ID shots.",
                },
                {
                  href: "/guide/how-to-change-background/",
                  h3: "How to change the background of a photo",
                  desc: "The step-by-step walkthrough.",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="block rounded-xl border border-border bg-card p-5 transition-shadow duration-150 hover:shadow-md"
                >
                  <h3 className="font-semibold">{card.h3}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
