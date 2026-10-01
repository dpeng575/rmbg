import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import type { BackgroundOption } from "@/lib/backgrounds";

const WHITE: BackgroundOption = {
  kind: "color",
  id: "c-white",
  label: "White",
  color: "#ffffff",
};

export const metadata: Metadata = {
  title: "Change Background to White – Free White Background Maker | SwitchBG",
  description:
    "Change the background of a photo to white in seconds. Pure white or off-white, clean edges, up to 4096px on the long edge. Free, no sign-up, nothing to install.",
  alternates: { canonical: "/change-background-to-white" },
};

/** 本页专属 11 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const WHITE_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I change the background of a photo to white?",
    a: "Upload the photo, let the subject be separated from its original background, choose white as a flat colour, then download. There's no selection tool involved.",
  },
  {
    q: "Can I change a photo background to white for free?",
    a: "Yes — uploading, changing the background and downloading cost nothing here, with no watermark and no account required.",
  },
  {
    q: "Should the background be pure white or off-white?",
    a: "Pure white (#FFFFFF) for marketplace main images, because that's what the spec means and it keeps a category grid uniform. Use a very light grey instead when the product itself is white or pale, so it doesn't lose its outline.",
  },
  {
    q: "How do I make the background of a product photo white?",
    a: "Lift the product off its original background, fill with white, then centre it with even padding. Run the whole catalogue through the same settings so the grid matches.",
  },
  {
    q: "Will a white background hurt my product photo's edges?",
    a: "It can, if the original background was light — a pale halo can survive along the outline and is most visible against white. Check at 200% and fix the cutout rather than the fill.",
  },
  {
    q: "Do I need Photoshop to change a background to white?",
    a: "No. Separating a subject and filling in white runs in the browser. An editor only earns its keep when you need to retouch the subject itself, or rescue flyaway hair by hand.",
  },
  {
    q: "Can I make the background white on my phone?",
    a: "Yes. It runs in a mobile browser and the finished file saves straight to your camera roll.",
  },
  {
    q: "What size should the white background be?",
    a: "The finished image matches your photo, so start from the size and shape your destination asks for — a square for most marketplace grids, 4:5 for a feed, 3:2 for print. Keep the subject centred with even space so a later crop doesn't clip it.",
  },
  {
    q: "What's the difference between a white background and a transparent one?",
    a: "A white background is a finished image with a solid fill. A transparent background is an alpha channel — a cutout with nothing behind it, ready to sit on a coloured page or inside a design later. Changing the background lets you choose either.",
  },
  {
    q: "Can I change several photos to white at once?",
    a: "Yes. Drop in a folder and the same white is applied to every file, ready to download one by one.",
  },
  {
    q: "Will my photo be uploaded to a server?",
    a: "No. The segmentation runs locally in your browser, so the image never leaves your device.",
  },
  {
    q: "Does remove.bg still work for this?",
    a: "remove.bg's standalone site is closing — its own banner says the site \"will no longer be available from 1 December 2026\".",
  },
];

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG — Change Background to White",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Change a photo's background to clean, even white in seconds. Free, no signup, no watermark.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to change a background to white",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your photo",
      text: "Drop in a JPG, PNG or WebP. The subject is lifted away from whatever was behind it on the way in, so there's no selection to draw and no mask to repair — including the hair, fur and semi-transparent edges that usually break a background edit. Check those at full size before you move on; they're the part reviewers look at.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Set the background to white",
      text: "Choose white as a flat colour. The page opens with pure white pre-selected, and the light-grey swatch gives you a softer off-white when the product itself is white and would otherwise lose its outline. The finished image keeps your photo's dimensions, so frame the subject centred with even space on all sides.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the finished image",
      text: "Check the result at full size, then download. PNG keeps an alpha channel wherever you left one, JPG gives you a smaller file for the web, and neither carries a watermark. Photos up to 4096px on the long edge come back at their original resolution — not a preview tier.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WHITE_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ChangeBackgroundToWhite() {
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
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Change Background to White
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              White is the safest backdrop there is: it makes no claim about
              your product, survives being cropped down to a thumbnail, and
              meets the spec most marketplaces and ID photos ask for. Upload a
              photo and turn what&apos;s behind your subject into clean, even
              white in a few seconds — free, no sign-up, nothing to install.
            </p>
            <p
              className="animate-rise mt-4 text-sm font-medium text-muted-foreground"
              style={{ animationDelay: "160ms" }}
            >
              <span className="font-semibold text-foreground">
                White is already selected
              </span>{" "}
              — upload a photo to see it on a clean #FFFFFF backdrop.
            </p>
          </div>
        </section>

        {/* —— 工具区:白色预选 —— */}
        <BackgroundStudio initialBackground={WHITE} />

        {/* —— What a white background is for —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What a white background is for
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Three jobs, and each one has its own rules.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Selling something.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Marketplace grids were built around white. A product on white
              reads as an official listing rather than a snapshot, and because
              every image in a category shares the same backdrop, a
              shopper&apos;s eye goes to the shape and colour of the item
              instead of whatever was in the room behind it.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Meeting a specification.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Passports, visas, ID cards and plenty of job applications require
              a plain light background — white or off-white depending on the
              country and the document. This isn&apos;t a style choice.
              There&apos;s a written rule, and a photo that misses it gets sent
              back.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Printing and layouts.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              On packaging, labels, lookbooks and slides, white is the default
              because it disappears. Put a cutout on a white page and
              there&apos;s nothing to blend around it.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              If you want a different colour, a gradient or a photo behind your
              subject,{" "}
              <Link
                href="/change-background"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                change the background to something else
              </Link>{" "}
              — white is one option among several, and it&apos;s worth its own
              page because the spec and the quality bar are different. And if
              your subject is already cut out and you just need to place it on
              white,{" "}
              <Link
                href="/add-background"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                adding a background to a photo
              </Link>{" "}
              starts from there instead.
            </p>
          </div>
        </section>

        {/* —— How to change a background to white —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change a background to white
            </h2>
            {howToJsonLd.step.map((step: { name: string; text: string }) => (
              <div key={step.name}>
                <h3 className="mt-8 text-lg font-semibold">{step.name}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* —— Getting the white right —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Getting the white right
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Anyone can fill in a white rectangle. These are the four things
              that separate a listing photo that looks professional from one
              that looks edited.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Pure white or off-white?
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Pure white (#FFFFFF) is what marketplace specs mean when they say
              white, and it&apos;s what makes a grid look uniform. But if the
              product is white or pale — a ceramic mug, a white shirt, a silver
              watch — pure white swallows the outline. Drop to a very light
              grey (somewhere around #F5F5F5 to #FAFAFA — the built-in Light
              grey swatch sits in that range) and the item keeps a visible edge
              while still reading as white at thumbnail size. Whichever you
              pick, pick one and reuse it: forty photos on four slightly
              different whites look like four different sellers.
            </p>
            <h3 className="mt-8 text-lg font-semibold">The halo problem.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              When a subject is lifted off a light original background, a faint
              pale rim can survive along the edge — most visible against white.
              Check the outline at 200% before you export. If you see a light
              fringe, the fix is in the cutout, not in the fill: re-run it, or
              nudge the subject inward a fraction of a pixel.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Shadows: usually leave them out.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Most marketplace main-image rules are strict about a plain white
              background, and a drop shadow reads as an off-white smudge. Keep
              a soft shadow only where the platform allows it and you&apos;re
              uploading a lifestyle image rather than a main one.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Hair and fur.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Flyaway strands are the hardest thing to lift onto white, because
              every strand that&apos;s missed becomes a grey wisp against a
              bright backdrop. Zoom in on the head or the fur line and check
              whether the wisps survived. If they didn&apos;t, that&apos;s the
              one place where a manual mask in Photopea or a similar editor
              still earns its keep.
            </p>
          </div>
        </section>

        {/* —— Which specs actually ask for white —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Which specs actually ask for white
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Marketplaces and paperwork both publish their own rules, and they
              change — so treat these as the shape of the requirement, not as
              the current wording.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Product listings.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The big general marketplaces ask for a pure white background on
              the main image, with the product filling most of the frame and no
              added text, watermarks or props. Secondary images are usually
              allowed to be lifestyle shots on other backgrounds.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              ID and passport photos.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The background requirement is generally a plain, light,
              unpatterned backdrop, and whether white or off-white is accepted
              depends on the country and the document type. Check the current
              requirement for your specific case before you shoot — a rejected
              application costs far more time than the photo does.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Print and packaging.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Nothing formal here. White is just the practical default, because
              it&apos;s the one backdrop that never competes with the artwork
              on top of it.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              For photographing the subject in the first place, our{" "}
              <Link
                href="/guide/how-to-change-background"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                step-by-step guide to changing a photo&apos;s background
              </Link>{" "}
              covers lighting, spacing and the mistakes that can&apos;t be
              fixed after the fact.
            </p>
          </div>
        </section>

        {/* —— Change a whole catalogue to white at once —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Change a whole catalogue to white at once
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you&apos;re working through a folder rather than one image,
              the useful part isn&apos;t the background removal —
              it&apos;s consistency. Drop in the folder, choose white once, and
              the same colour is applied to every file.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              That matters for more than speed. A category page assembled from
              forty individually edited photos drifts: the whites don&apos;t
              match, the subjects sit at different heights in the frame, and
              the grid looks broken even though every image is technically
              fine. Applying one white and one framing rule across the set is
              the difference between a shop and a pile of pictures.
            </p>
          </div>
        </section>

        {/* —— Change a background to white in your browser —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Change a background to white in your browser
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most &quot;how to make a background white&quot; instructions
              assume you&apos;ll cut a path with a pen tool, refine the edge by
              hand and paste in a layer. That&apos;s the right approach for a
              retoucher with an hour to spare, and the wrong one when you have
              forty photos to publish tonight.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Everything here runs in the browser. Nothing to install, no
              plugin to update, no account to create and no subscription to
              cancel later. Your photo isn&apos;t uploaded to a server to be
              processed, either — the segmentation runs locally, which is the
              answer you want when the images are client work, ID photos or
              anything under an NDA. You keep the parts that need judgement —
              which white, what crop, what size — and hand off the parts that
              don&apos;t. And when you need a different finish, the same{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                photo background changer
              </Link>{" "}
              covers every background, not just white.
            </p>
          </div>
        </section>

        {/* —— Why people use SwitchBG —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why people use SwitchBG to change a background to white
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                [
                  "Free, with no watermark and no account.",
                  "Upload, change the background and download without handing over an email address.",
                ],
                [
                  "Your photo stays on your device.",
                  "The cutout runs locally in the browser, so the image isn't sent anywhere to be processed.",
                ],
                [
                  "Both whites covered.",
                  "Pure white for marketplace specs, or the built-in off-white swatch when the product is pale.",
                ],
                [
                  "Up to 4096px on the long edge.",
                  "Photos within the limit download at their original size, with no preview-tier ceiling.",
                ],
                [
                  "Batch-friendly.",
                  "The same white across a whole folder.",
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

        {/* —— FAQ —— */}
        <section id="faq" className="scroll-mt-20 border-y border-border py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions about changing a background to white
            </h2>
            <div className="mt-8 space-y-8">
              {WHITE_FAQS.map(({ q, a }, i) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                    {i === WHITE_FAQS.length - 1 && (
                      <>
                        {" "}
                        <Link
                          href="/alternatives/remove-bg-alternative"
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Here&apos;s what still works and how to move your
                          photos over.
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* —— More background tools —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              More background tools
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/change-background",
                  h3: "Change the background of a photo",
                  desc: "Pick any colour, gradient or image instead of white.",
                },
                {
                  href: "/add-background",
                  h3: "Add a background to a photo",
                  desc: "Starting from a cutout or a transparent PNG.",
                },
                {
                  href: "/guide/how-to-change-background/",
                  h3: "How to change the background of a photo",
                  desc: "The full walkthrough, including lighting and edge fixes.",
                },
                {
                  href: "/alternatives/remove-bg-alternative",
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
