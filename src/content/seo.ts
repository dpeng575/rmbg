/**
 * 核心工具页的 SEO 文案 —— 逐字来自需求(TDK/H1/正文/FAQ 问题),
 * 不改写;FAQ 答案为配套撰写(与页面可见文本一致,供 FAQPage 结构化数据复用)。
 */

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Is SwitchBG a free photo background changer?",
    a: "Yes. SwitchBG is completely free with no signup, no watermark, and no daily limits. You can change the background of as many photos as you like.",
  },
  {
    q: "How do I change the background of a photo online?",
    a: "Upload your photo, wait a few seconds while the AI cuts out the subject, pick a new background from the library, and download the result. Everything runs in your browser — nothing to install.",
  },
  {
    q: "Can I use SwitchBG as a photo background replacer for product photos?",
    a: "Yes. SwitchBG works well for product photos destined for Amazon, Shopify or Etsy, and exports at your image's original resolution.",
  },
  {
    q: "Is there a change bg photo tool that works on mobile?",
    a: "Yes. SwitchBG runs in any modern mobile browser on iOS and Android, so you can change photo backgrounds without installing an app.",
  },
  {
    q: "Can I change bg for free without a watermark?",
    a: "Yes. SwitchBG never adds watermarks. Your download is a clean, full-resolution image, completely free.",
  },
  {
    q: "Do I need an app to change background photo?",
    a: "No. SwitchBG is a web-based tool that runs entirely in your browser — on desktop and mobile alike.",
  },
  {
    q: "What should I use if I need a remove.bg replacement?",
    a: "SwitchBG is a free alternative for changing or removing photo backgrounds: unlimited use, no signup, and no watermark, with everything processed privately in your own browser.",
  },
];

/** H2④ Why SwitchBG 的四条原文,逐字渲染 */
export const WHY_BULLETS: string[] = [
  "Free and unlimited — no credits, no daily cap",
  "No signup, no email — just upload and go",
  "No watermark, HD output — your image keeps its original resolution",
  "Your images stay yours — we don't use them for anything else",
];
