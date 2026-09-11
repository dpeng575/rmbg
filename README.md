# SwitchBG

Photo Background Changer — 上传照片,AI 本地抠图并替换背景,免费输出全分辨率图片。照片全程不离开浏览器。

## 架构

- **Next.js App Router + Tailwind + shadcn/ui**(组件在 `src/components/ui/`,经 registry 手动接入)
- **SEO 服务端渲染**:TDK / H1 / 正文 4 个 H2 / 7 条 FAQ 全部静态 HTML,附 `SoftwareApplication` + `FAQPage` JSON-LD;只有工具区(`BackgroundStudio`)是 `'use client'` 岛
- **状态机**:① idle(上传 + 背景图库预选)→ processing → ready(② 未选背景:棋盘格抠图 + 引导;③ 已选背景:实时合成 + 原图/结果切换 + Download HD)
- **抠图**:`@imgly/background-removal`,模型自托管于 `public/models/`(COOP/COEP 跨域隔离 → WASM 多线程)
- **合成**:[composite.ts](src/lib/composite.ts) canvas 引擎 —— 预览降采样(≤1400px 即时切换),下载时全分辨率导出(HD JPEG q95;透明走 PNG)
- **背景图库**:纯色/渐变 CSS 即时渲染 + 18 张 2400w 照片([prepare-backgrounds.mjs](scripts/prepare-backgrounds.mjs) 下载,已入仓)

## 开发

```bash
npm install        # postinstall 自动下载模型资源(约 76MB)
npm run dev        # http://localhost:3000
npm run build && npm run start
```

模型升级或缺失时:`npm run prepare:models`。背景图源更新:`node scripts/prepare-backgrounds.mjs`。

## 验证脚本

```bash
node scripts/e2e.mjs          # 端到端:上传→抠图→选背景→下载 HD/透明 PNG→重置;断言隔离与自托管
node scripts/e2e-mobile.mjs   # 移动端 390px 全流程 + 格式错误路径
node scripts/screenshot.mjs   # 桌面端全页截图(驱动系统 Chrome)
```
