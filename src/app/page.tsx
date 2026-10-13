import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  BadgeCheck,
  Check,
  Infinity as InfinityIcon,
  Lock,
  LogIn,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundStudio } from "@/components/tool/BackgroundStudio";
import { HashLink } from "@/components/site/HashLink";
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

/** 前后对照卡:两张图各占一半;图片缺失时渲染占位色块(素材后补) */
type UseCase = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
};

const USE_CASES: UseCase[] = [
  {
    title: "Product photos",
    description: "Clean product imagery for listings and catalogs.",
    href: "/change-background-to-white",
    linkLabel: "Change background to white",
    before: "/samples/scenes/product-before.jpg",
    beforeAlt: "Headphones on a yellow background before background removal",
    after: "/samples/scenes/product-after-headphones.jpg",
    afterAlt: "Same headphones on a white background after background removal",
  },
  {
    title: "Profile photos",
    description: "Make a polished headshot for work or social profiles.",
    href: "/change-background",
    linkLabel: "Change background",
    before: "/samples/scenes/profile-before.webp",
    beforeAlt: "Portrait photo against a distracting background before background removal",
    after: "/samples/scenes/profile-after.webp",
    afterAlt: "Same portrait on a clean backdrop after background removal",
  },
  {
    title: "Anime and illustrations",
    description: "Give illustrated subjects a new scene or transparent export.",
    href: "/add-background",
    linkLabel: "Add background",
    before: "/samples/scenes/anime-before.jpg",
    beforeAlt: "Anime-style illustration before background removal",
    after: "/samples/scenes/anime-after-scene.jpg",
    afterAlt: "Same illustration on a soft gradient background after background change",
  },
];

/** 服务端构建期检查 public 下素材是否存在,缺失时渲染占位色块(图片后补无需改码) */
function hasPublicAsset(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src));
}

/** use case 卡片内的一格图像;素材未就绪时输出占位色块 */
function UseCaseFigure({ src, alt }: { src: string; alt: string }) {
  if (!hasPublicAsset(src)) {
    return <div className="h-full w-full bg-secondary" aria-hidden />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="h-full w-full object-cover"
    />
  );
}

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
  mainEntity: FAQS.map(({ q, a, link }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: link ? `${a} ${link.label}${link.after ? ` ${link.after}` : ""}` : a,
    },
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
      <main className="flex-1 bg-secondary/50">
        {/* —— Hero(服务端渲染) —— */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_55%_45%_at_18%_0%,hsl(221_83%_53%/0.10),transparent),radial-gradient(ellipse_45%_40%_at_82%_8%,hsl(160_84%_39%/0.10),transparent),radial-gradient(ellipse_40%_32%_at_55%_28%,hsl(213_94%_80%/0.16),transparent)]"
          />
          {/* sm–lg 单列居中;lg 起「标题 + 上传框左 / 对比图右」两列。
              两张 288px 对比图 + 箭头约 650px,在 lg 以下放不进半栏 */}
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 text-center sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:text-left">
            <div className="min-w-0">
              <h1 className="animate-rise mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                Photo{" "}
                <span className="relative inline-block">
                  Background
                  <span aria-hidden className="absolute inset-x-[-2px] bottom-[6px] -z-10 h-[14px] rounded-[7px] bg-accent/20 sm:bottom-[8px] sm:h-[16px]" />
                </span>{" "}
                Changer
              </h1>
              <p
                className="animate-rise mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
                style={{ animationDelay: "80ms" }}
              >
                Free, automatic, no watermark. Upload a photo, swap its background for a color, an image or a transparent PNG, and download in seconds.
              </p>

              {/* 上传入口:整块点击跳到工具区 */}
              <HashLink
                href="/#tool"
                className="animate-rise group mx-auto mt-7 flex max-w-md flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-card px-6 py-5 shadow-sm transition-colors hover:border-primary/50 sm:flex-row sm:justify-center sm:gap-4 lg:mx-0 lg:justify-start"
                style={{ animationDelay: "140ms" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform group-hover:-translate-y-0.5"><Upload className="size-4" aria-hidden />Try it free</span>
                <span className="text-xs text-muted-foreground">JPG / PNG / WebP</span>
              </HashLink>
              <p className="mt-4 text-xs text-muted-foreground">Processed on your device — your photo is never uploaded</p>
              <p className="text-[10px] text-muted-foreground/80">First use downloads about 76 MB</p>

              {/* 特性 pill:把原来一行裸文本的信任点做成可扫读的徽章 */}
              <ul
                className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start"
                style={{ animationDelay: "160ms" }}
              >
                {HERO_FEATURES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm"
                  >
                    <Icon className={`size-3.5 text-primary`} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Before / After:素材 720×750,按原始比例完整显示,不裁切。
                窄屏下两图 flex-1 等比收缩,避免横向溢出 */}
            <div
              className="animate-rise flex items-center justify-center gap-3 sm:gap-5"
              style={{ animationDelay: "240ms" }}
            >
              <figure
                className="relative aspect-[24/25] min-w-0 max-w-48 flex-1 overflow-hidden rounded-xl border border-border shadow-sm sm:max-w-72 lg:w-56 lg:max-w-none lg:flex-none xl:w-72 bg-secondary"
              >
                <Image
                  src="/samples/people-before.jpg"
                  alt="Original couple photo"
                  fill
                  sizes="(min-width: 1280px) 288px, (min-width: 1024px) 224px, (min-width: 640px) 288px, 192px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-foreground/55 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/90 backdrop-blur-sm">
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
                className="relative aspect-[24/25] min-w-0 max-w-48 flex-1 overflow-hidden rounded-xl border border-border shadow-sm sm:max-w-72 lg:w-56 lg:max-w-none lg:flex-none xl:w-72" style={CHECKER_STYLE}
              >
                <Image
                  src="/samples/people-after.webp"
                  alt="Couple with the background removed"
                  fill
                  sizes="(min-width: 1280px) 288px, (min-width: 1024px) 224px, (min-width: 640px) 288px, 192px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur-sm">
                  After
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* —— 工具区(唯一的客户端岛) —— */}
        <BackgroundStudio />

        {/* —— 效果展示:三卡可拖动前后对比 —— */}
        <QualityShowcase />

        <section id="ideas" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                A fresh background for everyday photos
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Start with a clear subject, then choose a background that fits
                what you want to make.
              </p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((useCase) => (
                <div key={useCase.title} className="group overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden rounded-xl border border-border bg-secondary">
                    <div className="relative border-r border-border">
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">Before</span>
                      <UseCaseFigure src={useCase.before} alt={useCase.beforeAlt} />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">After</span>
                      <UseCaseFigure src={useCase.after} alt={useCase.afterAlt} />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold">{useCase.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {useCase.description}
                    </p>
                    <Link href={useCase.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {useCase.linkLabel}
                      <MoveRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="scroll-mt-20 bg-gradient-to-b from-background to-secondary/50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" strokeWidth={1.75} />
                    </span>
                    <span className="font-medium">{bullet}</span>
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
              {FAQS.map(({ q, a, link }, i) => (
                <AccordionItem key={q} value={`faq-${i}`}>
                  {/* Radix Accordion.Header 默认渲染 <h3>,问题文本即被 h3 包裹 */}
                  <AccordionTrigger className="text-sm sm:text-base">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {a}
                    {link && (
                      <>
                        {" "}
                        <Link
                          href={link.href}
                          className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                        >
                          {link.label}
                        </Link>
                        {link.after ? ` ${link.after}` : ""}
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent px-6 py-14 text-center sm:px-12">
              <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">Ready to change a background?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/90">
                Whether you need one clean product photo, a batch of profile
                pictures, or a cutout for a design of your own, the whole job
                happens on one page. Upload an image, choose the background you
                want, and download it — no account, no watermark, no wait.
              </p>
              <HashLink href="/#tool"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Upload className="size-4" aria-hidden />
                Choose a photo
              </HashLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
