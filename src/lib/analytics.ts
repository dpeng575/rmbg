import type { ErrorCode } from "@/types";

export type AnalyticsConsent = "accepted" | "denied";
export type UploadSource = "file" | "drop" | "paste" | "sample";
export type ProcessingMode = "single" | "batch";
export type DurationBucket = "under_3s" | "3_to_10s" | "10_to_30s" | "over_30s";
export type CountBucket = "0" | "1" | "2_to_5" | "6_to_10" | "over_10";
export type BackgroundType = "transparent" | "color" | "gradient" | "library" | "custom";
export type FailureReason = Lowercase<ErrorCode>;

type AnalyticsEvents = {
  page_view: { page_location: string; page_path: string };
  upload_started: {
    input_source: UploadSource;
    mode: ProcessingMode;
    item_count_bucket: CountBucket;
  };
  image_validation_failed: { mode: ProcessingMode; reason: FailureReason };
  processing_started: { mode: ProcessingMode };
  processing_completed: {
    mode: ProcessingMode;
    duration_bucket: DurationBucket;
    downsampled: boolean;
  };
  processing_failed: { mode: ProcessingMode; reason: FailureReason };
  background_selected: { background_type: BackgroundType };
  comparison_used: { view: "original" | "result" };
  download_completed: {
    mode: ProcessingMode;
    format: "png" | "jpeg";
    background_type: BackgroundType;
  };
  batch_started: { item_count_bucket: CountBucket };
  batch_completed: {
    item_count_bucket: CountBucket;
    success_count_bucket: CountBucket;
    failed: boolean;
  };
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const ANALYTICS_SETTINGS_EVENT = "switchbg:analytics-settings";
const CONSENT_KEY = "switchbg.analytics-consent";
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function analyticsIsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID && /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID));
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

// gtag.js 只处理 Arguments 对象:push 普通数组会被静默忽略
// (consent/js/config/事件全部无人消费),所以必须是普通 function
// 并把 arguments 原样 push,不能 ...rest 转数组。
function queueGtag() {
  window.dataLayer ??= [];
  // gtag.js requires the native Arguments object, not a rest-parameter array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments as unknown as unknown[]);
}

export function enableAnalytics() {
  if (!analyticsIsConfigured() || !MEASUREMENT_ID || typeof window === "undefined") return;

  window.gtag ??= queueGtag;
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });

  if (!document.querySelector(`script[data-switchbg-ga="${MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.dataset.switchbgGa = MEASUREMENT_ID;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }
}

function clearAnalyticsCookies() {
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (name === "_ga" || name === "_gid" || name === "_gat" || name?.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }
}

export function saveAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // The in-memory choice still applies for this page when storage is unavailable.
  }

  if (consent === "accepted") {
    enableAnalytics();
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
  }
}

export function trackEvent<Name extends keyof AnalyticsEvents>(
  name: Name,
  parameters: AnalyticsEvents[Name],
) {
  if (!analyticsIsConfigured() || readAnalyticsConsent() !== "accepted") return;
  window.gtag?.("event", name, parameters);
}

export function durationBucket(milliseconds: number): DurationBucket {
  if (milliseconds < 3_000) return "under_3s";
  if (milliseconds < 10_000) return "3_to_10s";
  if (milliseconds < 30_000) return "10_to_30s";
  return "over_30s";
}

export function countBucket(count: number): CountBucket {
  if (count <= 0) return "0";
  if (count <= 1) return "1";
  if (count <= 5) return "2_to_5";
  if (count <= 10) return "6_to_10";
  return "over_10";
}
