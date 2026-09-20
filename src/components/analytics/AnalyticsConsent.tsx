"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ANALYTICS_SETTINGS_EVENT,
  analyticsIsConfigured,
  enableAnalytics,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  trackEvent,
  type AnalyticsConsent as Consent,
} from "@/lib/analytics";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    if (!analyticsIsConfigured()) return;
    setConsent(readAnalyticsConsent());
    const openSettings = () => setConsent(null);
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    enableAnalytics();
    trackEvent("page_view", {
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
    });
  }, [consent, pathname]);

  if (!analyticsIsConfigured() || consent !== null) return null;

  const choose = (next: Consent) => {
    saveAnalyticsConsent(next);
    setConsent(next);
  };

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 shadow-[0_-8px_24px_hsl(0_0%_0%/0.08)] backdrop-blur-md"
      aria-label="Analytics preferences"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          We use Google Analytics only with your permission to understand which features are used and where the tool fails. Images, filenames and image contents are never sent. See our{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose("denied")}>Decline</Button>
          <Button size="sm" onClick={() => choose("accepted")}>Accept analytics</Button>
        </div>
      </div>
    </aside>
  );
}
