import { useEffect, useRef } from "react";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { money } from "@/lib/format";
import { Link, navigate } from "@/lib/router";
import { shipping } from "@/lib/site";
import { useCart } from "@/store/cart";
import { buttonClass } from "@/components/ui";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, totals, setQty, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const progress = Math.min(100, (totals.subtotal / shipping.freeThreshold) * 100);

  return (
    <div
      className={cn("fixed inset-0 z-50", !isOpen && "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={cn(
          "absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        inert={!isOpen}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-ink" />
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">Your cart</h2>
            <span className="rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-bold text-ink tabular-nums">
              {totals.itemCount}
            </span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-ink/5"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-paper ring-1 ring-line">
              <ShoppingBag className="h-7 w-7 text-slate" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-ink">Nothing in here yet</p>
            <p className="mt-1.5 text-sm text-slate">
              Start with the freeze-proof hose or the tip kit that ships with every machine.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              className={buttonClass("primary", "md", "mt-6")}
            >
              Shop the catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping meter */}
            <div className="border-b border-line bg-paper px-5 py-3">
              <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-ink">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-spray-deep" />
                  {totals.hasFreight || totals.freeShippingRemaining === 0
                    ? "Free shipping unlocked"
                    : `${money(totals.freeShippingRemaining)} away from free shipping`}
                </span>
                <span className="text-slate">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full bg-spray transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.slug} className="flex gap-3.5 py-4">
                  <Link to={`/product/${line.slug}`} onClick={closeCart} className="shrink-0">
                    <img
                      src={line.product.image}
                      alt={line.product.name}
                      className="h-20 w-20 rounded-xl border border-line object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold leading-snug text-ink">
                          {line.product.shortName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate">{line.product.brand}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.slug)}
                        className="rounded-md p-1 text-slate transition hover:bg-rust/10 hover:text-rust"
                        aria-label={`Remove ${line.product.shortName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full border border-ink/15 bg-paper">
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition hover:bg-ink/5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-semibold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-30"
                          disabled={line.qty >= 12}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink">
                        {money(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-paper px-5 pb-5 pt-4">
              <dl className="space-y-1.5 text-[13px]">
                <div className="flex justify-between text-slate">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-ink">{money(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-slate">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-ink">
                    {totals.shipping === 0 ? "Free" : money(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-[15px]">
                  <dt className="font-semibold text-ink">Estimated total</dt>
                  <dd className="font-display font-semibold text-ink">{money(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-1.5 text-[11px] text-slate">
                HI GET estimate included · calculated exactly at checkout
              </p>

              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className={buttonClass("primary", "lg", "mt-3.5 w-full")}
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 w-full text-center text-[12px] font-medium text-slate transition hover:text-ink"
              >
                Continue shopping
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate">
                <ShieldCheck className="h-3.5 w-3.5 text-spray-deep" />
                Secure checkout · 30-day fit guarantee
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
