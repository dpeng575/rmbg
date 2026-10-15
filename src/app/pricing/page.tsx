import type { Metadata } from "next";
import { Check, Download, FileImage, Layers, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutButton } from "@/components/pay/CheckoutButton";
import { getWaffoClient, getWaffoProductId } from "@/lib/waffo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "SwitchBG Pro – Unlock HD Exports | SwitchBG",
  description:
    "Upgrade to SwitchBG Pro: HD exports up to 4096px, batch processing and priority support. One-time payment, secure checkout.",
  alternates: { canonical: "/pricing" },
};

const DEFAULT_NAME = "SwitchBG Pro";
const DEFAULT_PRICE = "$4.99";

const FEATURES = [
  { icon: Zap, text: "Priority processing — results in seconds" },
  { icon: Layers, text: "Batch remove backgrounds from up to 50 photos" },
  { icon: FileImage, text: "HD exports up to 4096×4096 px" },
  { icon: Download, text: "Transparent PNG, JPG and WebP output" },
];

type ProductInfo = { name: string; price: string };

async function getProductInfo(): Promise<ProductInfo | null> {
  const productId = getWaffoProductId();
  if (!productId) return null;
  try {
    const client = getWaffoClient();
    const result = await client.graphql.query<{
      onetimeProduct: { name: string; prices: Record<string, { amount: string }> } | null;
    }>({
      query: `query ($id: String!) { onetimeProduct(id: $id) { id name prices } }`,
      variables: { id: productId },
    });
    const product = result.data?.onetimeProduct;
    if (!product) return null;
    const usd = product.prices?.USD?.amount;
    return {
      name: product.name,
      price: usd ? `$${usd}` : DEFAULT_PRICE,
    };
  } catch {
    return null;
  }
}

export default async function PricingPage() {
  const configured = Boolean(getWaffoProductId());
  const product = await getProductInfo();
  const name = product?.name ?? DEFAULT_NAME;
  const price = product?.price ?? DEFAULT_PRICE;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              One-time payment · No subscription
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Upgrade to <span className="text-primary">SwitchBG Pro</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Keep the free tool for quick jobs. Go Pro when you need HD quality, batch
              processing and priority speed — pay once, use it forever.
            </p>
          </div>

          <Card className="mt-10 border-primary/20 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col gap-8 p-8 sm:p-10">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-lg font-semibold">{name}</span>
                <span className="text-5xl font-extrabold tracking-tight">{price}</span>
                <span className="text-sm text-muted-foreground">
                  USD · one-time purchase · VAT included at checkout where applicable
                </span>
              </div>

              <ul className="mx-auto flex w-full max-w-md flex-col gap-3">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span>
                      <Icon className="mr-1.5 inline size-4 text-muted-foreground" />
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {configured ? (
                <CheckoutButton />
              ) : (
                <p className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
                  Checkout is being set up and will be available shortly.
                </p>
              )}
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Payments are processed by Waffo Pancake as merchant of record. After payment you
            will be redirected back to SwitchBG automatically.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
