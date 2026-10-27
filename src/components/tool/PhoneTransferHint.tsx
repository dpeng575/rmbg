"use client";

import { useState, useSyncExternalStore } from "react";
import QRCodeSVG from "react-qr-code";
import { ChevronDown, Smartphone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/** 扫码落地后用于统计「在手机上继续」转化的 URL 参数 */
export const HANDOFF_QUERY = "src=phone-handoff";

/** 当前页的跨设备接力地址:只保留路径,丢弃已有 query,保证参数唯一可识别 */
export function phoneHandoffUrl(): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${HANDOFF_QUERY}`;
}

/** 本区块只在桌面端展示:需要扫码的人不会正拿着手机 */
const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useDesktopOnly(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    // SSR 与水合首帧按移动端渲染,避免注入不匹配
    () => false,
  );
}

const NATIVE_TIPS: { route: string; how: string }[] = [
  { route: "iPhone → Mac", how: "AirDrop the photo straight to this computer" },
  { route: "iPhone → Windows", how: "Apple Devices app, or icloud.com/photos in a browser" },
  { route: "Android → Windows", how: "Google Quick Share for Windows, or the Phone Link app" },
  { route: "Any devices", how: "WeChat File Transfer, or Telegram \"Saved Messages\"" },
];

export function PhoneTransferHint() {
  const isDesktop = useDesktopOnly();
  const [expanded, setExpanded] = useState(false);

  // 展开只能由点击触发,点击时必在客户端,渲染期直接取 window 是安全的
  if (!isDesktop) return null;
  const handoffUrl = expanded ? phoneHandoffUrl() : null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/30 px-5 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={expanded}
        onClick={() => {
          if (!expanded) trackEvent("phone_hint_expanded", {});
          setExpanded((value) => !value);
        }}
      >
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <Smartphone className="size-4 shrink-0 text-muted-foreground" />
          Photo is on your phone? Send it here — or continue on the phone
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="mt-4 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex flex-col items-center rounded-lg border border-border bg-card px-5 py-4">
            {handoffUrl && (
              <QRCodeSVG value={handoffUrl} size={116} title="QR code: open this page on your phone" />
            )}
            <p className="mt-2.5 text-center text-xs text-muted-foreground">
              Scan to continue on your phone — the photo never leaves it
            </p>
          </div>
          <ul className="space-y-2.5 self-center text-sm">
            {NATIVE_TIPS.map((tip) => (
              <li key={tip.route} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium">{tip.route}</span>
                <span className="text-muted-foreground">{tip.how}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
