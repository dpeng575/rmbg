/**
 * 核心工具页的 SEO 文案 —— 逐字来自需求(TDK/H1/正文/FAQ 问题),
 * 不改写;FAQ 答案为配套撰写(与页面可见文本一致,供 FAQPage 结构化数据复用)。
 */

export const FAQS: {
  q: string;
  a: string;
  /** 可选:答案末尾内链(渲染为 <a>,JSON-LD 中拼回纯文本) */
  link?: { href: string; label: string; after?: string };
}[] = [
  {
    q: "Is SwitchBG a free photo background changer?",
    a: "Yes. SwitchBG is completely free with no signup, no watermark, and no daily limits. You can change the background of as many photos as you like.",
  },
  {
    q: "How do I change the background of a photo online?",
    a: "Upload your photo, wait a few seconds while the AI cuts out the subject, pick a new background from the library, and download the result. Everything runs in your browser — nothing to install.",
  },
  {
    q: "Does SwitchBG upload my photo?",
    a: "No. SwitchBG processes the image in your browser and does not upload the image file to our servers. The app and its AI model still need an internet connection to load, especially on first use.",
  },
  {
    q: "Is there a change bg photo tool that works on mobile?",
    a: "Yes. SwitchBG runs in any modern mobile browser on iOS and Android, so you can change photo backgrounds without installing an app.",
  },
  {
    q: "Can I change bg for free without a watermark?",
    a: "Yes. SwitchBG never adds watermarks. Your download is a clean image at up to 4096px on the long edge, completely free.",
  },
  {
    q: "Do I need an app to change background photo?",
    a: "No. SwitchBG is a web-based tool that processes images in your browser on desktop and mobile. An internet connection is still required to load the app and any model files that are not already cached.",
  },
  {
    q: "What should I use if I need a remove.bg replacement?",
    a: "SwitchBG is a free alternative for personal, non-commercial background edits: no signup and no watermark. Image files are processed in your browser and are not uploaded by SwitchBG.",
  },
  {
    q: "Can I use SwitchBG as a photo background replacer for product photos?",
    a: "Yes. Upload the product shot, cut it out, and place it on a pure white, a light grey, or one of our scene backgrounds. Marketplaces like Amazon, Shopify and Etsy usually ask for a plain, distraction-free backdrop — a solid color export satisfies that without a studio setup.",
  },
  {
    q: "How do I change the background of a photo to white?",
    a: "Upload the photo, pick the white swatch from the color options, and download. The subject stays cut out against a fully white background at up to 4096px on the long edge, which is what most marketplaces and ID photo requirements expect.",
  },
  {
    q: "Can I change bg in bulk for several photos at once?",
    a: "Yes — select multiple images when you upload and switch backgrounds across the set. Because each photo is processed on your device, there is no server queue and no daily limit on how many you run.",
  },
  {
    q: "What is the best free photo background changer for Windows and Mac?",
    a: "SwitchBG runs in the browser, so the same tool works on Windows, macOS, Linux, and mobile — no installer, no app store, no version to keep updated. Open switchbg.com and upload.",
  },
  {
    q: "Is SwitchBG a good remove bg alternative for sellers and designers?",
    a: "It is free with no credit limit, no signup, and no watermark, and it exports at up to 4096px on the long edge. If you process a steady volume of product or portrait photos, there is nothing to meter and no subscription to maintain.",
  },
  {
    q: "Can I use SwitchBG results commercially?",
    a: "SwitchBG is currently for personal, non-commercial use. See the",
    link: { href: "/model-license", label: "model license", after: "for details." },
  },
];

/** H2 Why SwitchBG 的四条原文,逐字渲染 */
export const WHY_BULLETS: string[] = [
  "Free and unlimited — no credits, no daily cap, no waiting for tomorrow's allowance.",
  "No signup, no email — open the page and upload; there is no account to create or verify.",
  "No watermark, HD output — up to 4096px on the long edge, every time.",
  "Your images stay yours — the photo is processed on your device, and we do not use it for anything else.",
];
