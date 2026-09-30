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
  title: "Change Background to White – Free & No Watermark | SwitchBG",
  description:
    "Change background to white in seconds — upload a photo, get a clean white backdrop, download up to 4096px on the long edge. Free, no signup, no watermark.",
  alternates: { canonical: "/change-background-to-white/" },
};

/** 本页专属的 8 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const WHITE_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I change the background to white for free?",
    a: "Upload the photo to this page, keep white selected, and download. There is no charge, no account and no watermark, and you can repeat the process as many times as you like.",
  },
  {
    q: "Can I change photo background to white without Photoshop?",
    a: "Yes. Selecting a subject, masking the edges and filling the background is exactly the job that takes the longest in a photo editor. Here the subject is cut out automatically and white is filled in behind it, so you get the same result in a few seconds.",
  },
  {
    q: "Is there a white background maker for product photos?",
    a: "This page is built for it. Cut out the product, keep white, and export at up to 4096px on the long edge — the result matches what Amazon, Shopify and Etsy listings expect for a main image.",
  },
  {
    q: "How do I make a photo background white on my phone?",
    a: "SwitchBG runs in the browser, so the same tool works on iOS and Android without installing an app. Open this page on your phone, choose the photo from your library, and download the result.",
  },
  {
    q: "Why does my white background look grey after exporting?",
    a: "Usually because the tool exported a near-white tone rather than #FFFFFF, or because the image was saved with a different colour profile. Sample a pixel in the background of the exported file: on this page all three channels read 255.",
  },
  {
    q: "Can I change the background to white in bulk?",
    a: "Yes — select several images when you upload and process them in one go. Because each photo is handled on your device, there is no server queue and no daily limit.",
  },
  {
    q: "Does SwitchBG work for ID and passport photos?",
    a: "It will place a plain white background behind the subject, which is what many photo requirements ask for. Check your specific authority's rules on size, cropping and expression before submitting — those requirements differ by country.",
  },
  {
    q: "What should I use if I need a remove.bg alternative for white backgrounds?",
    a: "SwitchBG does the same core job — cut out the subject, replace the background — with white one click away, no credit limit, no signup and no watermark. See also: remove.bg alternative.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Upload your photo",
    text: "Drag an image onto the page, paste it from your clipboard, or click to browse your device. JPG, PNG and WebP all work. The photo is processed on your device, so it never has to leave it.",
  },
  {
    name: "Keep white, or fine-tune it",
    text: "Pure white (#FFFFFF) is what most marketplaces ask for, and it is what this page defaults to. If your photo looks better on a softer tone, switch to off-white or light grey from the colour swatches — the subject stays cut out either way.",
  },
  {
    name: "Check the edges and download",
    text: "Compare the original and the result side by side, zoom in to inspect the outline, then export at up to 4096px on the long edge. No watermark, no queue, no credit counter.",
  },
];

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG — Change Background to White",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Change a photo's background to pure white in seconds. Free, no signup, no watermark.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to change the background to white",
  step: HOWTO_STEPS.map((step, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: step.name,
    text: step.text,
  })),
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
        {/* —— H1 + 副标题 —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Change Background to White
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Swap any photo&apos;s background for pure white in seconds — a
              free white background maker with no signup, no watermark, and
              output up to 4096px on the long edge.
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

        {/* —— How to change the background to white —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change the background to white
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Three steps, and no editor to learn. White is pre-selected on
              this page, so once your photo is uploaded you are already looking
              at the result. Looking to do more than white? SwitchBG is a full{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                photo background changer
              </Link>{" "}
              for any colour, image or transparent finish.
            </p>
            {HOWTO_STEPS.map((step, i) => (
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

        {/* —— A white background for the photos that get checked —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              A white background for the photos that get checked
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Some photos are not just for looking at — they have to pass a
              check. Marketplace listing images, ID photos and catalogue shots
              are all judged on their background, and &quot;almost white&quot;
              is the one thing that gets them rejected. Instead of booking a
              studio or fighting a selection tool, cut the subject out and
              place it on pure white: one upload, one download.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Marketplace listings</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Amazon asks for main images on a pure white background (RGB 255,
              255, 255), and Shopify and Etsy storefronts simply look cleaner
              with one. A consistent white backdrop also makes a grid of
              products look deliberate rather than assembled from scattered
              photos.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              ID, visa and passport photos
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Most countries want a plain light or white background for ID
              photos. Start from a photo with even lighting and a clear
              separation between the subject and whatever is behind them — the
              cutout can only work with the edge it is given.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Résumés, catalogues and print
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A white background is the safest choice when the image is going
              to sit on a page next to text. Export portrait cutouts on white
              for a résumé or a team page, and keep the whole set consistent.
              Need the reverse — a scene behind a transparent subject? Our
              guide to{" "}
              {/* TODO: /add-background/ 建成后换回该最终地址 */}
              <Link
                href="/#how"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                adding a background to a photo
              </Link>{" "}
              covers it.
            </p>
          </div>
        </section>

        {/* —— Why "white" is not always white —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why &quot;white&quot; is not always white
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Plenty of tools export a background that is slightly grey or
              slightly cream, and a marketplace check is usually the first
              thing to notice. This page exports true white at RGB 255, 255,
              255. If you want to verify it yourself, open the downloaded file,
              sample a pixel in the empty area, and check that all three
              channels read 255.
            </p>
          </div>
        </section>

        {/* —— White backgrounds by subject —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              White backgrounds by subject
            </h2>
            <h3 className="mt-8 text-lg font-semibold">Products</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Small items are where white earns its keep. A piece of jewellery
              or a cosmetics bottle on white reads as a catalogue shot; the
              same item on a kitchen table reads as a snapshot.
            </p>
            <h3 className="mt-8 text-lg font-semibold">People</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A headshot on white works for résumés, team pages and LinkedIn.
              Choose a photo where the subject&apos;s clothing differs in tone
              from the background you are replacing.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Pets and resale items
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Selling something second-hand? A white backdrop makes a phone
              photo look like a listing rather than a camera roll.
            </p>
          </div>
        </section>

        {/* —— Getting a clean white edge —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Getting a clean white edge
            </h2>
            <h3 className="mt-8 text-lg font-semibold">
              Shoot against contrast
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A dark jacket against a light wall separates cleanly. A white
              shirt on a white wall does not, and no background changer can
              invent an edge that is not in the photo.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Use even light</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Bright, even light keeps the outline crisp. Harsh shadows and
              backlighting make the edge ambiguous.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Leave a little room</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Keep the full head and shoulders in frame. Cropping too tightly
              removes the edge the tool needs.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Doing the general version — any background, not just white? The
              full walkthrough covers{" "}
              {/* TODO: 教程页建成后 → /guide/how-to-change-background/ */}
              <Link
                href="/#how"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                how to change the background of a photo
              </Link>{" "}
              step by step.
            </p>
          </div>
        </section>

        {/* —— Why SwitchBG —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why SwitchBG
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Upload a photo, switch the background to white, and download —
              the whole job happens on one page.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                ["Free and unlimited", "no credits, no daily cap, no waiting for tomorrow's allowance."],
                ["White already selected", "this page opens ready for white; no extra clicks."],
                ["No signup, no email", "there is no account to create or verify."],
                ["No watermark, HD output", "up to 4096px on the long edge."],
                ["Your images stay yours", "the photo is processed on your device, and we do not use it for anything else."],
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
                    — {rest}
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
              FAQ
            </h2>
            <div className="mt-8 space-y-8">
              {WHITE_FAQS.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                    {q.startsWith("What should I use") && (
                      <>
                        {" "}
                        {/* TODO: 汇总页建成后 → /alternatives/remove-bg-alternative/ */}
                        <Link
                          href="/"
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          remove.bg alternative
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

        {/* —— 收尾 CTA —— */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to change a background to white?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Upload a photo, keep white selected, and download. It takes a few
              seconds, costs nothing, and the file is yours at up to 4096px on
              the long edge.
            </p>
            <Link
              href="/change-background-to-white/#tool"
              className="mt-8 inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
            >
              Change a background to white
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
