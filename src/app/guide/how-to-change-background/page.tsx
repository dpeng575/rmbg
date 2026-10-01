import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "How to Change the Background of a Photo – Step-by-Step Guide | SwitchBG",
  description:
    "How to change the background of a photo, step by step: online in your browser, on your phone, or in Photoshop. Free methods, clean edges, and the sizes that matter.",
  alternates: { canonical: "/guide/how-to-change-background" },
};

/** 本页专属 12 条 FAQ(页面可见文本与 FAQPage JSON-LD 同源) */
const GUIDE_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I change the background of a photo for free?",
    a: "Upload the photo, let the subject be separated from the original background, choose a new one, and download. That's free here, with no watermark and no account — start with a photo.",
  },
  {
    q: "What's the easiest way to change a photo background?",
    a: "An automatic cutout in a browser. There's no selection to draw, nothing to install, and no software to learn.",
  },
  {
    q: "Can I change the background of a photo without Photoshop?",
    a: "Yes — separation and refilling both run in a browser now. You only need an editor when the cutout itself needs manual work, like rescuing flyaway hair.",
  },
  {
    q: "How do I change the background of a photo on my iPhone or Android?",
    a: "Open the site in your phone's browser, upload from your camera roll, and save the result. No app required.",
  },
  {
    q: "How do I change the background of a picture to white?",
    a: "Separate the subject, choose white as a flat colour, then set the crop and size. The white background guide covers the spec details and the white-product trap.",
  },
  {
    q: "Can I change the background to a photo instead of a colour?",
    a: "Yes. Any image can be placed behind the subject, then scaled and positioned so it reads as a real backdrop rather than a flat poster.",
  },
  {
    q: "What's the difference between a transparent background and a white one?",
    a: "Transparent means nothing is there — an alpha channel, ready to sit on any page later. White means a solid fill is there. Both start from the same cutout.",
  },
  {
    q: "Why does my cutout have a halo?",
    a: "A rim of the original background survived along the edge. It's most visible against white. Fix the cutout rather than the fill.",
  },
  {
    q: "Should I use a white background for product photos?",
    a: "For the main image on most marketplaces, yes. Use a very light grey if the product is white or pale, so it doesn't lose its outline.",
  },
  {
    q: "Can I change the background of several photos at once?",
    a: "Yes. Drop in a folder and the same background is applied across the set, ready to download one by one.",
  },
  {
    q: "Do I need a design skill to do this?",
    a: "No. The judgement calls are which background, what crop and what size — the technical part is automatic.",
  },
  {
    q: "Does changing the background lower the photo's quality?",
    a: "It shouldn't. What you download matches the resolution you uploaded — photos up to 4096px on the long edge — as long as the tool isn't handing you a preview tier.",
  },
];

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG — Photo Background Changer",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Change the background of any photo in your browser — colour, image or transparent. Free, no signup, no watermark.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const HOWTO_STEPS = [
  {
    name: "Start with a photo that will cooperate",
    text: "You can rescue almost anything, but some photos cost you ten seconds and others cost you twenty minutes. Light the subject and the background separately if you can, keep the subject from touching the frame, and avoid a busy background directly behind the subject — all three happen before the edit.",
  },
  {
    name: "Separate the subject from the background",
    text: "Modern segmentation models identify a person, a product, a pet or a car and lift it away from the background on their own. You upload, the subject comes out, and you don't draw anything. A manual mask stays necessary only when the automatic result misses something specific.",
  },
  {
    name: "Choose what goes behind the subject",
    text: "A flat colour, a gradient, an image of your own, or nothing — transparency. White is the one colour with rules attached: marketplaces want pure white, and a white or pale product reads better on a very light grey.",
  },
  {
    name: "Match the frame and the output size",
    text: "Centre the subject with even space on all sides, use the size the destination asks for, and keep the subject a similar size across a set so the results look like one shop instead of a collection.",
  },
  {
    name: "Check the edge before you download",
    text: "Four things, thirty seconds: the outline at 200%, hair and fur, colour bleed from a strong original background, and the size and format of the export.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to change the background of a photo",
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
  mainEntity: GUIDE_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const DECISION_ROWS: {
  want: string;
  how: string;
  whereLabel: string;
  whereHref: string;
}[] = [
  {
    want: "A different colour, gradient or photo behind your subject",
    how: "Lift the subject out, then fill what's behind it",
    whereLabel: "Change the background",
    whereHref: "/change-background",
  },
  {
    want: "A plain white photo for a listing, form or ID",
    how: "Lift the subject out, fill with white",
    whereLabel: "Change a background to white",
    whereHref: "/change-background-to-white",
  },
  {
    want: "A cutout or transparent PNG placed on a new backdrop",
    how: "Only place the cutout — it's already separated",
    whereLabel: "Add a background to a photo",
    whereHref: "/add-background",
  },
  {
    want: "A PNG with nothing behind it, for design work",
    how: "Remove the background and stop there",
    whereLabel: "The tool on our home page",
    whereHref: "/",
  },
];

export default function HowToChangeBackground() {
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
        {/* —— H1 + 首屏 —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              How to Change the Background of a Photo
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Changing a background is really two jobs: separating the subject
              from whatever was behind it, then deciding what sits there
              instead. You can do both in a browser in under a minute, on a
              phone, or by hand in Photoshop — this guide covers all three, and
              tells you which one the photo in front of you actually needs.
            </p>
          </div>
        </section>

        {/* —— 紧凑工具带 —— */}
        <section className="scroll-mt-20 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-5 shadow-sm sm:flex-row">
              <p className="text-sm font-medium text-foreground">
                Try it on your own photo
              </p>
              <Link
                href="/change-background/#tool"
                className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              >
                Upload a photo
              </Link>
            </div>
          </div>
        </section>

        {/* —— Two ways: pick the right one first —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Two ways to change a background — pick the right one first
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most people searching for this already know the end result they
              want. What&apos;s usually unclear is which job that maps to.
              Here&apos;s the short version:
            </p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">What you want</th>
                    <th className="px-4 py-3 font-semibold">
                      What actually has to happen
                    </th>
                    <th className="px-4 py-3 font-semibold">Where to do it</th>
                  </tr>
                </thead>
                <tbody>
                  {DECISION_ROWS.map((row) => (
                    <tr key={row.want} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 text-muted-foreground">{row.want}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.how}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={row.whereHref}
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          {row.whereLabel}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              If you&apos;re not sure which one you&apos;re in:{" "}
              <strong className="font-semibold text-foreground">
                if the photo still has its original background, you need the
                first row. If the subject has already been cut out, you need
                the third.
              </strong>
            </p>
          </div>
        </section>

        {/* —— Step 1 —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Step 1: Start with a photo that will cooperate
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You can rescue almost anything, but some photos cost you ten
              seconds and others cost you twenty minutes. Three things make the
              difference, and all three happen before the edit.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                [
                  "Light the subject and the background separately if you can.",
                  "When both are lit evenly, the outline between them is unambiguous, and every method below produces a cleaner edge.",
                ],
                [
                  "Keep the subject from touching the frame.",
                  "A head that overlaps the top of the image has a boundary the software has to guess at. Leave some space around the subject.",
                ],
                [
                  "Avoid a busy background directly behind the subject.",
                  "A bookshelf or a patterned wall sits right where the edge needs to be detected. Step the subject away from the wall, or shoot from a different angle.",
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
            <p className="mt-6 leading-relaxed text-muted-foreground">
              If the photo is already taken and it&apos;s not ideal, don&apos;t
              reshoot yet — run it through and check the edge at full size.
              Most problems only show up when you zoom in.
            </p>
          </div>
        </section>

        {/* —— Step 2 —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Step 2: Separate the subject from the background
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This is the part that used to take the longest, and it&apos;s the
              part that&apos;s changed most.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Automatic (seconds).
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Modern segmentation models identify a person, a product, a pet or
              a car and lift it away from the background on their own. You
              upload, the subject comes out, and you don&apos;t draw anything.
              It handles the easy 90% — plain backgrounds, clear subjects,
              decent light.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Manual (minutes to much longer).
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A pen tool or a hand-painted mask, usually in an editor like
              Photoshop or Photopea. Necessary when the automatic result misses
              something specific: a product with a transparent element, a
              subject with fine detail against a similarly coloured background,
              or an architectural shot where &quot;the subject&quot; isn&apos;t
              a single object at all.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              What to check either way:
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              zoom to roughly 200% and look at the outline — around the hair,
              along a shoulder, where the subject meets the background at a
              shallow angle. That&apos;s where mistakes live, and they&apos;re
              invisible at thumbnail size.
            </p>
          </div>
        </section>

        {/* —— Step 3 —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Step 3: Choose what goes behind the subject
            </h2>
            <h3 className="mt-8 text-lg font-semibold">A flat colour.</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The most common choice, and the one with the strictest specs.
              Marketplaces typically want pure white; brand work often wants an
              exact colour match.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              White, specifically.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Worth its own note, because it&apos;s the one colour with rules
              attached. If the product itself is white or pale, pure white
              (#FFFFFF) swallows its outline — drop to a very light grey so the
              item keeps a visible edge. We cover the spec side of this in the{" "}
              <Link
                href="/change-background-to-white"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                white background guide
              </Link>
              .
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              A gradient or a second photo.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Useful for lifestyle and social images, where a completely flat
              backdrop can look like a pasted cutout. Scale the backdrop so it
              sits behind the subject at a believable angle rather than sitting
              flat like wallpaper.
            </p>
            <h3 className="mt-8 text-lg font-semibold">
              Nothing — transparent.
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Leave the alpha channel empty and the cutout drops onto any page
              or design later. This is the right answer if you don&apos;t yet
              know where the image is going.
            </p>
          </div>
        </section>

        {/* —— Step 4 —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Step 4: Match the frame and the output size
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A background change is also a reframing, and this is where most
              amateur results give themselves away.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                [
                  "Centre the subject with even space on all sides.",
                  "Off-centre cutouts get clipped when a platform re-crops them — and every platform re-crops them.",
                ],
                [
                  "Use the size the destination asks for.",
                  "A square for most marketplace grids, 4:5 for a feed post, 3:2 for print, a specific pixel count for a form or an application.",
                ],
                [
                  "Keep the subject a similar size across a set.",
                  "If you're doing a folder of products, one framing rule applied to all of them is what makes a category page look like a shop instead of a collection.",
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

        {/* —— Step 5 —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Step 5: Check the edge before you download
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Four things, thirty seconds, and they catch nearly every
              failure:
            </p>
            <ol className="mt-6 space-y-4">
              {[
                [
                  "The outline at 200%.",
                  "A faint pale halo along the edge is the single most common leftover, and it's most visible against white.",
                ],
                [
                  "Hair and fur.",
                  "Flyaway strands that were missed read as grey wisps against a bright backdrop.",
                ],
                [
                  "Colour bleed.",
                  "When a subject was shot against a strong colour — saturated green, deep red — a thin fringe of it can survive on the edge. It's a cutout problem, not a fill problem.",
                ],
                [
                  "The size and format.",
                  "Confirm you're exporting at the dimensions you set, and in a format the destination accepts.",
                ],
              ].map(([lead, rest], i) => (
                <li key={lead} className="flex items-start gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {lead}
                    </strong>{" "}
                    {rest}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* —— On your phone —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change the background of a photo on your phone
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Same five steps, and it works in a mobile browser — no app to
              install, and the finished file saves straight to your camera
              roll. The only real differences: it&apos;s harder to judge an
              edge on a small screen, so pinch in before you accept the
              result, and it&apos;s worth exporting to your files rather than
              straight to a social app, so you keep the full-quality version.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Phone-native editors will do this too. They&apos;re convenient
              for one photo; they&apos;re slow for forty, and they tend to
              keep the result inside their own app.
            </p>
          </div>
        </section>

        {/* —— In Photoshop —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change a background in Photoshop
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Photoshop is the right tool when the cutout needs judgement, and
              the wrong one when you have a deadline and forty photos.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The manual route is <strong className="text-foreground">Select Subject</strong> or
              the <strong className="text-foreground">Pen tool</strong> to build a path,{" "}
              <strong className="text-foreground">Select and Mask</strong> to refine the
              edge (the Refine Edge Brush does the hair), then a layer mask,
              then a solid colour or image layer behind it. For a product with
              clean edges, the Pen tool is precise and slow. For hair, Select
              Subject plus refinement is faster and usually good enough.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Two things to know before you start. The{" "}
              <strong className="text-foreground">Remove Background</strong>{" "}
              quick action exists but gives you less control than a mask, so
              you can&apos;t come back and fix the hair later. And Photoshop
              runs on your machine — your photos aren&apos;t processed by an
              online service, which matters for client work and anything under
              an NDA. The browser route has the same property, minus the
              install and the learning curve.
            </p>
          </div>
        </section>

        {/* —— Common problems —— */}
        <section className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Common problems, and what actually fixes them
            </h2>
            {[
              [
                "The cutout looks like a sticker.",
                "Usually the outline is too hard. Real edges have a pixel or two of softness, and hair has many more. A hard mask against a flat colour reads as cut-and-paste.",
              ],
              [
                "There's a white halo around the subject.",
                "The cutout kept a rim of the old background. Fix the mask, not the fill — pulling the edge in by a fraction of a pixel usually removes it entirely.",
              ],
              [
                "Part of the subject disappeared.",
                "Usually low contrast between subject and background at that point — a dark jacket against a dark wall. Add the missing area back with a brush on the mask.",
              ],
              [
                "The product vanishes into the white.",
                "The product is white. Use a very light grey instead of pure white.",
              ],
              [
                "The image got smaller when I exported.",
                "Some free tools hand you a downsized preview rather than the file you uploaded. Check the output dimensions; if they don't match your original, that's what happened.",
              ],
              [
                "The background is transparent when I wanted white.",
                "You removed the background but never filled one in. That's not a bug — a white background and a transparent one are two different results. Add the white, or leave it transparent on purpose.",
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

        {/* —— When the job isn't one photo —— */}
        <section className="scroll-mt-20 border-y border-border bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              When the job isn&apos;t one photo
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you&apos;re processing a catalogue, a batch of listings or a
              folder of ID photos, the important part isn&apos;t any single
              cutout — it&apos;s that they all match. The same background
              colour applied to every file in one go. A category page assembled
              from individually edited photos drifts, and the drift is what
              looks unprofessional, even when every individual image is
              technically fine.
            </p>
          </div>
        </section>

        {/* —— FAQ —— */}
        <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions about changing a photo&apos;s background
            </h2>
            <div className="mt-8 space-y-8">
              {GUIDE_FAQS.map(({ q, a }, i) => (
                <div key={q}>
                  <h3 className="font-semibold">{q}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                    {i === 0 && (
                      <>
                        {" "}
                        <Link
                          href="/change-background"
                          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Start with a photo
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
                  h3: "Change a photo's background",
                  desc: "Any colour, gradient or image.",
                },
                {
                  href: "/change-background-to-white",
                  h3: "Change a background to white",
                  desc: "Pure white or off-white, with the spec rules.",
                },
                {
                  href: "/add-background",
                  h3: "Add a background to a photo",
                  desc: "Starting from a cutout or transparent PNG.",
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
