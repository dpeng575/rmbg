# SwitchBG

Photo Background Changer — 上传照片，AI 在浏览器内抠图并替换背景，免费输出全分辨率图片。SwitchBG 不会上传用户选择的图片文件；网页和首次模型资源加载仍需联网。

## 架构

- **Next.js App Router + Tailwind + shadcn/ui**(组件在 `src/components/ui/`,经 registry 手动接入)
- **SEO 服务端渲染**:TDK / H1 / 正文 4 个 H2 / 7 条 FAQ 全部静态 HTML,附 `SoftwareApplication` + `FAQPage` JSON-LD;只有工具区(`BackgroundStudio`)是 `'use client'` 岛
- **状态机**:① idle(上传 + 背景图库预选)→ processing → ready(② 未选背景:棋盘格抠图 + 引导;③ 已选背景:实时合成 + 原图/结果切换 + Download HD)
- **抠图**:`@imgly/background-removal`,模型默认从 imgly 官方 CDN 加载(部署包不含模型);设置 `NEXT_PUBLIC_MODEL_BASE_URL=/models/` 可切换自托管回退(COOP/COEP 跨域隔离 → WASM 多线程)
- **合成**:[composite.ts](src/lib/composite.ts) canvas 引擎 —— 预览降采样(≤1400px 即时切换),下载时全分辨率导出(HD JPEG q95;透明走 PNG)
- **背景图库**:纯色/渐变 CSS 即时渲染 + 18 张 2400w 照片([prepare-backgrounds.mjs](scripts/prepare-backgrounds.mjs) 下载,已入仓)

## 开发

```bash
npm install        # 默认走官方 CDN,不下载模型
npm run dev        # http://localhost:3000
npm run build && npm run start
```

模型资源:默认从 imgly 官方 CDN 加载,零配置。自托管回退(imgly CDN 不可用或想省第三方依赖时):`npm run prepare:models` 下载约 76MB 到 `public/models/`(不入仓),部署时设置 `NEXT_PUBLIC_MODEL_BASE_URL=/models/`;postinstall 只在该环境变量已设置时才自动下载。背景图源更新:`node scripts/prepare-backgrounds.mjs`。

## GA4 埋点

在部署平台配置 `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` 后，站点才会显示分析授权横幅并启用 GA4。用户同意前不会加载 Google 脚本；拒绝后不会发送分析事件。事件只包含预定义的功能类别和结果，不包含图片、文件名、Blob URL 或原始错误信息。

GA4 后台还需要完成以下设置：

- 将 `download_completed` 标记为关键事件。
- 用 `upload_started → processing_completed → background_selected → download_completed` 建立核心漏斗。
- 为需要出现在报告中的自定义参数创建事件级自定义维度。
- 将事件数据保留期限设为可用的最短期限，并保持 Google Signals、广告个性化和 Google Ads 关联关闭。

本地不配置该环境变量时，分析代码和授权界面均保持关闭。

## 许可与使用范围

- 当前实现使用 `@imgly/background-removal@1.7.0`（AGPL-3.0）及其 `isnet_quint8` 模型；不是 BRIA RMBG-1.4。
- 依赖附带的第三方声明将 ISNET 模型标注为 MIT License，来源为 `https://github.com/xuebinqin/DIS`。
- 在项目运营方确认全部分发和合规义务前，SwitchBG 仅供个人、非商业用途。生产公开部署前应公开对应源代码以履行 AGPL，或向 IMG.LY 获取适用的商业许可。

## 验证脚本

```bash
node scripts/e2e.mjs          # 端到端:上传→抠图→选背景→下载 HD/透明 PNG→重置;断言跨域隔离
node scripts/e2e-mobile.mjs   # 移动端 390px 全流程 + 格式错误路径
node scripts/screenshot.mjs   # 桌面端全页截图(驱动系统 Chrome)
```

验证自托管回退时:`NEXT_PUBLIC_MODEL_BASE_URL=/models/` 启动 dev,再以 `SELFHOST=1` 运行 e2e,脚本会断言零外网模型请求。
