import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Photo Background Changer – Free Online Tool | SwitchBG",
  description:
    "Change the background of any photo in seconds. Free, no signup, no watermark, HD quality. Upload a photo, choose a new background, and download instantly.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Photo Background Changer – Free Online Tool | SwitchBG",
    description:
      "Change the background of any photo in seconds. Free, no signup, no watermark, HD quality.",
    url: "/",
    type: "website",
    siteName: "SwitchBG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Background Changer – Free Online Tool | SwitchBG",
    description:
      "Change the background of any photo in seconds. Free, no signup, no watermark, HD quality.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
