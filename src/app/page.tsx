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

/** #how 第二步专用:比 CHECKER_STYLE 更明显的方格底,突出"背景已透明" */
const HOW_CHECKER_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--border)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--border)) 75%)",
  backgroundColor: "#ffffff",
  backgroundSize: "28px 28px",
  backgroundPosition: "0 0, 0 14px, 14px -14px, -14px 0px",
};

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
    detail:
      "Drag an image onto the page, paste it from your clipboard, or click to browse your device. JPG, PNG and WebP all work, and you can upload several photos at once. The image is processed on your device, so your photo never has to leave it.",
    visual: "/samples/car6-before.jpg",
    alt: "Original car photo",
    checker: false,
  },
  {
    icon: Palette,
    label: "Choose the new background",
    detail:
      "Choose a solid color, browse the background library, or upload your own. SwitchBG cuts out the subject first, so anything you place behind it sits correctly — no manual masking, no layer juggling. If you want to keep the background empty, export as a transparent PNG instead.",
    visual: "/samples/car6-after.webp",
    alt: "Car cut out from its background",
    checker: true,
  },
  {
    icon: Download,
    label: "Check and download",
    detail:
      "Compare the original and the result side by side, zoom in to inspect the edges, then download at up to 4096px on the long edge. There is no watermark and no queue — switch backgrounds and export as many times as you like.",
    visual: "/samples/car6-step3.jpg",
    alt: "Car composited onto a new background, ready to download",
    checker: false,
  },
];

const USE_CASES = [
  {
    image: "/samples/portrait.jpg",
    alt: "Portrait photo suitable for a clean profile image",
    title: "Profile photos",
    description:
      "Swapping a busy room for a plain wall or a soft gradient instantly makes a profile photo look deliberate. Try a light neutral for LinkedIn, or a warm tone for social profiles.",
  },
  {
    image: "/samples/pet-studio.jpg",
    alt: "Pet photo suitable for a sticker or keepsake",
    title: "Pets and keepsakes",
    description:
      "Cut a pet out of a cluttered living room and place it against grass, a woven blanket, or a clean white backdrop. The same trick works for keepsakes you want to list or share — isolate the object and give it a background that makes it the subject.",
  },
  {
    image: "/samples/product.jpg",
    alt: "Everyday object isolated for a creative project",
    title: "Creative projects",
    description:
      "Use the transparent export to drop a cutout into a poster, a slide deck, or a shop banner. Place it over any color you like without hitting the white box that comes with a normal photo.",
  },
];

const PHOTO_TIPS = [
  {
    icon: Contrast,
    title: "Create clear separation",
    description:
      "The cutout engine looks for contrast between subject and background. A person in a light shirt against a dark wall is easy; a beige jumper on a beige sofa is hard. If you can, shoot against a background that differs in tone from your subject.",
  },
  {
    icon: Sun,
    title: "Use even lighting",
    description:
      "Bright, even light keeps the edge between subject and background crisp. Backlit photos and harsh shadows make that edge ambiguous, and the result is a softer outline. Natural daylight from a window, or a phone flash bounced off a wall, is plenty.",
  },
  {
    icon: Focus,
    title: "Keep the subject in frame",
    description:
      "Leave a little space around the subject — a few centimetres of shoulder, the top of the shoulders and the full head. Trimming too tightly means there is no edge for the tool to work with, and you lose room to reframe later.",
  },
];

/** 首页内页入口卡片:目标页 3 个在建(/change-background/、/add-background/、
 *  /alternatives/),上线前这三张卡会 404,建一个自动生效一个 */
const TOOL_CARDS = [
  {
    href: "/change-background/",
    h3: "Change any background",
    desc: "Swap the background of a photo for a colour, a library image, or a transparent PNG.",
    anchor: "change the background of a photo",
    before: "/samples/car6-before.jpg",
    after: "/samples/car6-after.webp",
    beforeChecker: false,
    afterChecker: true,
  },
  {
    href: "/add-background/",
    h3: "Add a background",
    desc: "Starting from a cutout or a transparent PNG? Drop in a backdrop and finish the shot.",
    anchor: "add a background to a photo",
    before: "/samples/car6-after.webp",
    after: "/samples/car6-step3.jpg",
    beforeChecker: true,
    afterChecker: false,
  },
  {
    href: "/change-background-to-white/",
    h3: "Change a background to white",
    desc: "Pure white, ready for marketplace listings, ID photos and catalogue shots.",
    anchor: "change a background to white",
    before: "/samples/product.jpg",
    after: "/samples/product-white.webp",
    beforeChecker: false,
    afterChecker: false,
  },
  {
    href: "/alternatives/remove-bg-alternative/",
    h3: "Coming from remove.bg?",
    desc: "What to expect now that the site is closing, and how to move your workflow over.",
    anchor: "remove.bg alternatives",
    before: "/samples/portrait.jpg",
    after: "/samples/portrait-cutout.webp",
    beforeChecker: false,
    afterChecker: true,
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
              A free photo background replacer: upload a photo, swap its
              background for a color, an image or a transparent PNG, and
              download in seconds.
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

        {/* —— 背景选择说明(②) —— */}
        <section id="backgrounds" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Pick a background
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              You are not limited to a fixed set of presets. Pick a solid color
              for a clean product shot, choose one of the background images in
              our library, or upload a background of your own — a studio
              backdrop, a desk, a garden. SwitchBG keeps the subject on its own
              layer, so swapping the background out again takes one click and
              never touches the edges of your photo.
            </p>
          </div>
        </section>

        {/* —— 效果展示:分类示例 + 前后对比滑块 —— */}
        <QualityShowcase />

        {/* —— 使用说明:参考 remove.bg「Just picture it」,三步各配一张过程图(文案逐字) —— */}
        <section id="how" className="scroll-mt-20 border-y border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                From photo to finished image in three steps
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                No layers, masks or editing skills. SwitchBG guides you from the
                first upload to a result you can use.
              </p>
            </div>
            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
              {HOW_STEPS.map((step, i) => (
                <li key={step.label} className="text-center">
                  <figure
                    className="relative aspect-[24/25] overflow-hidden rounded-xl border border-border bg-secondary shadow-sm"
                    style={step.checker ? HOW_CHECKER_STYLE : undefined}
                  >
                    <Image
                      src={step.visual}
                      alt={step.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                      {`0${i + 1}`}
                    </span>
                  </figure>
                  <h3 className="mt-5 inline-flex items-center gap-2 text-lg font-semibold">
                    <step.icon className="size-4.5 text-primary" strokeWidth={1.75} aria-hidden />
                    {step.label}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-12 text-center">
              <Link
                href="/#tool"
                className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Upload className="size-4" aria-hidden />
                Choose a photo
              </Link>
            </div>
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
            <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-muted-foreground">
              Plenty of tools remove a background. Fewer let you put a new one
              in without signing up, paying, or installing anything. SwitchBG
              is built for the whole job:
            </p>
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

        {/* —— 工作方式(⑧新增章节) —— */}
        <section id="workflow" className="scroll-mt-20 bg-secondary/60 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              A photo background replacer built for the way you actually work
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Most background replacers make you choose a preset and hope for
              the best. SwitchBG cuts the subject out first, so you can drop in
              any background — a color swatch, one of our library images, or a
              file from your own device — and see the result on your photo
              before you download. No layers, no masks, no editing timeline. If
              you are replacing the background on a product shot for a
              marketplace, or swapping a backdrop for a client, you get the
              finished file without opening a photo editor.
            </p>
          </div>
        </section>

        {/* —— 内页入口卡片:四张卡=before/after 缩略图+H3+一句话+锚文本 —— */}
        <section id="ways" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                More ways to change a background
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Same tool, different starting point — pick the job that matches
                your photo.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TOOL_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group block rounded-xl border border-border bg-card p-4 transition-shadow duration-150 hover:shadow-md"
                >
                  <div className="flex gap-1.5" aria-hidden>
                    <span
                      className={`relative h-24 w-1/2 overflow-hidden rounded-md border border-border ${card.beforeChecker ? "" : "bg-secondary"}`}
                      style={card.beforeChecker ? CHECKER_STYLE : undefined}
                    >
                      <Image
                        src={card.before}
                        alt=""
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    </span>
                    <span
                      className={`relative h-24 w-1/2 overflow-hidden rounded-md border border-border ${card.afterChecker ? "" : "bg-secondary"}`}
                      style={card.afterChecker ? CHECKER_STYLE : undefined}
                    >
                      <Image
                        src={card.after}
                        alt=""
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold">{card.h3}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {card.anchor}
                    <MoveRight
                      className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              ))}
            </div>
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
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Whether you need one clean product photo, a batch of profile
                pictures, or a cutout for a design of your own, the whole job
                happens on one page. Upload an image, choose the background you
                want, and download it — no account, no watermark, no wait.
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
