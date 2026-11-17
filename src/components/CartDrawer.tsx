import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { products } from "@/data/products";
import { FREE_SHIP_AT, useCart } from "@/store/cart";
import { money } from "@/components/ui";
import { cn } from "@/utils/cn";
import { byId } from "@/data/products";

type Step = "cart" | "checkout" | "done";

const PROMOS: Record<string, { off: number; label: string }> = {
  BLAST10: { off: 10, label: "10% off your order" },
  FIRST5: { off: 5, label: "$5 off your first order" },
};

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, savings, count, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Reset back to the cart view once fully closed.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep((s) => (s === "checkout" ? "cart" : s));
    }, 320);
    return () => clearTimeout(t);
  }, [open]);

  if (!open && step !== "done") return null;
  if (!open) return null;

  const discount = promoApplied ? PROMOS[promoApplied].off : 0;
  const discountedSubtotal = Math.max(0, subtotal * (1 - discount / 100));
  const ship = discountedSubtotal >= FREE_SHIP_AT || discountedSubtotal === 0 ? 0 : 5.95;
  const tax = Math.round(discountedSubtotal * 0.0725 * 100) / 100;
  const total = discountedSubtotal + ship + tax;
  const remaining = Math.max(0, FREE_SHIP_AT - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_AT) * 100);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromoApplied(code);
      setPromoError("");
      setPromo("");
    } else {
      setPromoError("That code isn't active. Try BLAST10.");
    }
  };

  const placeOrder = () => {
    setOrderNo(`BB-${Math.floor(100000 + Math.random() * 899999)}`);
    setStep("done");
    clear();
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] veil" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-2xl drawer-panel">
        {/* header */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-ink/10 px-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" strokeWidth={2} />
            <h2 className="font-display text-[17px] font-extrabold">
              {step === "cart" && `Your cart${count ? ` (${count})` : ""}`}
              {step === "checkout" && "Checkout"}
              {step === "done" && "Order placed"}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---------------- CART ---------------- */}
        {step === "cart" && (
          <>
            {count > 0 && (
              <div className="shrink-0 border-b border-ink/8 bg-white/60 px-5 py-3">
                <div className="flex items-center justify-between text-[12px] font-medium">
                  <span className="flex items-center gap-1.5 text-ink/70">
                    <Truck className="h-4 w-4 text-wash" />
                    {remaining > 0 ? (
                      <>
                        <span className="font-bold">{money(remaining)}</span> to free shipping
                      </>
                    ) : (
                      <span className="font-bold text-wash">Free shipping unlocked</span>
                    )}
                  </span>
                  <span className="text-[11px] text-ink/40 tabular">{Math.round(pct)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      remaining > 0 ? "bg-wash" : "bg-spray",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-ink/5">
                    <ShoppingBag className="h-7 w-7 text-ink/30" />
                  </div>
                  <p className="mt-4 font-display text-xl font-extrabold">Nothing in here yet</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/50">
                    The Rotary 15 is what most people start with — it's the one accessory that makes a
                    machine feel twice as expensive.
                  </p>
                  <a
                    href="#catalog"
                    onClick={() => setOpen(false)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-bold text-paper"
                  >
                    Browse accessories <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <ul className="divide-y divide-ink/8 px-5">
                  {lines.map((line) => {
                    const p = byId(line.id);
                    return (
                      <li key={line.id} className="flex gap-3.5 py-4">
                        <a href={`#pdp-${p.id}`} onClick={() => setOpen(false)} className="shrink-0">
                          <img
                            src={p.image}
                            alt=""
                            className="h-[76px] w-[76px] rounded-xl border border-ink/8 object-cover"
                          />
                        </a>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <a
                                href={`#pdp-${p.id}`}
                                onClick={() => setOpen(false)}
                                className="block truncate text-[13.5px] font-bold hover:underline"
                              >
                                {p.name}
                              </a>
                              <p className="truncate text-[11.5px] text-ink/50">{p.tagline}</p>
                            </div>
                            <button
                              onClick={() => remove(p.id)}
                              className="shrink-0 rounded p-1 text-ink/30 transition-colors hover:bg-sale/5 hover:text-sale"
                              aria-label={`Remove ${p.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-ink/12 bg-white">
                              <button
                                onClick={() => setQty(p.id, line.qty - 1)}
                                className="grid h-8 w-8 place-items-center text-ink/60 hover:bg-ink/5"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-[12.5px] font-bold tabular">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => setQty(p.id, Math.min(99, line.qty + 1))}
                                className="grid h-8 w-8 place-items-center text-ink/60 hover:bg-ink/5"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-[13.5px] font-bold tabular">{money(p.price * line.qty)}</p>
                              {p.compareAt && (
                                <p className="text-[11px] text-ink/35 line-through tabular">
                                  {money(p.compareAt * line.qty)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {count > 0 && (
              <div className="shrink-0 border-t border-ink/10 bg-white/70 p-5">
                {/* promo */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/35" />
                    <input
                      value={promo}
                      onChange={(e) => {
                        setPromo(e.target.value);
                        setPromoError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Promo code"
                      className="h-10 w-full rounded-lg border border-ink/12 bg-white pl-9 pr-3 text-[12.5px] uppercase outline-none placeholder:normal-case placeholder:text-ink/35 focus:border-wash"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="rounded-lg border border-ink/15 px-3.5 text-[12.5px] font-bold hover:bg-ink/5"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-[11.5px] text-sale">{promoError}</p>}
                {promoApplied && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-semibold text-lagoon">
                    <Check className="h-3.5 w-3.5" /> {promoApplied} — {PROMOS[promoApplied].label}
                    <button
                      onClick={() => setPromoApplied(null)}
                      className="ml-1 text-ink/40 underline hover:text-ink"
                    >
                      remove
                    </button>
                  </p>
                )}

                <dl className="mt-3.5 space-y-1.5 text-[13px]">
                  <div className="flex justify-between text-ink/60">
                    <dt>Subtotal</dt>
                    <dd className="tabular">{money(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-lagoon">
                      <dt>Discount ({discount}%)</dt>
                      <dd className="tabular">−{money(subtotal - discountedSubtotal)}</dd>
                    </div>
                  )}
                  {savings > 0 && (
                    <div className="flex justify-between text-sale">
                      <dt>Sale savings</dt>
                      <dd className="tabular">−{money(savings)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-ink/60">
                    <dt>Shipping</dt>
                    <dd className={cn("tabular", ship === 0 && "font-semibold text-lagoon")}>
                      {ship === 0 ? "Free" : money(ship)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 text-[15px] font-extrabold">
                    <dt>Total</dt>
                    <dd className="tabular">{money(total)}</dd>
                  </div>
                </dl>

                <button
                  onClick={() => setStep("checkout")}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-safety py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-safety-deep active:scale-[0.995]"
                >
                  <Lock className="h-4 w-4" /> Checkout securely
                </button>
                <div className="mt-2.5 flex items-center justify-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> SSL
                  </span>
                  <span className="text-ink/15" aria-hidden>•</span>
                  <span>Visa · MC · Amex · Shop Pay</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------------- CHECKOUT ---------------- */}
        {step === "checkout" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <button
                onClick={() => setStep("cart")}
                className="mb-4 text-[12.5px] font-semibold text-ink/50 hover:text-ink"
              >
                ← Back to cart
              </button>

              <div className="rounded-xl border border-wash/25 bg-wash-soft/60 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-wash">Demo store</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink/65">
                  This is a template storefront — no payment is processed and no order is really
                  placed. Connect Stripe or Shopify to take live payments.
                </p>
              </div>

              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  placeOrder();
                }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">Contact</p>
                <input
                  required
                  type="email"
                  placeholder="Email for tracking"
                  className="h-11 w-full rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                />

                <p className="pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                  Shipping address
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="First name"
                    className="h-11 rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                  />
                  <input
                    required
                    placeholder="Last name"
                    className="h-11 rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                  />
                </div>
                <input
                  required
                  placeholder="Street address"
                  className="h-11 w-full rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    required
                    placeholder="City"
                    className="col-span-1 h-11 rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                  />
                  <input
                    required
                    placeholder="State"
                    maxLength={2}
                    className="h-11 rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] uppercase outline-none placeholder:normal-case placeholder:text-ink/35 focus:border-wash"
                  />
                  <input
                    required
                    placeholder="ZIP"
                    inputMode="numeric"
                    className="h-11 rounded-lg border border-ink/12 bg-white px-3.5 text-[13.5px] outline-none placeholder:text-ink/35 focus:border-wash"
                  />
                </div>

                <p className="pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">Payment</p>
                <div className="rounded-lg border border-dashed border-ink/20 bg-white px-3.5 py-3 text-[12.5px] text-ink/50">
                  Payment fields appear here once a processor is connected.
                </div>

                <div className="rounded-xl bg-white/70 p-3.5">
                  <div className="flex justify-between text-[13px] text-ink/60">
                    <span>Items ({count})</span>
                    <span className="tabular">{money(discountedSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-ink/60">
                    <span>Shipping</span>
                    <span className="tabular">{ship === 0 ? "Free" : money(ship)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-ink/60">
                    <span>Estimated tax</span>
                    <span className="tabular">{money(tax)}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between border-t border-ink/10 pt-2 text-[15px] font-extrabold">
                    <span>Total</span>
                    <span className="tabular">{money(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[14px] font-bold text-paper transition-colors hover:bg-graphite"
                >
                  <Lock className="h-4 w-4" /> Place demo order — {money(total)}
                </button>
                <p className="pb-2 text-center text-[11px] text-ink/40">
                  By placing this demo order you confirm nothing is charged.
                </p>
              </form>
            </div>
          </>
        )}

        {/* ---------------- DONE ---------------- */}
        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-lagoon/12">
              <CheckCircle2 className="h-8 w-8 text-lagoon" />
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold">Nice. That's a clean machine.</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">
              Demo order <span className="font-bold text-ink">{orderNo}</span> is confirmed. In a live
              store you'd get a tracking link as soon as the warehouse scans it.
            </p>
            <div className="mt-6 w-full rounded-xl border border-ink/10 bg-white/70 p-4 text-left">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold">
                <Truck className="h-4 w-4 text-wash" /> Estimated delivery
              </p>
              <p className="mt-1 text-[12.5px] text-ink/55">
                {new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                {" – "}
                {new Date(Date.now() + 5 * 864e5).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => {
                setStep("cart");
                setOpen(false);
              }}
              className="mt-6 w-full rounded-full bg-ink py-3.5 text-[14px] font-bold text-paper"
            >
              Keep browsing
            </button>
            <p className="mt-3 text-[11px] text-ink/40">
              Want this live?{" "}
              <a href="#support" onClick={() => setOpen(false)} className="underline">
                See what it takes
              </a>
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

/** Small floating "added to cart" toast for quick adds from the grid. */
export function AddedToast() {
  const { open, setOpen, lastAdded, amountToFreeShip } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded || open) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3600);
    return () => clearTimeout(t);
  }, [lastAdded, open]);

  if (!visible || !lastAdded || open) return null;
  const p = products.find((x) => x.id === lastAdded);
  if (!p) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-rise lg:bottom-6">
      <div className="flex items-center gap-3 rounded-2xl bg-ink p-2.5 pr-3 text-paper shadow-2xl">
        <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-bold">Added — {p.name}</p>
          <p className="text-[11px] text-paper/55">
            {amountToFreeShip > 0
              ? `${money(amountToFreeShip)} to free shipping`
              : "Free shipping unlocked"}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-bold hover:bg-white/15"
        >
          View cart
        </button>
      </div>
    </div>
  );
}
