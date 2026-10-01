import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Add a Background to a Photo – Free Online Background Adder | SwitchBG",
  description:
    "Add a background to a photo or a transparent PNG in three steps. Choose a colour, an image or a gradient, then download the finished shot. Free and instant.",
  alternates: { canonical: "/add-background" },
};

/** 本页专属 10 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const ADD_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I add a background to a photo?",
    a: "Upload your transparent PNG or your already-cut-out image, choose a colour, gradient or backdrop image, then download. If your photo still has its original background, it's removed automatically on the way in.",
  },
  {
    q: "Can I add a background to a transparent PNG?",
    a: "Yes — that's the main use case. A transparent PNG is exactly what this tool expects, and nothing is flattened until you download.",
  },
  {
    q: "How do I add a white background to a product photo?",
    a: "Choose white as a flat colour, then download. The subject stays cut out against a fully white backdrop, which is what most marketplace main-image specs ask for.",
  },
  {
    q: "Can I add a background to a passport photo?",
    a: "You can add the plain light background most ID specs require. You'll still need to check the head size, margin and background colour rules for your country before submitting.",
  },
  {
    q: "Do I need Photoshop or Canva to add a background?",
    a: "No. If you have a cutout or a transparent PNG, everything runs in the browser. Photoshop is only worth opening if you need to retouch the subject itself.",
  },
  {
    q: "Can I add the same background to many photos at once?",
    a: "Yes — upload several images at once, set the background once, and download the results. Every image comes back with the same backdrop.",
  },
  {
    q: "What size should the background image be?",
    a: "At least as large as your output. Anything smaller gets scaled up and can look soft, so start from the largest version you have.",
  },
  {
    q: "Will the edges look clean?",
    a: "Hair, fur and semi-transparent edges are where background work usually shows. Check at full size before downloading, and pick a backdrop tone that contrasts with your subject if the edges are delicate.",
  },
  {
    q: "Is it free?",
    a: "Yes. Uploading, adding a background and downloading are free, with no watermark and no account required.",
  },
  {
    q: "What's the difference between adding and changing a background?",
    a: "Adding starts with a subject on its own — a cutout or transparent PNG — and puts something behind it. Changing the background starts with an ordinary photo and replaces what's already there.",
  },
];

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG — Add a Background to a Photo",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Add a colour, gradient or image background to a cutout or transparent PNG. Free, no signup, no watermark.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to add a background to a photo",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Start with your cutout or photo",
      text: "Upload your transparent PNG or the image you've already cut out. If the subject still has its original background attached, SwitchBG detects and removes it on the way in, so you don't have to run two rounds of editing. JPG, PNG and WebP all work, and your file stays in your browser — both the cutout and the composite run locally.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Pick a colour, gradient or image",
      text: "Choose a flat colour (white, charcoal, navy, emerald and more), a soft two-stop gradient, or upload a backdrop image of your own. Backdrop images are scaled automatically to sit behind your subject, centred on the frame.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the finished photo",
      text: "Check the edges at full size — hair, fur and semi-transparent detail are where background work usually falls apart — then download. PNG keeps transparency in any gaps, JPG gives you a smaller file for the web, and neither carries a watermark.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ADD_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function AddBackground() {
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
              Add a Background to a Photo
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              You&apos;ve got the cutout. Now give it somewhere to stand — add
              a background to a photo in a few seconds by picking a colour, a
              gradient or an image of your own. Free, no sign-up, nothing to
              install.
            </p>
          </div>
        </section>

        {/* —— 工具区(同页处理) —— */}
        <BackgroundStudio />

        {/* —— Add a background to a cutout or a transparent PNG —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Add a background to a cutout or a transparent PNG
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every background edit has two halves, and it&apos;s worth knowing
              which one you&apos;re doing. Changing a background starts with an
              ordinary photo — subject <em>and</em> scenery — and swaps the
              scenery out. Adding a background starts from the other end: you
              already have the subject on its own, as a cutout or a transparent
              PNG, and you need something to put behind it.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you&apos;re holding a transparent PNG from a marketplace
              export, a client hand-off, or a cutout you made earlier, this is
              the right tool. If instead you have an untouched photo and want
              what&apos;s behind the subject replaced,{" "}
              <Link
                href="/change-background"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                change the background first
              </Link>{" "}
              — that&apos;s a different job with a different starting point.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Both routes finish in the same place: one clean image, your
              subject sitting on a background you chose. Only the starting
              point differs.
            </p>
          </div>
        </section>

        {/* —— How to add a background to a photo —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to add a background to a photo
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Three steps, and none of them involve a selection tool.
            </p>
            {howToJsonLd.step.map((step: { name: string; text: string }, i) => (
              <div key={step.name}>
                <h3 className="mt-8 text-lg font-semibold">
                  {`0${i + 1} · ${step.name}`}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* —— Add a background for the job you're doing —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Add a background for the job you&apos;re doing
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The right backdrop depends on what the photo has to do. These are
              the four jobs people bring us most often, and what tends to work
              for each.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Shop and marketplace listings
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Pure white is still the safest default for Amazon, eBay, Etsy and
              most catalogue specs — it&apos;s the one backdrop that makes no
              claim about your product and never clashes in a thumbnail grid.
              For lifestyle-style listings, a light neutral (warm grey, soft
              sand) reads more premium than white without losing the
              product&apos;s edges. Keep the subject centred with even padding
              so the image crops well in search results.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              ID and passport photos
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              ID photos are a specification, not a style choice. Most
              countries require a plain, light background — white or off-white
              for the US and UK, light grey or blue accepted elsewhere — with
              the head centred and no shadow across the backdrop. Add the
              background here, then check your file against the official size
              and head-height rules for the country you&apos;re applying to
              before you submit.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Pets, keepsakes and resale
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Resale listings and pet portraits are the fun end of this. A
              clean neutral background makes a second-hand item look
              photographed rather than snapped, and it&apos;s the single
              biggest visual upgrade between a listing that sells and one that
              sits. For pets, a soft gradient keeps the fur looking soft rather
              than pasted.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Social posts and profile pictures
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A flat, saturated colour behind a headshot is the fastest way to
              make a profile picture look deliberate — and the easiest way to
              keep a team consistent. Upload a branded backdrop image if you
              want a pattern or texture, and use the same framing on every
              photo so a row of avatars lines up.
            </p>
          </div>
        </section>

        {/* —— Adding a background without Photoshop —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Adding a background without Photoshop
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most background tutorials assume you&apos;ll cut a path with the
              pen tool, refine the edge by hand, and paste in a layer.
              That&apos;s the right tool for a retoucher with an hour to spare
              — and the wrong one when you have forty listings to publish
              tonight.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              SwitchBG handles the masking and the compositing for you, which
              removes the two steps that eat the time: making the selection,
              and repairing the edges afterwards. You keep the parts that need
              judgement — which backdrop, what crop, what size — and hand off
              the parts that don&apos;t. The result is a background you can put
              behind a whole batch of photos with no design tool, no plugin and
              no subscription.
            </p>
          </div>
        </section>

        {/* —— Add a background to a whole folder at once —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Add a background to a whole folder at once
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              One photo at a time is fine for a profile picture. It isn&apos;t
              fine for a catalogue. Drop in a folder and SwitchBG applies the
              same backdrop to every file — set it once and the whole set comes
              back consistent — which matters more than people expect, because
              a grid of listings shot on four slightly different whites looks
              like four different sellers.
            </p>
          </div>
        </section>

        {/* —— Questions about adding a background —— */}
        <section id="faq" className="scroll-mt-20 border-y border-border py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions about adding a background
            </h2>
            <div className="mt-8 space-y-8">
              {ADD_FAQS.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* —— More background tools(复用首页卡片样式) —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              More background tools
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/change-background/",
                  h3: "Change the background of a photo",
                  desc: "Start from a normal photo and swap what's behind the subject.",
                },
                {
                  href: "/change-background-to-white/",
                  h3: "Change a background to white",
                  desc: "Pure white, ready for catalogue and ID shots.",
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
