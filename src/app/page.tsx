import {
  BadgeCheck,
  Download,
  Infinity as InfinityIcon,
  LogIn,
  Palette,
  ShieldCheck,
  Upload,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FAQS, WHY_BULLETS } from "@/content/seo";

const WHY_ICONS = [InfinityIcon, LogIn, BadgeCheck, ShieldCheck];
const HOW_STEPS = [
  { icon: Upload, label: "Upload your image" },
  { icon: Palette, label: "Pick a new background from our library" },
  { icon: Download, label: "Download the result" },
];

/** 结构化数据:SoftwareApplication + FAQPage(答案与页面可见文本逐字一致) */
const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SwitchBG",
  applicationCategory: "ImageApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Change the background of any photo in seconds. Free, no signup, no watermark, HD quality.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Change photo backgrounds",
    "Transparent PNG export",
    "HD output at original resolution",
    "No signup",
    "No watermark",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        {/* —— Hero(服务端渲染) —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_50%_at_50%_-10%,hsl(221_83%_53%/0.08),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-20">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Photo Background Changer
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Replace the background of any photo in seconds — free, no signup,
              no watermark.
            </p>
            <div style={{ animationDelay: "160ms" }} className="animate-rise mt-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium">
                <span aria-hidden className="size-2 rounded-full bg-red-500" />
                For Free
              </span>
            </div>
          </div>
        </section>

        {/* —— 工具区(唯一的客户端岛) —— */}
        <BackgroundStudio />

        {/* —— 正文区块(服务端渲染,文案逐字) —— */}
        <section id="how" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to change the background of a photo
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Upload your image, pick a new background from our library, and
              download the result. It takes about 5 seconds — no editing skills
              needed.
            </p>
            <ol className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-3">
              {HOW_STEPS.map((step, i) => (
                <li key={step.label} className="flex flex-col items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <step.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono text-xs text-muted-foreground/70">
                      0{i + 1}
                    </span>
                    {step.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              A free photo background replacer for everyday edits
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you&apos;re updating a profile photo, making a family
              collage, or cleaning up a picture for a school project —
              SwitchBG handles it in one step. The current service is intended
              for personal, non-commercial use.
            </p>
          </div>
        </section>

        <section id="backgrounds" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Pick a background, or keep it transparent
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Choose from backgrounds for people, objects and vehicles — or
              export a transparent PNG if you want to add your own.
            </p>
          </div>
        </section>

        <section id="why" className="scroll-mt-20 bg-secondary/50 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Why SwitchBG
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {WHY_BULLETS.map((bullet, i) => {
                const Icon = WHY_ICONS[i] ?? BadgeCheck;
                return (
                  <li
                    key={bullet}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4.5" strokeWidth={1.75} />
                    </span>
                    <span className="pt-1.5 font-medium">{bullet}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* —— FAQ(h3 问题；答案同时写入上方 FAQPage JSON-LD) —— */}
        <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              FAQ
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {FAQS.map(({ q, a }, i) => (
                <AccordionItem key={q} value={`faq-${i}`}>
                  {/* Radix Accordion.Header 默认渲染 <h3>,问题文本即被 h3 包裹 */}
                  <AccordionTrigger className="text-sm sm:text-base">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
