import { verifyWebhook, type WebhookEvent } from "@waffo/pancake-ts";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-waffo-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  let event: WebhookEvent;
  try {
    event = verifyWebhook(body, signature);
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  // Acknowledge before any slow work; delivery IDs should be deduped
  // against persistent storage once order fulfillment is wired up.
  console.log(
    `[waffo] webhook ${event.eventType} mode=${event.mode} order=${event.data?.orderId} amount=${event.data?.amount} ${event.data?.currency}`,
  );

  switch (event.eventType) {
    case "order.completed":
    case "subscription.activated":
      // TODO: grant entitlements keyed by event.data.orderId.
      break;
    case "subscription.canceled":
      // TODO: revoke access at period end.
      break;
  }

  return new Response("OK", { status: 200 });
}
