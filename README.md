# SwitchBG

Photo Background Changer — a privacy-first, browser-based AI tool for removing and replacing photo backgrounds. Images stay in your browser; no account or watermark is required. Try it at https://switchbg.com.

## Features

- Runs background removal locally in the browser with `@imgly/background-removal`.
- Replaces backgrounds with solid colors, gradients, or curated photos.
- Exports full-resolution JPEGs and transparent PNGs.
- Responsive Next.js App Router UI for desktop and mobile.
- Static SEO pages with structured data, FAQ content, and a generated sitemap.

## Development

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build && npm run start
```

Models load from the official IMG.LY CDN by default. For a self-hosted fallback, run `npm run prepare:models`, set `NEXT_PUBLIC_MODEL_BASE_URL=/models/`, and deploy the generated files from `public/models/` (they are not committed). Background assets can be refreshed with `node scripts/prepare-backgrounds.mjs`.

## Validation

```bash
node scripts/e2e.mjs
node scripts/e2e-mobile.mjs
node scripts/screenshot.mjs
```

## Analytics and privacy

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` only when GA4 is needed. Analytics loads after consent and records predefined feature events only; it never includes image data, filenames, blob URLs, or raw errors. User-selected images are processed locally in the browser.

## License and usage

This project uses `@imgly/background-removal@1.7.0` (AGPL-3.0) and the `isnet_quint8` model. The project is intended for personal, non-commercial use until the operator confirms all distribution and licensing obligations. See the repository notices and upstream licenses before deploying publicly.

---

# SwitchBG（中文）

Photo Background Changer 是一个注重隐私、在浏览器内运行的 AI 图片去背景与换背景工具。图片会留在用户浏览器中处理，无需注册，也不会添加水印。在线体验：https://switchbg.com。

## 功能

- 使用 `@imgly/background-removal` 在浏览器本地完成抠图。
- 支持纯色、渐变和图库图片背景。
- 支持导出全分辨率 JPEG 与透明 PNG。
- 基于 Next.js App Router，适配桌面端和移动端。
- 提供静态 SEO 页面、结构化数据、FAQ 内容和自动生成的 sitemap。

## 开发

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build && npm run start
```

默认从 IMG.LY 官方 CDN 加载模型。需要自托管时运行 `npm run prepare:models`，设置 `NEXT_PUBLIC_MODEL_BASE_URL=/models/`，并部署生成到 `public/models/` 的文件（模型文件不会提交到仓库）。更新背景素材可运行 `node scripts/prepare-backgrounds.mjs`。

## 验证

```bash
node scripts/e2e.mjs
node scripts/e2e-mobile.mjs
node scripts/screenshot.mjs
```

## 分析与隐私

只有在需要 GA4 时才配置 `NEXT_PUBLIC_GA_MEASUREMENT_ID`。用户同意后才加载分析脚本，事件仅包含预定义的功能类别，不包含图片、文件名、Blob URL 或原始错误信息。用户选择的图片在浏览器本地处理。

## 许可与使用范围

项目使用 `@imgly/background-removal@1.7.0`（AGPL-3.0）及 `isnet_quint8` 模型。在项目运营方确认完整的分发和许可义务前，项目仅供个人、非商业用途。公开部署前请阅读仓库声明和上游许可证。