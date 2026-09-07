import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "裁云 rmbg — 一键 AI 抠图,免费 · 浏览器本地处理",
  description:
    "上传图片,AI 在数秒内 100% 自动消除背景,免费输出全分辨率透明 PNG。模型在你的浏览器里运行,图片不上传任何服务器。",
  applicationName: "裁云 rmbg",
};

export const viewport: Viewport = {
  themeColor: "#faf9f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
