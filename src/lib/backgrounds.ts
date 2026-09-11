/** 背景图库数据:纯色/渐变为 CSS 即时渲染,照片素材在 public/backgrounds/ */

export type BgCategory = "people" | "products" | "cars";

export type BackgroundOption =
  | { kind: "transparent"; id: "transparent"; label: "Transparent" }
  | { kind: "color"; id: string; label: string; color: string }
  | {
      kind: "gradient";
      id: string;
      label: string;
      from: string;
      to: string;
    }
  | { kind: "image"; id: string; label: string; src: string };

export const CATEGORY_LABELS: Record<BgCategory, string> = {
  people: "People",
  products: "Products",
  cars: "Cars",
};

export const CATEGORY_ORDER: BgCategory[] = ["people", "products", "cars"];

/** 快速项:透明 + 纯色 + 渐变(置顶,图库上方一行) */
export const QUICK_BACKGROUNDS: BackgroundOption[] = [
  { kind: "transparent", id: "transparent", label: "Transparent" },
  { kind: "color", id: "c-white", label: "White", color: "#ffffff" },
  { kind: "color", id: "c-gray", label: "Light gray", color: "#f1f5f9" },
  { kind: "color", id: "c-sky", label: "Sky", color: "#e0f2fe" },
  { kind: "color", id: "c-navy", label: "Navy", color: "#1d4ed8" },
  { kind: "color", id: "c-emerald", label: "Emerald", color: "#10b981" },
  { kind: "color", id: "c-charcoal", label: "Charcoal", color: "#111827" },
  {
    kind: "gradient",
    id: "g-studio",
    label: "Studio blue",
    from: "#1e3a8a",
    to: "#60a5fa",
  },
  {
    kind: "gradient",
    id: "g-mint",
    label: "Fresh mint",
    from: "#d1fae5",
    to: "#10b981",
  },
  {
    kind: "gradient",
    id: "g-sand",
    label: "Warm sand",
    from: "#f6e7d8",
    to: "#d4a373",
  },
];

/** 照片图库(素材由 scripts/prepare-backgrounds.mjs 下载验证) */
export const LIBRARY: Record<BgCategory, BackgroundOption[]> = {
  people: [
    { kind: "image", id: "p1", label: "City lights", src: "/backgrounds/people/p1.jpg" },
    { kind: "image", id: "p2", label: "Pastel wall", src: "/backgrounds/people/p2.jpg" },
    { kind: "image", id: "p3", label: "Ocean blue", src: "/backgrounds/people/p3.jpg" },
    { kind: "image", id: "p4", label: "Soft gradient", src: "/backgrounds/people/p4.jpg" },
    { kind: "image", id: "p5", label: "Studio beige", src: "/backgrounds/people/p5.jpg" },
    { kind: "image", id: "p6", label: "Golden leaves", src: "/backgrounds/people/p6.jpg" },
  ],
  products: [
    { kind: "image", id: "pr1", label: "Violet mesh", src: "/backgrounds/products/pr1.jpg" },
    { kind: "image", id: "pr2", label: "Minimal beige", src: "/backgrounds/products/pr2.jpg" },
    { kind: "image", id: "pr3", label: "Wood table", src: "/backgrounds/products/pr3.jpg" },
    { kind: "image", id: "pr4", label: "White marble", src: "/backgrounds/products/pr4.jpg" },
    { kind: "image", id: "pr5", label: "Stone texture", src: "/backgrounds/products/pr5.jpg" },
    { kind: "image", id: "pr6", label: "Soft studio", src: "/backgrounds/products/pr6.jpg" },
  ],
  cars: [
    { kind: "image", id: "c1", label: "Open road", src: "/backgrounds/cars/c1.jpg" },
    { kind: "image", id: "c2", label: "Classic front", src: "/backgrounds/cars/c2.jpg" },
    { kind: "image", id: "c3", label: "City traffic", src: "/backgrounds/cars/c3.jpg" },
    { kind: "image", id: "c4", label: "Mountain road", src: "/backgrounds/cars/c4.jpg" },
    { kind: "image", id: "c5", label: "Sunset highway", src: "/backgrounds/cars/c5.jpg" },
    { kind: "image", id: "c6", label: "Night garage", src: "/backgrounds/cars/c6.jpg" },
  ],
};

/** 预览缩略图的 CSS 背景(纯色/渐变即时渲染,透明用棋盘格) */
export function swatchStyle(bg: BackgroundOption): string | null {
  switch (bg.kind) {
    case "color":
      return bg.color;
    case "gradient":
      return `linear-gradient(135deg, ${bg.from}, ${bg.to})`;
    default:
      return null;
  }
}
