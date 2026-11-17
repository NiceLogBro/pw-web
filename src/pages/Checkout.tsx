import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Store,
  Truck,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { navigate } from "@/lib/router";
import { money } from "@/lib/format";
import { site, shipping, tax } from "@/lib/site";
import { useCart } from "@/store/cart";
import { createCheckoutSession, isStripeLive, type CheckoutCustomer } from "@/lib/stripe";
import { Button } from "@/components/ui";

export default function Checkout() {
  const { lines, totals, clear } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipMethod, setShipMethod] = useState<CheckoutCustomer["shipMethod"]>("standard");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState<CheckoutCustomer>({
    email: "",
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "HI",
    zip: "",
    shipMethod: "standard",
    notes: "",
  });

  const empty = lines.length === 0;

  useEffect(() => {
    if (empty) navigate("/shop", { replace: true });
  }, [empty]);

  const shippingCost = useMemo(() => {
    if (totals.hasFreight) return 0;
    if (shipMethod === "pickup") return 0;
    if (shipMethod === "expedited") return totals.subtotal > 0 ? 2495 : 0;
    return totals.shipping;
  }, [shipMethod, totals]);

  const grandTotal = totals.subtotal + shippingCost + totals.tax;

  const set = <K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);
    try {
      const session = await createCheckoutSession({
        lines,
        customer: { ...form, shipMethod },
        totals: { ...totals, shipping: shippingCost, total: grandTotal },
        successUrl: `${import.meta.env.VITE_SITE_URL ?? window.location.origin}/#/success`,
        cancelUrl: `${import.meta.env.VITE_SITE_URL ?? window.location.origin}/#/checkout`,
      });

      if (session.url) {
        window.location.href = session.url;
        return;
      }

      // Demo mode: keep an order snapshot for the confirmation page.
      sessionStorage.setItem(
        "pwo-last-order",
        JSON.stringify({
          orderNo: session.id.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase(),
          email: form.email,
          name: form.name,
          total: grandTotal,
          subtotal: totals.subtotal,
          shipping: shippingCost,
          tax: totals.tax,
          shipMethod,
          items: lines.map((l) => ({ name: l.product.name, qty: l.qty, price: l.lineTotal, image: l.product.image })),
          address: `${form.address1}${form.address2 ? `, ${form.address2}` : ""}, ${form.city}, ${form.state} ${form.zip}`,
        }),
      );
      clear();
      navigate("/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (empty) return null;

  const inputClass =
    "h-11 w-full rounded-xl border border-ink/15 bg-paper px-3.5 text-[13.5px] text-ink outline-none transition placeholder:text-slate/60 focus:border-spray focus:ring-2 focus:ring-spray/15";
  const labelClass = "mb-1.5 block text-[11.5px] font-semibold text-ink";

  return (
    <div className="min-h-screen bg-bone">
      {/* Minimal checkout header */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
                <path d="M4.2 17.5a9 9 0 1 1 15.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />
                <path d="M12 17.2 16.4 10" stroke="#0a9fbb" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="17.4" r="2.1" fill="#0a9fbb" />
              </svg>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-ink">
              PowerWashing<span className="text-spray">Oahu</span>
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            Secure checkout
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="flex items-center gap-1.5 text-[12px] font-medium text-slate transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
        </button>

        <h1 className="mt-3 font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-ink sm:text-[2rem]">
          Checkout
        </h1>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Form */}
          <form onSubmit={submit} className="order-2 lg:order-1">
            {/* Express pay */}
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-[12px] font-semibold text-ink">Express checkout</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setError("Wallet checkout activates when Stripe keys are connected.")}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-ink text-[13px] font-semibold text-paper transition hover:bg-marine"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.19 1.84-.87 3.2-.79 1.62.13 2.83.77 3.63 1.94-3.32 1.99-2.75 6.26.6 7.53-.55 1.27-1.28 2.5-2.51 3.49ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.26 2.57-2.33 4.49-3.74 4.25Z" />
                  </svg>
                  Pay
                </button>
                <button
                  type="button"
                  onClick={() => setError("Wallet checkout activates when Stripe keys are connected.")}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-paper text-[13px] font-semibold text-ink transition hover:border-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <circle cx="9" cy="12" r="6" fill="#EB001B" opacity="0.9" />
                    <circle cx="15" cy="12" r="6" fill="#F79E1B" opacity="0.9" />
                  </svg>
                  Pay
                </button>
              </div>
              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10.5px] font-semibold uppercase tracking-widest text-slate">or pay with card</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              {/* Contact + shipping */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="name" className={labelClass}>Full name</label>
                  <input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Kalani Rivera" className={inputClass} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone <span className="font-normal text-slate">(for delivery texts)</span></label>
                    <input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(808) 555-0142" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="zip" className={labelClass}>ZIP code</label>
                    <input id="zip" required inputMode="numeric" value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="96707" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="address1" className={labelClass}>Street address</label>
                  <input id="address1" required value={form.address1} onChange={(e) => set("address1", e.target.value)} placeholder="91-1200 Fort Barrette Rd" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="address2" className={labelClass}>Apt / unit <span className="font-normal text-slate">(optional)</span></label>
                  <input id="address2" value={form.address2} onChange={(e) => set("address2", e.target.value)} className={inputClass} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className={labelClass}>City</label>
                    <input id="city" required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Kapolei" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClass}>State</label>
                    <select id="state" value={form.state} onChange={(e) => set("state", e.target.value)} className={cn(inputClass, "brand-select")}>
                      {["HI", "CA", "NV", "WA", "OR", "TX", "FL", "GA", "AZ"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className={labelClass}>Delivery notes <span className="font-normal text-slate">(gate codes, placement)</span></label>
                  <input id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Leave behind the gate, brown house" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
              <p className="text-[12px] font-semibold text-ink">Delivery method</p>
              <div className="mt-3 space-y-2">
                {(
                  [
                    {
                      id: "standard",
                      icon: Truck,
                      title: "Standard · 2–3 days O’ahu",
                      note: totals.hasFreight ? "Ground freight included" : shippingCost === 0 ? "Free" : money(shipping.flatRate),
                      disabled: false,
                    },
                    {
                      id: "expedited",
                      icon: Zap,
                      title: "Expedited · next business day",
                      note: money(2495),
                      disabled: totals.hasFreight,
                    },
                    {
                      id: "pickup",
                      icon: Store,
                      title: `Local pickup · ${site.address.split(",")[0]}`,
                      note: "Free · usually ready in 4 hrs",
                      disabled: false,
                    },
                  ] as const
                ).map((opt) => {
                  const active = shipMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => setShipMethod(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                        active ? "border-ink bg-bone" : "border-line hover:border-ink/30",
                        opt.disabled && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                          active ? "border-ink bg-ink" : "border-ink/25",
                        )}
                      >
                        {active && <Check className="h-2.5 w-2.5 text-paper" strokeWidth={4} />}
                      </span>
                      <opt.icon className="h-4 w-4 shrink-0 text-slate" />
                      <span className="flex-1">
                        <span className="block text-[12.5px] font-semibold text-ink">{opt.title}</span>
                        {opt.disabled && <span className="block text-[10.5px] text-slate">Unavailable for freight orders</span>}
                      </span>
                      <span className="text-[12px] font-semibold text-ink">{opt.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-ink">Payment</p>
                <div className="flex items-center gap-1.5">
                  {["VISA", "MC", "AMEX"].map((b) => (
                    <span key={b} className="rounded border border-line bg-bone px-1.5 py-0.5 text-[8.5px] font-bold tracking-wide text-slate">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink/15 bg-bone px-3.5 py-3">
                <CreditCard className="h-4 w-4 text-slate" />
                <div className="flex-1">
                  <p className="text-[12.5px] font-medium text-ink">
                    {isStripeLive ? "Card payment · powered by Stripe" : "Card entry completes on Stripe’s secure page"}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate">
                    {isStripeLive
                      ? "You’ll be redirected to Stripe to finish securely."
                      : "Demo mode — no card is charged and no card data is collected here."}
                  </p>
                </div>
                <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-rust/25 bg-rust/5 px-4 py-3 text-[12px] font-medium text-rust">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="mt-5 w-full" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {isStripeLive ? "Redirecting to Stripe…" : "Creating your order…"}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Place order · {money(grandTotal)}
                </>
              )}
            </Button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate">
              By placing this order you agree to the store’s terms and the 30-day fit guarantee.
              <br />
              {isStripeLive
                ? "Payments are processed by Stripe — card details never touch this site."
                : "Stripe is not connected in this preview, so no payment will be taken."}
            </p>
          </form>

          {/* Order summary */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <div className="rounded-2xl border border-line bg-paper">
                <button
                  type="button"
                  onClick={() => setSummaryOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 lg:hidden"
                >
                  <span className="text-[12.5px] font-semibold text-ink">
                    {summaryOpen ? "Hide" : "Show"} order summary
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-semibold text-ink">{money(grandTotal)}</span>
                    <ChevronDown className={cn("h-4 w-4 text-slate transition-transform", summaryOpen && "rotate-180")} />
                  </span>
                </button>

                <div className={cn("border-t border-line px-5 py-4 lg:border-t-0", !summaryOpen && "hidden lg:block")}>
                  <p className="hidden text-[12px] font-semibold text-ink lg:block">Order summary</p>
                  <ul className="mt-3 space-y-3">
                    {lines.map((l) => (
                      <li key={l.slug} className="flex gap-3">
                        <div className="relative shrink-0">
                          <img src={l.product.image} alt="" className="h-14 w-14 rounded-lg border border-line object-cover" />
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper tabular-nums">
                            {l.qty}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-medium leading-snug text-ink">{l.product.shortName}</p>
                          <p className="text-[10.5px] text-slate">{l.product.brand}</p>
                        </div>
                        <span className="text-[12px] font-semibold text-ink">{money(l.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-4 space-y-1.5 border-t border-line pt-3.5 text-[12.5px]">
                    <div className="flex justify-between text-slate">
                      <dt>Subtotal</dt>
                      <dd className="font-medium text-ink">{money(totals.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-slate">
                      <dt>Shipping</dt>
                      <dd className="font-medium text-ink">{shippingCost === 0 ? "Free" : money(shippingCost)}</dd>
                    </div>
                    <div className="flex justify-between text-slate">
                      <dt>{tax.label}</dt>
                      <dd className="font-medium text-ink">{money(totals.tax)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                      <dt className="text-[13.5px] font-semibold text-ink">Total</dt>
                      <dd className="font-display text-lg font-semibold text-ink">{money(grandTotal)}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 space-y-2 rounded-xl bg-bone px-3.5 py-3">
                    <p className="flex items-center gap-2 text-[11px] font-medium text-ink">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> 30-day fit guarantee
                    </p>
                    <p className="flex items-center gap-2 text-[11px] font-medium text-ink">
                      <Truck className="h-3.5 w-3.5 text-spray-deep" /> Ships within 1 business day
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-dashed border-ink/20 px-4 py-3.5">
                <p className="text-[11.5px] leading-relaxed text-slate">
                  <strong className="font-semibold text-ink">Need it fitted?</strong>{" "}
                  Add installation in Kapolei for $75 — mention it in the delivery notes and we’ll confirm by text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
