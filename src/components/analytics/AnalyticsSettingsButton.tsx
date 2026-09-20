"use client";

import { ANALYTICS_SETTINGS_EVENT, analyticsIsConfigured } from "@/lib/analytics";

export function AnalyticsSettingsButton() {
  if (!analyticsIsConfigured()) return null;

  return (
    <button
      type="button"
      className="hover:text-foreground"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}
    >
      Analytics settings
    </button>
  );
}
