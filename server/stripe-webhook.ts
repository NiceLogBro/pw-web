/**
 * Stripe webhook handler — reference implementation.
 *
 * Stripe sends checkout events here so you can record paid orders, trigger the
 * supplier PO (dropship), and email the customer. Deploy alongside
 * server/stripe-checkout.ts.
 *
 *   stripe listen --forward-to localhost:3000/api/webhook
 *   STRIPE_WEBHOOK_SECRET=whsec_... (from the Stripe dashboard or CLI)
 */

import Stripe from "stripe";

interface SupplierOrder {
  sku: string;
  qty: number;
}

/**
 * Placeholder for your dropship integration. Each supplier has a different
 * API — many small ones still want a CSV email, which is fine. Key point:
 * route the order here, not from the browser, so stock is reserved once.
 */
async function placeSupplierOrder(items: SupplierOrder[], orderRef: string) {
  console.log(`[dropship] order ${orderRef}:`, items);
  // await fetch("<supplier-api>", { method: "POST", body: JSON.stringify({ ... }) })
}

export default async function handler(req: Request): Promise<Response> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return Response.json({ error: "Stripe env vars missing" }, { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2025-10-29.clover" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "No signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad signature";
    return Response.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Fetch the full line items (metadata carries the SKU slug).
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });
      const items: SupplierOrder[] =
        full.line_items?.data
          .map((li) => ({
            sku: li.price?.product as string,
            qty: li.quantity ?? 1,
          }))
          .filter((i) => typeof i.sku === "string") ?? [];

      await placeSupplierOrder(items, session.id);

      // TODO: persist the order (Postgres, Airtable, Google Sheet — anything),
      // then send the confirmation email with tracking-ready wording.
      console.log(`[order] ${session.id} paid ${(session.amount_total ?? 0) / 100} ${session.currency}`);
      break;
    }

    case "checkout.session.expired":
      console.log(`[order] ${event.data.object.id} expired, stock released`);
      break;

    case "charge.refunded":
      console.log(`[order] refund on ${event.data.object.id}`);
      break;

    default:
      break;
  }

  return Response.json({ received: true });
}
