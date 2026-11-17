import { useEffect, useState } from "react";
import { Check, Clock, Mail, MapPin, Truck } from "lucide-react";
import { Link } from "@/lib/router";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { buttonClass } from "@/components/ui";

interface OrderSnapshot {
  orderNo: string;
  email: string;
  name: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shipMethod: string;
  items: { name: string; qty: number; price: number; image: string }[];
  address: string;
}

export default function Success() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pwo-last-order");
      if (raw) setOrder(JSON.parse(raw) as OrderSnapshot);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const shipLabel =
    order?.shipMethod === "pickup"
      ? "Ready for pickup · Kapolei"
      : order?.shipMethod === "expedited"
        ? "Arrives next business day"
        : "Arrives in 2–3 business days";

  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/10 ring-1 ring-emerald-600/25">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-6 w-6" strokeWidth={3.5} />
            </span>
          </span>
          <h1 className="mt-5 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
            {order ? "You're all set." : "No order found"}
          </h1>
          {order ? (
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-slate">
              Order <strong className="text-ink">{order.orderNo}</strong> is confirmed and a receipt is on
              its way to{" "}
              <strong className="text-ink">{order.email || "your inbox"}</strong>. This preview store
              doesn’t charge a card — connect Stripe to take real payments.
            </p>
          ) : (
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-slate">
              {loaded
                ? "This page shows a confirmation right after checkout. Start by shopping the catalog."
                : "Loading your order…"}
            </p>
          )}
        </div>

        {order && (
          <>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {[
                { icon: Truck, title: shipLabel, note: order.address || "Address on file" },
                { icon: Mail, title: "Receipt sent", note: order.email },
                { icon: Clock, title: site.hours, note: "Questions? Call or text" },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-line bg-paper px-3.5 py-3">
                  <c.icon className="h-4 w-4 text-spray-deep" />
                  <p className="mt-2 text-[11.5px] font-semibold leading-snug text-ink">{c.title}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-slate">{c.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <p className="text-[12.5px] font-semibold text-ink">Order {order.orderNo}</p>
                <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Paid
                </span>
              </div>
              <ul className="divide-y divide-line">
                {order.items.map((i) => (
                  <li key={i.name} className="flex items-center gap-3 px-5 py-3">
                    <img src={i.image} alt="" className="h-12 w-12 rounded-lg border border-line object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-ink">{i.name}</p>
                      <p className="text-[10.5px] text-slate">Qty {i.qty}</p>
                    </div>
                    <span className="text-[12.5px] font-semibold text-ink">{money(i.price)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-1.5 border-t border-line px-5 py-4 text-[12.5px]">
                <div className="flex justify-between text-slate">
                  <dt>Subtotal</dt>
                  <dd className="text-ink">{money(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-slate">
                  <dt>Shipping</dt>
                  <dd className="text-ink">{order.shipping === 0 ? "Free" : money(order.shipping)}</dd>
                </div>
                <div className="flex justify-between text-slate">
                  <dt>HI GET</dt>
                  <dd className="text-ink">{money(order.tax)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                  <dt className="font-semibold text-ink">Total paid</dt>
                  <dd className="font-display text-lg font-semibold text-ink">{money(order.total)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-ink/10 bg-marine px-5 py-4 text-paper">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-spray" />
              <p className="text-[12px] leading-relaxed text-paper/75">
                <strong className="font-semibold text-paper">Next steps.</strong> You’ll get a tracking
                email within one business day. If anything in the box looks wrong, reply to that email
                and we’ll cross-ship the correct part — no need to send the old one first.
              </p>
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className={buttonClass("primary", "lg")}>
            Keep shopping
          </Link>
          <Link to="/support" className={buttonClass("outline", "lg")}>
            Shipping & returns
          </Link>
        </div>
      </div>
    </div>
  );
}
