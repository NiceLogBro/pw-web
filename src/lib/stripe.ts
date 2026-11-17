/**
 * Stripe Checkout layer.
 *
 * The storefront is built so a live Stripe account can be switched on without
 * touching UI code:
 *
 *   1. Deploy a small endpoint (Vercel / Cloudflare Worker / Supabase function)
 *      that calls `stripe.checkout.sessions.create(...)` with your secret key.
 *   2. Add two env vars:
 *        VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
 *        VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-api.example.com/checkout
 *   3. Redeploy. `createCheckoutSession()` POSTs the cart and redirects the
 *      browser to the returned Stripe-hosted URL.
 *
 * Until those exist, the same function resolves with a locally generated demo
 * session so the full order flow (review → processing → confirmation) can be
 * exercised end to end.
 *
 * A ready-to-deploy reference endpoint lives in /server/stripe-checkout.ts.
 */

import type { CartLineDetailed } from "@/store/cart";

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

export const stripeConfig = {
  publishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
  checkoutEndpoint: env.VITE_STRIPE_CHECKOUT_ENDPOINT ?? "",
} as const;

export const isStripeLive = Boolean(
  stripeConfig.publishableKey && stripeConfig.checkoutEndpoint,
);

export interface CheckoutCustomer {
  email: string;
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  shipMethod: "standard" | "expedited" | "pickup";
  notes?: string;
}

export interface CheckoutSession {
  id: string;
  url: string | null;
  mode: "stripe" | "demo";
  amountTotal: number;
  demo?: boolean;
}

export interface CheckoutPayload {
  lines: Pick<CartLineDetailed, "product" | "qty" | "lineTotal">[];
  customer: CheckoutCustomer;
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  successUrl: string;
  cancelUrl: string;
}

/** Build the Stripe line_items array the backend should send. */
export function toStripeLineItems(payload: CheckoutPayload) {
  return payload.lines.map((line) => ({
    quantity: line.qty,
    price_data: {
      currency: "usd",
      unit_amount: line.product.price,
      product_data: {
        name: line.product.name,
        description: `${line.product.brand} · ${line.product.shortName}`,
        images: [line.product.image],
        metadata: { slug: line.product.slug },
      },
    },
  }));
}

function demoSession(payload: CheckoutPayload): CheckoutSession {
  const existing = sessionStorage.getItem("pwo-demo-session");
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as CheckoutSession;
      if (parsed.mode === "demo") return parsed;
    } catch {
      /* ignore */
    }
  }
  const session: CheckoutSession = {
    id: `cs_demo_${Math.random().toString(36).slice(2, 12)}`,
    url: null,
    mode: "demo",
    amountTotal: payload.totals.total,
    demo: true,
  };
  try {
    sessionStorage.setItem("pwo-demo-session", JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export async function createCheckoutSession(payload: CheckoutPayload): Promise<CheckoutSession> {
  if (!isStripeLive) {
    // Simulate a network round-trip so the UI's loading state is realistic.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return demoSession(payload);
  }

  const res = await fetch(stripeConfig.checkoutEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      line_items: toStripeLineItems(payload),
      customer: payload.customer,
      shipping: payload.totals.shipping,
      success_url: payload.successUrl,
      cancel_url: payload.cancelUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Stripe checkout failed (${res.status}). ${text}`.trim());
  }

  const data = (await res.json()) as { id?: string; url?: string; amount_total?: number };
  if (!data.url) throw new Error("Checkout session response did not include a URL.");

  return {
    id: data.id ?? "cs_unknown",
    url: data.url,
    mode: "stripe",
    amountTotal: data.amount_total ?? payload.totals.total,
  };
}
