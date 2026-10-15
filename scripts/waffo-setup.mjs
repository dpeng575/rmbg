// One-time setup: create the "SwitchBG Pro" one-time product in your Waffo
// Pancake store (test environment by default) and print the Product ID.
//
// Usage:
//   WAFFO_MERCHANT_ID=... WAFFO_PRIVATE_KEY=... node scripts/waffo-setup.mjs
// Optional env:
//   WAFFO_STORE_ID     (defaults to STO_72snpHmpWx6Yf2SYMCWOGg)
//   WAFFO_PRODUCT_NAME (defaults to "SwitchBG Pro")
//   WAFFO_PRICE_AMOUNT (defaults to "4.99")

import { WaffoPancake } from "@waffo/pancake-ts";

const merchantId = process.env.WAFFO_MERCHANT_ID;
const privateKey = process.env.WAFFO_PRIVATE_KEY;
if (!merchantId || !privateKey) {
  console.error("Set WAFFO_MERCHANT_ID and WAFFO_PRIVATE_KEY before running this script.");
  process.exit(1);
}

const client = new WaffoPancake({ merchantId, privateKey });
const storeId = process.env.WAFFO_STORE_ID ?? "STO_72snpHmpWx6Yf2SYMCWOGg";
const name = process.env.WAFFO_PRODUCT_NAME ?? "SwitchBG Pro";
const amount = process.env.WAFFO_PRICE_AMOUNT ?? "4.99";

try {
  const { product } = await client.onetimeProducts.create({
    storeId,
    name,
    description: "HD exports up to 4096px, batch processing and priority support.",
    prices: {
      USD: { amount, taxCategory: "digital_goods" },
    },
    metadata: { source: "switchbg-pricing" },
  });
  console.log("Product created:", product.id);
  console.log("Add this to .env.local:");
  console.log(`WAFFO_PRODUCT_ID=${product.id}`);
} catch (err) {
  if (err?.name === "WaffoPancakeError" || err?.errors) {
    console.error("API error:", err.status, JSON.stringify(err.errors, null, 2));
  } else {
    console.error(err);
  }
  process.exit(1);
}
