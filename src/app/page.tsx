import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Contrast,
  Download,
  Focus,
  Infinity as InfinityIcon,
  Lock,
  LogIn,
  MoveRight,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { CHECKER_STYLE, QualityShowcase } from "@/components/site/QualityShowcase";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FAQS, WHY_BULLETS } from "@/content/seo";

const WHY_ICONS = [InfinityIcon, LogIn, BadgeCheck, ShieldCheck];

/** Hero 特性 pill:文案与原「Free · No signup · ...」逐字对应,只是加视觉容器 */
const HERO_FEATURES = [
  { icon: Sparkles, label: "Free" },
  { icon: Lock, label: "No signup" },
  { icon: Check, label: "No watermark" },
  { icon: ShieldCheck, label: "Your image is processed in your browser" },
];
const HOW_STEPS = [
  {
    icon: Upload,
    label: "Upload a photo",
    detail: "Choose a JPG, PNG or WebP from your device, or try one of the sample photos.",
  },
  {
    icon: Palette,
    label: "Choose the new background",
    detail: "Keep it transparent, pick a color or image, or upload a background of your own.",
  },
  {
    icon: Download,
    label: "Check and download",
    detail: "Compare the original and result, then download a clean image with no watermark.",
  },
];

const USE_CASES = [
  {
    image: "/samples/portrait.jpg",
    alt: "Portrait photo suitable for a clean profile image",
    title: "Profile photos",
    description:
      "Replace a distracting background with a calm color or a setting that suits your profile.",
  },
  {
    image: "/samples/pet-studio.jpg",
    alt: "Pet photo suitable for a sticker or keepsake",
    title: "Pets and keepsakes",
    description:
      "Isolate a pet or person for a sticker, greeting card, wallpaper or family collage.",
  },
  {
    image: "/samples/product.jpg",
    alt: "Everyday object isolated for a creative project",
    title: "Creative projects",
    description:
      "Lift an object from a photo for a school project, mood board or personal design.",
  },
];

const PHOTO_TIPS = [
  {
    icon: Contrast,
    title: "Create clear separation",
    description: "A subject that contrasts with the background is easier to identify cleanly.",
  },
  {
    icon: Sun,
    title: "Use even lighting",
    description: "Good light preserves hair, fur and small edge details without heavy shadows.",
  },
  {
    icon: Focus,
    title: "Keep the subject in frame",
    description: "Use a sharp image where the full subject is visible and not covered by other objects.",
  },
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
    "HD output up to 4096px on the long edge",
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
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,hsl(221_83%_53%/0.10),transparent)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 text-center sm:px-6 sm:pt-18">
            <h1 className="animate-rise text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Photo Background Changer
            </h1>
            <p
              className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "80ms" }}
            >
              Upload a photo, remove its old background, and make it yours with
              a color, image or transparent finish.
            </p>

            {/* 特性 pill:把原来一行裸文本的信任点做成可扫读的徽章 */}
            <ul
              className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
              style={{ animationDelay: "160ms" }}
            >
              {HERO_FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm"
                >
                  <Icon className="size-3.5 text-emerald-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            {/* Before / After 迷你视觉:参考 bgclear,首屏直接给出效果预期。
                素材 720×750,按原始比例完整显示,不裁切 */}
            <div
              className="animate-rise mt-10 flex items-center justify-center gap-3 sm:gap-5"
              style={{ animationDelay: "240ms" }}
            >
              <figure className="relative aspect-[24/25] w-32 overflow-hidden rounded-xl border border-border bg-secondary shadow-sm sm:w-44">
                <Image
                  src="/samples/car6-before.jpg"
                  alt="Original car photo"
                  fill
                  sizes="176px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-foreground/70 px-2 py-0.5 text-[10px] font-semibold text-background backdrop-blur-sm">
                  Before
                </figcaption>
              </figure>
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-10"
                aria-hidden
              >
                <MoveRight className="size-4 sm:size-5" />
              </span>
              <figure
                className="relative aspect-[24/25] w-32 overflow-hidden rounded-xl border border-border shadow-sm sm:w-44"
                style={CHECKER_STYLE}
              >
                <Image
                  src="/samples/car6-after.webp"
                  alt="Car with its background removed"
                  fill
                  sizes="176px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
                  After
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* —— 工具区(唯一的客户端岛) —— */}
        <BackgroundStudio />

        {/* —— 效果展示:分类示例 + 前后对比滑块 —— */}
        <QualityShowcase />

        {/* —— 正文区块(服务端渲染,文案逐字) —— */}
        <section id="how" className="scroll-mt-20 border-y border-border py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div>
              <h2 className="max-w-md text-2xl font-bold tracking-tight sm:text-3xl">
                From photo to finished image in three steps
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                No layers, masks or editing skills. SwitchBG guides you from the
                first upload to a result you can use.
              </p>
              <Link
                href="/#tool"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                <Upload className="size-4" aria-hidden />
                Choose a photo
              </Link>
            </div>
            <ol className="divide-y divide-border border-y border-border">
              {HOW_STEPS.map((step, i) => (
                <li key={step.label} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:grid-cols-[2.5rem_2.5rem_1fr] sm:items-start">
                  <span className="pt-2 font-mono text-xs text-muted-foreground" aria-hidden>
                    0{i + 1}
                  </span>
                  <span className="hidden size-10 items-center justify-center rounded-[8px] bg-secondary text-primary sm:flex">
                    <step.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="ideas" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                A fresh background for everyday photos
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Start with a clear subject, then choose a background that fits
                what you want to make. SwitchBG is currently for personal,
                non-commercial use.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {USE_CASES.map((useCase) => (
                <article key={useCase.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-secondary">
                    <Image
                      src={useCase.image}
                      alt={useCase.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{useCase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tips" className="scroll-mt-20 bg-secondary/60 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Start with the right photo
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                  Better source photos produce cleaner edges. These simple checks
                  help before you upload.
                </p>
              </div>
              <ul className="grid gap-px overflow-hidden rounded-[8px] border border-border bg-border md:grid-cols-3">
                {PHOTO_TIPS.map((tip) => (
                  <li key={tip.title} className="bg-background p-6">
                    <tip.icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden />
                    <h3 className="mt-5 font-semibold">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tip.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="why" className="scroll-mt-20 py-16 sm:py-20">
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

        <section className="border-t border-border py-14">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Ready to change a background?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a photo and see the result in your browser.
              </p>
            </div>
            <Link
              href="/#tool"
              className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm"
            >
              <Upload className="size-4" aria-hidden />
              Choose a photo
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
