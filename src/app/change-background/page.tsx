import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Change Background Online – Free Photo Background Changer | SwitchBG",
  description:
    "Change the background of any photo in seconds. Upload an image, pick a colour, a photo or a transparent backdrop, and download a clean cutout. Free, no sign-up.",
  alternates: { canonical: "/change-background" },
};

/** 本页专属 12 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const CHANGE_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I change the background of a photo?",
    a: "Upload the photo, let the subject be lifted from its original background, then choose a colour, gradient, backdrop image or transparency and download the result.",
  },
  {
    q: "Can I change a background to a specific colour?",
    a: "You can pick from the colour swatches — white, charcoal, navy, emerald and more — which covers most marketplace and ID requirements. A custom hex picker isn't in the tool yet.",
  },
  {
    q: "How do I change the background of a photo to white?",
    a: "Choose white as a flat colour and download. Keep the subject centred with even space on all sides.",
  },
  {
    q: "Does changing the background reduce photo quality?",
    a: "No. The cutout and the composite both run at your photo's full quality, and the download isn't re-compressed beyond the format you pick. Photos above 4096px on the long edge are scaled down first so the browser can process them reliably.",
  },
  {
    q: "Can I change the background of a product photo?",
    a: "That's the most common use. White and light neutrals are the usual choices, and the same backdrop can be applied to a whole catalogue so the grid looks consistent.",
  },
  {
    q: "Is there a free way to change a background?",
    a: "Yes — this one. Uploading, changing the background and downloading cost nothing, with no watermark and no account.",
  },
  {
    q: "Do I need Photoshop to change a background?",
    a: "No. If the subject just needs to be separated from what's behind it, everything runs in the browser. Photoshop is worth opening only when you need to retouch the subject itself.",
  },
  {
    q: "Can I change the background of a photo on my phone?",
    a: "Yes. The tool runs in a mobile browser, and the downloaded file saves straight to your camera roll.",
  },
  {
    q: "What's the difference between changing and adding a background?",
    a: "Changing starts with an ordinary photo and replaces what's already behind the subject. Adding a background starts from the other end — a cutout or a transparent PNG that needs something put behind it.",
  },
  {
    q: "Can I change the background of several photos at once?",
    a: "Yes. Drop in a folder and the same background is applied to every file, ready to download one by one.",
  },
  {
    q: "Will my photo be uploaded to a server?",
    a: "No. The segmentation runs locally in your browser, so the image never leaves your device.",
  },
  {
    q: "remove.bg is closing — what do I use instead?",
    a: "remove.bg's own site says the standalone website \"will no longer be available from 1 December 2026\". If you're moving your workflow off it, we've set out what still works and how to move your photos over.",
  },
];

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG — Change Background Online",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Change the background of any photo in seconds — colour, image or transparent. Free, no signup, no watermark.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to change the background of a photo",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your photo",
      text: "Drop in your JPG, PNG or WebP. SwitchBG finds the subject on its own and lifts it away from whatever was behind it, so there's no edge to trace and no mask to paint. Hair, fur and semi-transparent edges are handled on the way in — those are the details that usually break a background edit, so it's worth checking them at full size before you go further.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose the new background",
      text: "Pick a flat colour, a gradient, one of your own images, or transparency. If you need a white background for a catalogue or an ID photo, our change background to white page is one click away. The framing follows your photo — the finished image keeps the subject's dimensions.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the finished image",
      text: "Check the result at full size, then download. PNG keeps transparency wherever you left it, JPG gives you a smaller file for the web, and neither carries a watermark. Photos up to 4096px on the long edge come back at their original resolution.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CHANGE_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ChangeBackground() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        {/* —— H1 + 首屏文案 —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Change Background
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Change the background of a photo in seconds: upload your image,
              keep the subject, and swap in a colour, an image or a transparent
              backdrop. Free, no sign-up, nothing to install.
            </p>
          </div>
        </section>

        {/* —— 工具区(同页处理) —— */}
        <BackgroundStudio />

        {/* —— What you can change the background to —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What you can change the background to
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A background isn&apos;t just &quot;the thing behind your
              subject&quot;. It&apos;s a decision with four usual answers, and
              each one suits a different job.
            </p>
            <h3 className="mt-8 text-lg font-semibold">A flat colour.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              White, black, a soft grey or a brand tone from the colour
              swatches. Flat colour is the safest choice for marketplaces, ID
              photos and anywhere the image has to survive being cropped into a
              small thumbnail.
            </p>
            <h3 className="mt-8 text-lg font-semibold">A gradient.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Two close tones blended behind the subject. It reads as more
              considered than a plain fill and stops the edit from looking like
              an obvious cut-out — which matters for portraits and social
              posts.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              An image of your own.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A studio backdrop, a texture, a room, a location shot. Upload the
              file and it&apos;s scaled automatically to sit behind your
              subject, centred on the frame.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Nothing at all.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A transparent background is the right choice when the image
              isn&apos;t finished yet: a cutout going into a design, a product
              shot heading for a layout, or a PNG you&apos;ll place on a
              coloured page later. You get a clean alpha channel rather than a
              flattened image.
            </p>
          </div>
        </section>

        {/* —— How to change the background of a photo —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change the background of a photo
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Three steps, and none of them involve a selection tool.
            </p>
            {howToJsonLd.step.map((step: { name: string; text: string }, i) => (
              <div key={step.name}>
                <h3 className="mt-8 text-lg font-semibold">
                  {`0${i + 1} · ${step.name}`}
                </h3>
                {i === 1 ? (
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Pick a flat colour, a gradient, one of your own images, or
                    transparency. If you need a white background for a
                    catalogue or an ID photo, our{" "}
                    <Link
                      href="/change-background-to-white"
                      className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      change background to white page
                    </Link>{" "}
                    is one click away. The framing follows your photo — the
                    finished image keeps the subject&apos;s dimensions.
                  </p>
                ) : (
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* —— Background ideas that actually look good —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Background ideas that actually look good
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The backdrop you choose does more work than the cutout does.
              These are the three places it matters most.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Product and shop photos
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Pure white is still the safest default for Amazon, eBay and most
              catalogue specs — it makes no claim about the product and never
              clashes in a thumbnail grid. For lifestyle listings, a light
              neutral reads more expensive than white without losing the
              product&apos;s edges. Keep the item centred with even padding so
              it crops well in search results.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Profile and headshot photos
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A flat, saturated colour behind a headshot is the fastest way to
              make a profile picture look deliberate, and the easiest way to
              keep a team&apos;s avatars consistent. Soft gradients flatter
              portraits more than flat fills — the eye reads a gentle falloff
              as depth rather than as a coloured panel.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Social and listing images
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              For resale listings, a clean neutral background is the single
              biggest visual upgrade between a photo that sells and one that
              sits, because it makes a second-hand item look photographed
              rather than snapped. On social, upload a branded backdrop image
              when you want a pattern or texture, and reuse the same framing so
              a row of posts lines up.
            </p>
          </div>
        </section>

        {/* —— Change a background in your browser —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Change a background in your browser — no software to install
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most background how-tos assume you&apos;ll cut a path with the
              pen tool, refine the edge by hand and paste in a layer.
              That&apos;s the right tool for a retoucher with an hour spare.
              It&apos;s the wrong one when you have forty photos to publish
              tonight.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Everything here runs in the browser. There&apos;s nothing to
              install, no plugin to update, no account to create and no
              subscription to cancel later. You keep the parts that need
              judgement — which backdrop, what crop, what size — and hand off
              the parts that don&apos;t. In short: SwitchBG is a free{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                photo background changer
              </Link>{" "}
              that runs entirely in your browser.
            </p>
          </div>
        </section>

        {/* —— Why people use SwitchBG —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why people use SwitchBG to change a background
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                [
                  "Free, with no watermark and no sign-up.",
                  "Upload, edit and download without handing over an email address.",
                ],
                [
                  "Your photo stays on your device.",
                  "The cutout runs locally in the browser, so the image isn't uploaded to a server to be processed.",
                ],
                [
                  "Up to 4096px on the long edge.",
                  "Photos within that limit download at their original size, with no downgrade behind a paid tier.",
                ],
                [
                  "Batch-friendly.",
                  "The same backdrop can be applied across a folder of photos.",
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
            </ul>
          </div>
        </section>

        {/* —— Questions about changing a background —— */}
        <section id="faq" className="scroll-mt-20 border-y border-border py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions about changing a background
            </h2>
            <div className="mt-8 space-y-8">
              {CHANGE_FAQS.map(({ q, a }, i) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                    {i === CHANGE_FAQS.length - 1 && (
                      <>
                        {" "}
                        <Link
                          href="/alternatives/remove-bg-alternative/"
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Our remove.bg alternative guide
                        </Link>{" "}
                        has the details.
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* —— More background tools(复用卡片样式) —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              More background tools
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/change-background-to-white",
                  h3: "Change a background to white",
                  desc: "Pure white, ready for catalogue and ID shots.",
                },
                {
                  href: "/add-background",
                  h3: "Add a background to a photo",
                  desc: "Starting from a cutout or a transparent PNG instead.",
                },
                {
                  href: "/guide/how-to-change-background/",
                  h3: "How to change the background of a photo",
                  desc: "The step-by-step walkthrough, with edge tips.",
                },
                {
                  href: "/alternatives/remove-bg-alternative/",
                  h3: "Coming from remove.bg?",
                  desc: "What still works now that the site is closing.",
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
