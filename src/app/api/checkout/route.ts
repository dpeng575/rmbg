import { NextResponse } from "next/server";
import { WaffoPancakeError } from "@waffo/pancake-ts";
import { getWaffoClient, getWaffoProductId } from "@/lib/waffo";

export async function POST(request: Request) {
  const productId = getWaffoProductId();
  if (!productId) {
    return NextResponse.json(
      { error: "Checkout is not configured yet (missing WAFFO_PRODUCT_ID)." },
      { status: 503 },
    );
  }

  try {
    const client = getWaffoClient();
    const origin = new URL(request.url).origin;
    const session = await client.checkout.createSession({
      productId,
      currency: "USD",
      successUrl: `${origin}/pricing?payment=success`,
    });
    return NextResponse.json({
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    if (err instanceof WaffoPancakeError) {
      console.error("[waffo] checkout session failed", err.status, err.errors);
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Failed to create checkout session." },
        { status: 502 },
      );
    }
    console.error("[waffo] checkout config error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 503 },
    );
  }
}
