"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Could not start checkout. Please try again.");
      }
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Starting checkout…
          </>
        ) : (
          "Buy Pro — secure checkout"
        )}
      </button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Payments are handled by Waffo Pancake. Card data never touches our servers.
      </p>
    </div>
  );
}
