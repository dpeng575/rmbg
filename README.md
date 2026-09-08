# 裁云 rmbg

remove.bg 的浏览器端复刻:上传图片,AI 在本地消除背景,输出全分辨率透明 PNG。图片全程不离开设备。

## 开发

```bash
npm install        # 会自动执行 postinstall 下载模型资源(见下)
npm run dev        # http://localhost:3000
```

## 模型自托管

AI 模型与 ORT 运行时(约 76MB,5 个资源 / 21 个哈希分块)托管在 `public/models/`,运行时不再请求外部 CDN。该目录不入库,由脚本按库版本锁定从官方 CDN 下载生成:

```bash
npm run prepare:models   # 幂等,已存在且大小正确的分块会跳过
```

- `npm install` 后自动执行(postinstall);断网时仅警告,联网后手动补跑即可
- 升级 `@imgly/background-removal` 后需删除 `public/models/` 重新生成(版本与分块哈希绑定)

## 跨域隔离与多线程

`next.config.ts` 为全站下发 COOP/COEP 响应头,使 `crossOriginIsolated` 成立、`SharedArrayBuffer` 可用,ORT 的 WASM 推理因此跑多线程(无 WebGPU 的设备上约 2~4 倍加速)。前提是页面无未带 CORP 的跨源子资源 —— 本站字体(next/font 构建期自托管)、示例图、模型分块均为同源。

## 验证脚本

```bash
npm run build && npm run start
node scripts/e2e.mjs            # 端到端:示例图→处理→下载→评分→重置,断言隔离与自托管
node scripts/e2e-mobile.mjs     # 移动端视口 + 格式/URL 错误路径
node scripts/screenshot.mjs     # 桌面端截图(驱动系统 Chrome)
```
