import { WaffoPancake } from "@waffo/pancake-ts";

let cached: WaffoPancake | null = null;

function resolvePrivateKey(): string {
  const base64 = process.env.WAFFO_PRIVATE_KEY_BASE64;
  if (base64) {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  return process.env.WAFFO_PRIVATE_KEY ?? "";
}

export function getWaffoClient(): WaffoPancake {
  const merchantId = process.env.WAFFO_MERCHANT_ID;
  const privateKey = resolvePrivateKey();
  if (!merchantId || !privateKey) {
    throw new Error(
      "Waffo Pancake is not configured. Set WAFFO_MERCHANT_ID and WAFFO_PRIVATE_KEY (or WAFFO_PRIVATE_KEY_BASE64) in .env.local.",
    );
  }
  if (!cached) {
    cached = new WaffoPancake({ merchantId, privateKey });
  }
  return cached;
}

export function getWaffoProductId(): string | null {
  return process.env.WAFFO_PRODUCT_ID ?? null;
}
